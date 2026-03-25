$ErrorActionPreference = 'Stop'

$runtimePath = Join-Path (Join-Path $PSScriptRoot 'gobarberweb') '.runtime'

if (-not (Test-Path $runtimePath)) {
  Write-Host 'Nenhum processo gerenciado encontrado.'
  exit 0
}

foreach ($name in @('frontend', 'backend')) {
  $statePidPath = Join-Path $runtimePath "$name.pid"

  if (-not (Test-Path $statePidPath)) {
    Write-Host "$name nao foi iniciado por este script."
    continue
  }

  $processId = Get-Content $statePidPath | Select-Object -First 1
  $process = Get-Process -Id $processId -ErrorAction SilentlyContinue

  if ($process) {
    Stop-Process -Id $processId -Force
    Write-Host "$name finalizado (PID $processId)."
  } else {
    Write-Host "$name ja nao estava em execucao."
  }

  Remove-Item $statePidPath -Force
}
