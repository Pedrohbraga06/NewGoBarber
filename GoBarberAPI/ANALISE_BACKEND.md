# Análise de Qualidade do Backend - GoBarber API

**Data da Análise:** 25/03/2026  
**Status:** ⚠️ CRÍTICO - Múltiplos problemas encontrados

---

## 📋 Sumário Executivo

- **Problemas Críticos:** 3
- **Problemas Importantes:** 5
- **Melhorias Recomendadas:** 7
- **Total:** 15 problemas identificados

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. Typo Grave em Classe UpdateUserAvatarService
**Severidade:** CRÍTICO  
**Arquivo:** [src/modules/users/services/UpdateUserAvatarService.ts](src/modules/users/services/UpdateUserAvatarService.ts#L13)  
**Problema:**
```typescript
class UpadteUserAvatarSErvice {  // ❌ "Upadte" em vez de "Update"
  // ...
}
export default UpadteUserAvatarSErvice;
```
**Impacto:** 
- Problema de legibilidade grave
- Pode gerar confusão em refatorações futuras
- Outros imports precisam fazer referência a essa nomenclatura incorreta

**Solução:** Renomear para `UpdateUserAvatarService`

---

### 2. Typo em Arquivo UpdateProfileSevice.ts
**Severidade:** CRÍTICO  
**Arquivo:** [src/modules/users/services/UpdateProfileSevice.ts](src/modules/users/services/UpdateProfileSevice.ts)  
**Problema:**
- Arquivo nomeado como `UpdateProfileSevice.ts` (Sevice em vez de Service)
- Classe está corretamente nomeada como `UpdateProfileService`
- Importações em outros arquivos precisam usar o nome errado

**Referências do Problema:**
- [UpdateProfileService.spec.ts](src/modules/users/services/UpdateProfileService.spec.ts#L5) - importação com typo
- [ProfileController.ts](src/modules/users/infra/http/controllers/ProfileController.ts#L5) - importação com typo

**Solução:** Renomear arquivo para `UpdateProfileService.ts`

---

### 3. Falta de Await em Teste UpdateUserAvatarService.spec.ts
**Severidade:** CRÍTICO  
**Arquivo:** [src/modules/users/services/UpdateUserAvatarService.spec.ts](src/modules/users/services/UpdateUserAvatarService.spec.ts#L41)  
**Problema:**
```typescript
it('should not be able to update a avatar from non existing user', async () => {
  // ...
  expect(updateUserAvatar.execute({  // ❌ Falta await
    user_id: 'none-existing-user',
    avatarFilename:'avatar.jpg',
  })).rejects.toBeInstanceOf(AppError);
});
```
**Impacto:** Teste pode não falhar quando deveria falhar - falha no padrão de teste

**Solução:** Adicionar `await` antes do `expect`

---

## 🟠 PROBLEMAS IMPORTANTES

### 1. Inconsistência de Nomenclatura em Fakes - fakeUsersTokensRepository.ts
**Severidade:** IMPORTANTE  
**Arquivo:** [src/modules/users/repositories/fakes/fakeUsersTokensRepository.ts](src/modules/users/repositories/fakes/fakeUsersTokensRepository.ts)  
**Problema:** Nome do arquivo com inconsistência (fakeUsers vs fakeUser)  
**Padrão:** Comparar com `fakeUsersRepository.ts` - há inconsistência

**Solução:** Renomear para `FakeUserTokensRepository.ts` (seguir padrão PascalCase para classes)

---

### 2. Arquivo DTO Mislocado - IFindAllInMonthFromProviderDTO
**Severidade:** IMPORTANTE  
**Arquivo:** [src/modules/appointments/repositories/fakes/IFindAllInMonthFromProviderDTO.ts](src/modules/appointments/repositories/fakes/IFindAllInMonthFromProviderDTO.ts)  
**Problema:**
- DTO localizado em `fakes/` quando deveria estar em `dtos/`
- Importação em IAppointmentsRepository fazendo referência a arquivo em pasta errada

```typescript
// Em IAppointmentsRepository.ts (linha 4)
import IFindAllInMonthFromProviderDTO from './fakes/IFindAllInMonthFromProviderDTO';
```

**Solução:** 
1. Mover arquivo para `src/modules/appointments/dtos/IFindAllInMonthFromProviderDTO.ts`
2. Atualizar import em `IAppointmentsRepository.ts`

---

### 3. Inconsistência Classe vs Nome do Arquivo
**Severidade:** IMPORTANTE  
**Arquivo:** [src/modules/appointments/services/ListProviderService.ts](src/modules/appointments/services/ListProviderService.ts#L14)  
**Problema:**
- Arquivo: `ListProviderService.ts` (sem 's')
- Classe: `ListProvidersService` (com 's')
- Confunde ao fazer buscas no codebase

**Exemplo:**
```typescript
// Spec importa corretamente a classe
import ListProvidersService from './ListProviderService';
```

**Solução:** Renomear arquivo para `ListProvidersService.ts` para manter consistência

---

### 4. Falta de Await em Teste UpdateProfileService.spec.ts
**Severidade:** IMPORTANTE  
**Arquivo:** [src/modules/users/services/UpdateProfileService.spec.ts](src/modules/users/services/UpdateProfileService.spec.ts#L32)  
**Problema:**
```typescript
it('should not be able update the profile from non-existing user', async () => {
  expect(
    updateProfile.execute({  // ⚠️ Pode estar faltando await
      user_id: 'non-existing-user-id',
      name: 'Test',
      email: 'test@example.com',
    }),
  ).rejects.toBeInstanceOf(AppError);
});
```

**Solução:** Adicionar `await` antes do `expect`

---

### 5. Validações Muito Condensadas em CreateAppointmentService
**Severidade:** IMPORTANTE  
**Arquivo:** [src/modules/appointments/services/CreateAppointmentService.ts](src/modules/appointments/services/CreateAppointmentService.ts#L24-L62)  
**Problema:**
- Método `execute()` contém 6+ validações sequenciais
- Viola princípio Single Responsibility (SRP) do SOLID
- Lógica de validação deveria ser extraída para classe/utility separada

**Exemplo do Problema:**
```typescript
public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
  // 1. Validar entrada
  if (!provider_id || !user_id || !date) { ... }
  
  // 2. Não permitir mesmo usuário
  if (provider_id === user_id) { ... }
  
  // 3. Verificar se é data no passado
  if (isBefore(appointmentDate, new Date())) { ... }
  
  // 4. Verificar horário comercial
  const appointmentHour = getHours(appointmentDate);
  if (appointmentHour < 8 || appointmentHour >= 17) { ... }
  
  // 5. Verificar se provider existe
  const provider = await this.usersRepository.findById(provider_id);
  if (!provider) { ... }
  
  // 6. Verificar se horário já está ocupado
  const findAppointmentInSameDate = ...
  if (findAppointmentInSameDate) { ... }
  
  // Finalmente: criar appointment
  const appointment = ...
}
```

**Solução:**
1. Criar classe `AppointmentValidator` ou `IAppointmentValidator`
2. Extrair validações para método separado
3. Injetar validator como dependência

---

## 🟡 MELHORIAS RECOMENDADAS

### 1. Falta de Validação de Input em DTOs
**Severidade:** MELHORIA  
**Arquivos:**
- [src/modules/appointments/dtos/ICreateAppointmentDTO.ts](src/modules/appointments/dtos/ICreateAppointmentDTO.ts)
- [src/modules/users/dtos/ICreateUserDTO.ts](src/modules/users/dtos/ICreateUserDTO.ts)

**Problema:** DTOs são apenas interfaces sem validação de campos obrigatórios  
**Sugestão:** Usar decorators de validação (class-validator)

---

### 2. Duplicação de Código - Validação de Email em Múltiplos Serviços
**Severidade:** MELHORIA  
**Padrão:** CreateUserService, UpdateProfileService e SendForgotPasswordEmailService fazem validações similares

**Sugestão:** Criar serviço centralizado de validação de email

---

### 3. Testes Incompletos em UpdateProfileService.spec.ts
**Severidade:** MELHORIA  
**Arquivo:** [src/modules/users/services/UpdateProfileService.spec.ts](src/modules/users/services/UpdateProfileService.spec.ts)  
**Problema:** 
- Teste de atualização de senha seta a senha direto sem hash (linha 82)
- No teste, espera que `updatedUser.password === '123123'` mas `FakeHashProvider` retorna 123123 sem hash

```typescript
expect(updatedUser.password).toBe('123123');  // ⚠️ Não valida se foi hashado
```

---

### 4. Nome de Variável Inconsistente em Testes
**Severidade:** MELHORIA  
**Arquivo:** [src/modules/users/services/CreateUserService.spec.ts](src/modules/users/services/CreateUserService.spec.ts#L10)  
**Problema:** Variável nomeada como `CreateUser` (PascalCase) quando deveria ser `createUser`

```typescript
let CreateUser: CreateUserService;  // ❌ Deveria ser camelCase
```

---

### 5. Faque Repository para Notifications Não Implementado
**Severidade:** MELHORIA  
**Arquivo:** [src/modules/notifications/repositories/INotificationsRepository.ts](src/modules/notifications/repositories/INotificationsRepository.ts)  
**Problema:** Repository de notificações existe mas não há implementação fake para testes

**Solução:** Criar `FakeNotificationsRepository.ts` em `src/modules/notifications/repositories/fakes/`

---

### 6. Falta de Validação de Entrada em CreateAppointmentService
**Severidade:** MELHORIA  
**Arquivo:** [src/modules/appointments/services/CreateAppointmentService.ts](src/modules/appointments/services/CreateAppointmentService.ts#L25)  
**Problema:** Validação manual quando deveria usar DTO com decorators

```typescript
if (!provider_id || !user_id || !date) {
  throw new AppError('Provider ID, User ID, and date are required.', 400);
}
```

---

### 7. Console.log ou Debug Statements
**Severidade:** MELHORIA  
**Verifiação:** Procurar por statements de debug no código  
**Recomendação:** Implementar logging adequado com winston ou pino

---

## 📊 Matriz de Priorização

| Problema | Crítico | Importante | Impacto | Esforço | Prioridade |
|----------|---------|-----------|---------|--------|-----------|
| UpadteUserAvatarSErvice | ✅ | | Alto | Baixo | P0 |
| UpdateProfileSevice | ✅ | | Alto | Baixo | P0 |
| Falta Await (UpdateUserAvatar) | ✅ | | Médio | Baixo | P0 |
| fakeUsersTokensRepository | | ✅ | Médio | Baixo | P1 |
| IFindAllInMonthFromProviderDTO | | ✅ | Médio | Baixo | P1 |
| ListProviderService | | ✅ | Baixo | Baixo | P1 |
| Falta Await (UpdateProfile) | | ✅ | Médio | Baixo | P1 |
| CreateAppointmentService | | ✅ | Alto | Médio | P1 |
| Validação DTOs | | | Médio | Médio | P2 |
| Duplicação Validação Email | | | Médio | Médio | P2 |
| Testes Incompletos | | | Baixo | Baixo | P2 |
| Variáveis Inconsistentes | | | Baixo | Baixo | P2 |
| FakeNotificationsRepository | | | Baixo | Baixo | P2 |
| Logging | | | Baixo | Médio | P3 |

---

## 🔧 Checklist de Ações Recomendadas

### Imediato (P0 - Crítico)
- [ ] Renomear classe de `UpadteUserAvatarSErvice` para `UpdateUserAvatarService`
- [ ] Renomear arquivo de `UpdateProfileSevice.ts` para `UpdateProfileService.ts`
- [ ] Adicionar `await` em teste UpdateUserAvatarService.spec.ts line 41

### Curto Prazo (P1 - Importante)
- [ ] Renomear arquivo `fakeUsersTokensRepository.ts` seguindo padrão
- [ ] Mover `IFindAllInMonthFromProviderDTO.ts` para pasta `dtos/`
- [ ] Renomear `ListProviderService.ts` para `ListProvidersService.ts`
- [ ] Adicionar `await` em teste UpdateProfileService.spec.ts
- [ ] Refatorar validações em CreateAppointmentService
- [ ] Atualizar todos os imports afetados pelos renames

### Médio Prazo (P2 - Melhorias)
- [ ] Implementar validação em DTOs com class-validator
- [ ] Centralizar lógica de validação de email
- [ ] Completar cobertura de testes
- [ ] Standardizar nomenclatura de variáveis em testes
- [ ] Implementar FakeNotificationsRepository

### Longo Prazo (P3 - Melhorias Futuras)
- [ ] Implementar logging estruturado
- [ ] Refatorar serviços muito grandes
- [ ] Adicionar mais cobertura de testes para edge cases

---

## 📚 Recomendações Gerais de Arquitetura

### 1. Padrão de Nomenclatura
✅ **Correto:**
- Classe: `PascalCase` (ex: `CreateUserService`)
- Arquivo: `PascalCase.ts` (ex: `CreateUserService.ts`)
- Variáveis/funções: `camelCase` (ex: `createUser`)
- Fake repositories: `Fake<Entity>Repository` (ex: `FakeUsersRepository`)

### 2. Estrutura de Pastas
✅ **Correto:**
```
modules/
  MODULE_NAME/
    dtos/              # DTOs de entrada/saída
    repositories/      # Interfaces e implementações
      fakes/          # Implementações fake para testes
    services/         # Lógica de negócio
    infra/
      typeorm/        # Implementações com banco de dados
      http/
```

### 3. Princípios SOLID
- **S**ingle Responsibility: CreateAppointmentService viola (muitas validações)
- **O**pen/Closed: Adicionar validator strategy poderia melhorar
- **L**iskov Substitution: DTOs deveriam ser mais robustos
- **I**nterface Segregation: Bem implementado nos repositories
- **D**ependency Inversion: Bem implementado com injeção de dependência (tsyringe)

---

## 📝 Conclusão

O backend possui uma **arquitetura bem organizada com boas práticas**, mas apresenta **problemas críticos de nomenclatura** que precisam ser corrigidos imediatamente. A refatoração de validações em CreateAppointmentService também é importante para manter a qualidade do código.

**Score Geral:** 📊 **7.5/10**

