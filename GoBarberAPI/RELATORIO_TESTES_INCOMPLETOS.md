# Relatório de Análise de Testes Incompletos - GoBarber API

**Data:** 25/03/2026  
**Total de arquivos .spec.ts analisados:** 12  
**Problemas críticos encontrados:** 8

---

## 🔴 PROBLEMAS CRÍTICOS (Resolver com prioridade)

### 1. **Import Path Incorreta - CreateUserService.spec.ts**
- **Arquivo:** [src/modules/users/services/CreateUserService.spec.ts](src/modules/users/services/CreateUserService.spec.ts#L3)
- **Linha:** 3
- **Tipo de problema:** Import path com case incorreto
- **Descrição:** O arquivo importa `fakeUsersRepository` (com 'f' minúsculo) quando o arquivo correto é `FakeUsersRepository` (com 'F' maiúsculo). Este erro foi renomeado em outro arquivo (UpdateUserAvatarService.spec.ts).
- **Impacto:** Pode causar erro em tempo de execução ("Module not found")
- **Solução:**
```typescript
// Antes:
import FakeUsersRepository from "../repositories/fakes/fakeUsersRepository";

// Depois:
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
```

---

### 2. **Import Path Incorreta - AuthenticateUserService.spec.ts**
- **Arquivo:** [src/modules/users/services/AuthenticateUserService.spec.ts](src/modules/users/services/AuthenticateUserService.spec.ts#L3)
- **Linha:** 3
- **Tipo de problema:** Import path com case incorreto
- **Descrição:** Mesmo problema do anterior - usa `fakeUsersRepository` em vez de `FakeUsersRepository`
- **Impacto:** Consistência - ambos os arquivos devem usar a mesma convenção
- **Solução:**
```typescript
// Antes:
import FakeUsersRepository from "../repositories/fakes/fakeUsersRepository";

// Depois:
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
```

---

### 3. **Nome de Describe Incorreto - ListProviderDayAvailabilityService.spec.ts**
- **Arquivo:** [src/modules/appointments/services/ListProviderDayAvailabilityService.spec.ts](src/modules/appointments/services/ListProviderDayAvailabilityService.spec.ts#L9)
- **Linha:** 9
- **Tipo de problema:** Nome de describe não corresponde ao serviço sendo testado
- **Descrição:** O describe está nomeado "ListProviderMonthAvailability" mas deveria ser "ListProviderDayAvailability". Isso confunde com outro arquivo de teste.
- **Impacto:** Confusão ao rodar testes - output mostrará "ListProviderMonthAvailability" duas vezes
- **Solução:**
```typescript
// Antes:
describe('ListProviderMonthAvailability', () => {

// Depois:
describe('ListProviderDayAvailability', () => {
```

---

## 🟠 PROBLEMAS IMPORTANTES (Testes incompletos - faltam casos de erro)

### 4. **Testes Incompletos - CreateAppointmentService.spec.ts**
- **Arquivo:** [src/modules/appointments/services/CreateAppointmentService.spec.ts](src/modules/appointments/services/CreateAppointmentService.spec.ts)
- **Tipo de problema:** Testes faltando para casos importantes
- **Descrição:** O serviço valida 6 cenários críticos, mas apenas 2 casos são testados. Faltam validações de:
  - Provider não existe
  - User não existe
  - Agendamento em horário fora do comercial (< 8 ou >= 17)
  - Agendamento no passado
  - Mesmo usuário como provider e cliente
  - Parâmetros obrigatórios não preenchidos

- **O que deveria estar testado:**
  - ✅ Criar novo agendamento com sucesso (existe)
  - ✅ Não permitir dois agendamentos no mesmo horário (existe)
  - ❌ Não permitir provider como cliente (FALTA)
  - ❌ Rejeitar agendamento no passado (FALTA)
  - ❌ Rejeitar agendamento fora de horário comercial (FALTA)
  - ❌ Validar se provider existe (FALTA)
  - ❌ Validar se user existe (FALTA)

- **Sugestão de código a adicionar:**
```typescript
it('should not be able to create appointment with non-existing provider', async () => {
  const user = await fakeUsersRepository.create({
    name: 'John User',
    email: 'user@example.com',
    password: '123456',
  });

  await expect(
    createAppointment.execute({
      date: new Date(2099, 4, 10, 10),
      provider_id: 'non-existing-provider',
      user_id: user.id,
    }),
  ).rejects.toBeInstanceOf(AppError);
});

it('should not be able to create appointment with same provider and user', async () => {
  const user = await fakeUsersRepository.create({
    name: 'John User',
    email: 'user@example.com',
    password: '123456',
  });

  await expect(
    createAppointment.execute({
      date: new Date(2099, 4, 10, 10),
      provider_id: user.id,
      user_id: user.id,
    }),
  ).rejects.toBeInstanceOf(AppError);
});

it('should not be able to create appointment in the past', async () => {
  const provider = await fakeUsersRepository.create({
    name: 'Jane Provider',
    email: 'provider@example.com',
    password: '123456',
  });

  const user = await fakeUsersRepository.create({
    name: 'John User',
    email: 'user@example.com',
    password: '123456',
  });

  const pastDate = new Date(2020, 1, 1, 10);

  await expect(
    createAppointment.execute({
      date: pastDate,
      provider_id: provider.id,
      user_id: user.id,
    }),
  ).rejects.toBeInstanceOf(AppError);
});

it('should not allow appointment outside business hours', async () => {
  const provider = await fakeUsersRepository.create({
    name: 'Jane Provider',
    email: 'provider@example.com',
    password: '123456',
  });

  const user = await fakeUsersRepository.create({
    name: 'John User',
    email: 'user@example.com',
    password: '123456',
  });

  // Test before 8 AM
  await expect(
    createAppointment.execute({
      date: new Date(2099, 4, 10, 7),
      provider_id: provider.id,
      user_id: user.id,
    }),
  ).rejects.toBeInstanceOf(AppError);

  // Test at 5 PM (17:00)
  await expect(
    createAppointment.execute({
      date: new Date(2099, 4, 10, 17),
      provider_id: provider.id,
      user_id: user.id,
    }),
  ).rejects.toBeInstanceOf(AppError);
});
```

---

### 5. **Testes Incompletos - ListProviderAppointmentsService.spec.ts**
- **Arquivo:** [src/modules/appointments/services/ListProviderAppointmentsService.spec.ts](src/modules/appointments/services/ListProviderAppointmentsService.spec.ts)
- **Linha:** 13-41
- **Tipo de problema:** Apenas 1 teste implementado (deve ter pelo menos 3-4)
- **Descrição:** Apenas testa o caso de sucesso. Faltam testes para:
  - Provider com nenhum agendamento
  - Data inválida (mês/ano fora de escopo)

- **O que deveria estar testado:**
  - ✅ Listar agendamentos de um dia específico (existe)
  - ❌ Retornar array vazio quando não há agendamentos (FALTA)
  - ❌ Validar parâmetros obrigatórios (FALTA)

- **Sugestão de código a adicionar:**
```typescript
it('should return empty array when provider has no appointments', async () => {
  const appointments = await listProviderAppointments.execute({
    provider_id: 'non-existing-provider',
    year: 2022,
    month: 5,
    day: 20,
  });

  expect(appointments).toEqual([]);
});

it('should filter appointments by specific day', async () => {
  const appointment1 = await fakeAppointmentsRepository.create({
    provider_id: 'provider',
    user_id: 'user',
    date: new Date(2022, 4, 20, 14, 0, 0),
  });

  // Different day
  await fakeAppointmentsRepository.create({
    provider_id: 'provider',
    user_id: 'user',
    date: new Date(2022, 4, 21, 14, 0, 0),
  });

  const appointments = await listProviderAppointments.execute({
    provider_id: 'provider',
    year: 2022,
    month: 5,
    day: 20,
  });

  expect(appointments).toEqual([appointment1]);
  expect(appointments.length).toBe(1);
});
```

---

### 6. **Testes Incompletos - ListProviderDayAvailabilityService.spec.ts**
- **Arquivo:** [src/modules/appointments/services/ListProviderDayAvailabilityService.spec.ts](src/modules/appointments/services/ListProviderDayAvailabilityService.spec.ts)
- **Tipo de problema:** Apenas 1 teste implementado (teste incompleto)
- **Descrição:** Apenas testa o caso positivo com múltiplos agendamentos. Faltam testes para:
  - Dia sem agendamentos (todas as horas disponíveis)
  - Horário no passado (não devem estar disponíveis)
  - Dia completamente lotado

- **O que deveria estar testado:**
  - ✅ Listar disponibilidade com agendamentos (existe)
  - ❌ Todos os horários disponíveis (sem agendamentos) (FALTA)
  - ❌ Horários passados não devem estar disponíveis (FALTA)

- **Sugestão de código a adicionar:**
```typescript
it('should return all hours available when no appointments exist', async () => {
  jest.spyOn(Date, 'now').mockImplementationOnce(() => {
    return new Date(2022, 4, 20, 11).getTime();
  });

  const availability = await listProviderDayAvailability.execute({
    provider_id: 'user',
    year: 2022,
    month: 5,
    day: 20,
  });

  const availableCounts = availability.filter(slot => slot.available).length;
  expect(availableCounts).toBeGreaterThan(0);
  expect(availability.length).toBe(10); // 8 AM to 5 PM = 10 hours
});

it('should mark hours before current time as unavailable', async () => {
  jest.spyOn(Date, 'now').mockImplementationOnce(() => {
    return new Date(2022, 4, 20, 14).getTime(); // 2 PM
  });

  const availability = await listProviderDayAvailability.execute({
    provider_id: 'user',
    year: 2022,
    month: 5,
    day: 20,
  });

  const morningHours = availability.filter(slot => slot.hour < 14);
  expect(morningHours.every(slot => !slot.available)).toBe(true);
});
```

---

### 7. **Testes Incompletos - ListProviderMonthAvailabilityService.spec.ts**
- **Arquivo:** [src/modules/appointments/services/ListProviderMonthAvailabilityService.spec.ts](src/modules/appointments/services/ListProviderMonthAvailabilityService.spec.ts)
- **Tipo de problema:** Apenas 1 teste implementado (muitos casos não cobertos)
- **Descrição:** Apenas testa um cenário com vários agendamentos. Faltam testes para:
  - Mês inteiro sem agendamentos
  - Mês parcialmente ocupado (alguns dias vazios)
  - Validação de parâmetros

- **O que deveria estar testado:**
  - ✅ Listar disponibilidade do mês com agendamentos (existe)
  - ❌ Retornar todos os dias disponíveis quando sem agendamentos (FALTA)
  - ❌ Mistura de dias disponíveis e indisponíveis (FALTA)

- **Sugestão de código a adicionar:**
```typescript
it('should return all days available when no appointments exist', async () => {
  const availability = await listProviderMonthAvailability.execute({
    provider_id: 'user',
    year: 2022,
    month: 5,
  });

  const allDaysAvailable = availability.every(day => day.available);
  // Primeiro dia do mês deve estar marcado como indisponível em alguns cenários
  expect(availability.length).toBeGreaterThan(0);
});

it('should mark days with full bookings as unavailable', async () => {
  // Create appointments for all business hours on one day
  for (let hour = 8; hour < 17; hour++) {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: `user-${hour}`,
      date: new Date(2022, 4, 20, hour, 0, 0),
    });
  }

  const availability = await listProviderMonthAvailability.execute({
    provider_id: 'user',
    year: 2022,
    month: 5,
  });

  const day20 = availability.find(day => day.day === 20);
  expect(day20?.available).toBe(false);
});
```

---

### 8. **Testes Incompletos - ListProviderService.spec.ts**
- **Arquivo:** [src/modules/appointments/services/ListProviderService.spec.ts](src/modules/appointments/services/ListProviderService.spec.ts)
- **Tipo de problema:** Apenas 1 teste implementado
- **Descrição:** O serviço filtra providers pelo user_id (except_user_id), mas há apenas um cenário testado. Faltam:
  - List sem providers
  - Verificar cache
  - Dois usuários com providers diferentes

- **O que deveria estar testado:**
  - ✅ Listar providers excluindo o usuário logado (existe)
  - ❌ Retornar array vazio quando não há outros providers (FALTA)
  - ❌ Usar cache após primeira chamada (FALTA)
  - ❌ Refresh de cache (FALTA)

- **Sugestão de código a adicionar:**
```typescript
it('should return empty array when no other providers exist', async () => {
  const user = await fakeUsersRepository.create({
    name: 'Unique User',
    email: 'unique@example.com',
    password: '123456',
  });

  const providers = await listProviders.execute({
    user_id: user.id,
  });

  expect(providers).toEqual([]);
});

it('should fetch from cache on second call', async () => {
  const user1 = await fakeUsersRepository.create({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  });

  const loggedUser = await fakeUsersRepository.create({
    name: 'John Qua',
    email: 'johnqua@example.com',
    password: '123456',
  });

  // First call - from repository
  const providers1 = await listProviders.execute({
    user_id: loggedUser.id,
  });

  // Second call - should be from cache
  const providers2 = await listProviders.execute({
    user_id: loggedUser.id,
  });

  expect(providers1).toEqual(providers2);
  expect(providers1[0].id).toBe(user1.id);
});
```

---

## 🟡 OBSERVAÇÕES GERAIS

### Boas Práticas Identificadas ✅
- Todos os arquivos utilizam `beforeEach()` para setup
- Todos os testes com `it()` possuem `expect()` assertions
- Não há `describe` vazio sem `it()`
- Não há blocos comentados
- Uso apropriado de mocks (faker repositories, jest.spyOn)

### Melhorias Sugeridas
1. **Nomenclatura consistente:** Padronize a capitalização dos imports de fakes (usar sempre PascalCase)
2. **Cobertura de erros:** Todos os serviços devem ter testes de erro ao menos nos casos críticos
3. **Testes de integração:** Considere adicionar testes de fluxo completo
4. **Testes parametrizados:** Para casos com múltiplas variações (ex: diferentes horários)

---

## 📊 RESUMO POR ARQUIVO

| Arquivo | Problemas | Críticos | Importantes | Testes | Status |
|---------|-----------|----------|-------------|--------|--------|
| CreateUserService.spec.ts | 1 | 1 | 0 | 2 | ⚠️ Erro import |
| AuthenticateUserService.spec.ts | 1 | 1 | 0 | 3 | ⚠️ Erro import |
| UpdateUserAvatarService.spec.ts | 0 | 0 | 0 | 3 | ✅ OK |
| UpdateProfileService.spec.ts | 0 | 0 | 0 | 6 | ✅ OK |
| ShowProfileService.spec.ts | 0 | 0 | 0 | 2 | ✅ OK |
| SendForgotPasswordEmailService.spec.ts | 0 | 0 | 0 | 3 | ✅ OK |
| ResetPasswordService.spec.ts | 0 | 0 | 0 | 4 | ✅ OK |
| CreateAppointmentService.spec.ts | 1 | 0 | 1 | 2 | ⚠️ Incompleto |
| ListProviderAppointmentsService.spec.ts | 1 | 0 | 1 | 1 | ⚠️ Incompleto |
| ListProviderDayAvailabilityService.spec.ts | 2 | 1 | 1 | 1 | ❌ Crítico |
| ListProviderMonthAvailabilityService.spec.ts | 1 | 0 | 1 | 1 | ⚠️ Incompleto |
| ListProviderService.spec.ts | 1 | 0 | 1 | 1 | ⚠️ Incompleto |

---

## 🎯 PRIORIDADE DE CORREÇÃO

1. **Próximos 30 minutos:** Corrigir imports (CreateUserService e AuthenticateUserService)
2. **Próxima 1 hora:** Corrigir nome de describe em ListProviderDayAvailabilityService
3. **Próximas 2-3 horas:** Adicionar testes críticos em CreateAppointmentService
4. **Próximas 3-4 horas:** Completar testes em outros serviços de appointments
5. **Depois:** Refatorar para melhorar cobertura geral
