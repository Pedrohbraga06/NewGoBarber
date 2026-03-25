$ErrorActionPreference = 'Stop'

$frontendPath = Join-Path $PSScriptRoot 'gobarberweb'
$backendPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'GoBarberAPI'
$runtimePath = Join-Path $frontendPath '.runtime'

if (-not (Test-Path $frontendPath)) {
  throw "Frontend nao encontrado em $frontendPath"
}

if (-not (Test-Path $backendPath)) {
  throw "Backend nao encontrado em $backendPath"
}

New-Item -ItemType Directory -Path $runtimePath -Force | Out-Null

function Get-ListeningPid {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Port
  )

  $connection = netstat -ano -p tcp | Select-String -Pattern "LISTENING\s+(\d+)$" | Where-Object {
    $_.Line -match "[:\.]$Port\s+"
  } | Select-Object -First 1

  if (-not $connection) {
    return $null
  }

  $match = [regex]::Match($connection.Line, 'LISTENING\s+(\d+)$')

  if (-not $match.Success) {
    return $null
  }

  return [int]$match.Groups[1].Value
}

function Wait-ForPort {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Port,
    [int]$TimeoutSeconds = 60
  )

  $timer = [System.Diagnostics.Stopwatch]::StartNew()

  while ($timer.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    $portPid = Get-ListeningPid -Port $Port

    if ($portPid) {
      return $portPid
    }

    Start-Sleep -Seconds 2
  }

  return $null
}

function Read-LogFile {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path
  )

  if (-not (Test-Path $Path)) {
    return ''
  }

  return Get-Content $Path -Raw
}

function Ensure-Process {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name,
    [Parameter(Mandatory = $true)]
    [int]$Port,
    [Parameter(Mandatory = $true)]
    [string]$WorkingDirectory,
    [Parameter(Mandatory = $true)]
    [string]$FilePath,
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments,
    [Parameter(Mandatory = $true)]
    [string]$StdOutPath,
    [Parameter(Mandatory = $true)]
    [string]$StdErrPath,
    [int]$StartupTimeoutSeconds = 60
  )

  $existingPid = Get-ListeningPid -Port $Port

  if ($existingPid) {
    Write-Host "$Name ja esta rodando na porta $Port (PID $existingPid)."
    return [pscustomobject]@{
      Name = $Name
      Port = $Port
      Pid = $existingPid
      StartedHere = $false
    }
  }

  if (Test-Path $StdOutPath) {
    Remove-Item $StdOutPath -Force
  }

  if (Test-Path $StdErrPath) {
    Remove-Item $StdErrPath -Force
  }

  Start-Process `
    -FilePath $FilePath `
    -ArgumentList $Arguments `
    -WorkingDirectory $WorkingDirectory `
    -WindowStyle Hidden `
    -RedirectStandardOutput $StdOutPath `
    -RedirectStandardError $StdErrPath | Out-Null

  $listeningPid = Wait-ForPort -Port $Port -TimeoutSeconds $StartupTimeoutSeconds

  if (-not $listeningPid) {
    $stdout = Read-LogFile -Path $StdOutPath
    $stderr = Read-LogFile -Path $StdErrPath

    throw "$Name nao iniciou na porta $Port.`nSTDOUT:`n$stdout`nSTDERR:`n$stderr"
  }

  Write-Host "$Name iniciado na porta $Port (PID $listeningPid)."

  return [pscustomobject]@{
    Name = $Name
    Port = $Port
    Pid = $listeningPid
    StartedHere = $true
  }
}

$nodeCommand = (Get-Command node -ErrorAction Stop).Source
$npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source

$backendState = Ensure-Process `
  -Name 'Backend' `
  -Port 3333 `
  -WorkingDirectory $backendPath `
  -FilePath $nodeCommand `
  -Arguments @(
    '-r',
    'ts-node/register/transpile-only',
    '-r',
    'tsconfig-paths/register',
    'src/shared/infra/http/server.ts'
  ) `
  -StdOutPath (Join-Path $runtimePath 'backend.log') `
  -StdErrPath (Join-Path $runtimePath 'backend.err.log') `
  -StartupTimeoutSeconds 30

$frontendState = Ensure-Process `
  -Name 'Frontend' `
  -Port 3000 `
  -WorkingDirectory $frontendPath `
  -FilePath $npmCommand `
  -Arguments @('start') `
  -StdOutPath (Join-Path $runtimePath 'frontend.log') `
  -StdErrPath (Join-Path $runtimePath 'frontend.err.log') `
  -StartupTimeoutSeconds 90

foreach ($state in @($backendState, $frontendState)) {
  $statePidPath = Join-Path $runtimePath ("{0}.pid" -f $state.Name.ToLowerInvariant())

  if ($state.StartedHere) {
    Set-Content -Path $statePidPath -Value $state.Pid
  } elseif (Test-Path $statePidPath) {
    Remove-Item $statePidPath -Force
  }
}

Write-Host ''
Write-Host 'Aplicacao pronta:'
Write-Host 'Frontend: http://localhost:3000'
Write-Host 'Backend:  http://localhost:3333'
Write-Host ''
Write-Host "Logs em: $runtimePath"
