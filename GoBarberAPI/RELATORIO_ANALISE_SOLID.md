# RELATÓRIO DE ANÁLISE SOLID - GoBarber Services

**Data:** 25/03/2026  
**Foco:** Violações de SRP, OCP e DIP  
**Total de Services Analisados:** 12

---

## 🔴 CRÍTICO (P0) - Corrigir Imediatamente

### 1. **CreateAppointmentService.ts** - VIOLAÇÃO SRP
**Linha:** 24-70 (47 linhas)  
**Tipo:** Single Responsibility Principle - Múltiplas validações entranhadas na lógica

#### Problema:
O método `execute()` acumula 6+ responsabilidades diferentes:
- Validação de entrada (linhas 25-27)
- Validação de regra de negócio - mesmo usuário (linhas 29-31)
- Validação de data no passado (linhas 34-36)
- Validação de horário comercial (linhas 39-42)
- Busca e validação de provider (linhas 45-49)
- Verificação de conflito de agendamento (linhas 52-58)
- Persistência (linha 60-63)

```typescript
// Código atual - 47 linhas de validações + lógica
public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    // 6 blocos de validação diferentes
    if (!provider_id || !user_id || !date) { ... }
    if (provider_id === user_id) { ... }
    if (isBefore(appointmentDate, new Date())) { ... }
    const appointmentHour = getHours(appointmentDate);
    if (appointmentHour < 8 || appointmentHour >= 17) { ... }
    const provider = await this.usersRepository.findById(provider_id);
    if (!provider) { ... }
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(...);
    if (findAppointmentInSameDate) { ... }
    // ... criar agendamento
}
```

#### Impacto do Problema:
- Método com 47 linhas é difícil de testar isoladamente
- Mudanças em validação afetam regra de negócio
- Lógica de validação duplicada se usada em outras operações
- Difícil identificar o fluxo principal

#### Refatoração Sugerida:
Extrair validações para classe separada `AppointmentValidator`:

```typescript
// Novo arquivo: src/modules/appointments/validators/AppointmentValidator.ts
@injectable()
class AppointmentValidator {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  async validateCreateAppointment(data: IRequest): Promise<void> {
    this.validateInputs(data);
    this.validateSameUser(data);
    this.validateDate(data.date);
    this.validateBusinessHours(data.date);
    await this.validateProviderExists(data.provider_id);
    await this.validateNoConflict(data);
  }

  private validateInputs({ provider_id, user_id, date }: IRequest): void {
    if (!provider_id || !user_id || !date) {
      throw new AppError('Provider ID, User ID, and date are required.', 400);
    }
  }

  private validateSameUser({ provider_id, user_id }: IRequest): void {
    if (provider_id === user_id) {
      throw new AppError('You cannot book an appointment with yourself.', 400);
    }
  }

  private validateDate(date: Date): void {
    const appointmentDate = startOfHour(date);
    if (isBefore(appointmentDate, new Date())) {
      throw new AppError('You cannot book an appointment in the past.', 400);
    }
  }

  private validateBusinessHours(date: Date): void {
    const appointmentHour = getHours(startOfHour(date));
    if (appointmentHour < 8 || appointmentHour >= 17) {
      throw new AppError('Appointments can only be booked between 8 AM and 5 PM.', 400);
    }
  }

  private async validateProviderExists(provider_id: string): Promise<void> {
    const provider = await this.usersRepository.findById(provider_id);
    if (!provider) throw new AppError('Provider not found.', 404);
  }

  private async validateNoConflict(data: IRequest): Promise<void> {
    const appointmentDate = startOfHour(data.date);
    const existing = await this.appointmentsRepository.findByDate(
      appointmentDate,
      data.provider_id,
    );
    if (existing) {
      throw new AppError('This appointment time is already booked.', 409);
    }
  }
}

// Service refatorado - responsabilidade única
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('AppointmentValidator')
    private validator: AppointmentValidator,
  ) {}

  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    await this.validator.validateCreateAppointment({ date, provider_id, user_id });

    const appointmentDate = startOfHour(date);
    return this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });
  }
}
```

**Benefícios:**
- Service com 15 linhas claras e testáveis
- Validações reutilizáveis em outros contextos
- Fácil adicionar novas validações
- Interface clara entre validação e negócio

---

### 2. **UpdateProfileService.ts** - VIOLAÇÃO SRP + OCP
**Linha:** 31-68 (38 linhas)  
**Tipo:** Single Responsibility + Open/Closed Principle

#### Problema:
O método `execute()` mistura três responsabilidades:
- Validação de dados básicos (linhas 36-47)
- Validação e atualização de senha (linhas 49-65)
- Persistência (linha 67)

```typescript
public async execute({
    user_id, name, email, old_password, password,
}: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User not found.');

    // RESPONSABILIDADE 1: Validar email duplicado
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }

    // RESPONSABILIDADE 2: Atualizar perfil básico
    user.name = name;
    user.email = email;

    // RESPONSABILIDADE 3: Validar e atualizar senha
    if (password && !old_password) {
      throw new AppError('You need to inform the old password...');
    }
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password, user.password
      );
      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
}
```

#### Impacto:
- **Difícil de testar**: Precisa mockar 3 cenários diferentes
- **Violação OCP**: Adicionar novo campo editável = adicionar mais IFs
- **Acoplamento**: Lógica de senha misturada com perfil
- **Reuso impossível**: Lógica de reset de senha não pode ser usada em outro contexto

#### Refatoração Sugerida:
Dividir em dois services: `UpdateUserProfileService` + `UpdatePasswordService`

```typescript
// src/modules/users/services/UpdateUserProfileService.ts
@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    name,
    email,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User not found.');

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }
}

// src/modules/users/services/UpdatePasswordService.ts
@injectable()
class UpdatePasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    old_password,
    password,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User not found.');

    const passwordMatches = await this.hashProvider.compareHash(
      old_password,
      user.password,
    );

    if (!passwordMatches) {
      throw new AppError('Old password does not match.');
    }

    user.password = await this.hashProvider.generateHash(password);
    await this.usersRepository.save(user);
  }
}

// Usar nos controllers como dois endpoints separados:
// PUT /profile -> UpdateUserProfileService
// PUT /profile/password -> UpdatePasswordService
```

**Benefícios:**
- Cada service com responsabilidade única (9-12 linhas)
- Fácil adicionar novos campos ao perfil
- Lógica de senha reutilizável em reset
- Testes muito mais específicos

---

### 3. **SendForgotPasswordEmailService.ts** - VIOLAÇÃO SRP + DIP
**Linha:** 32-56  
**Tipo:** Single Responsibility + Dependency Inversion

#### Problema:
O service faz múltiplas responsabilidades:
- Busca de usuário (linhas 35-38)
- Geração de token (linha 40)
- Construção de URL (linha 51)
- Construção de template (linhas 42-46)
- Envio de email (linhas 48-56)

```typescript
public async execute({ email }: IRequest): Promise<void> {
    // RESPONSABILIDADE 1: Buscar usuário
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new AppError('User does not exists.');

    // RESPONSABILIDADE 2: Gerar token
    const { token } = await this.userTokensRepository.generate(user.id);

    // RESPONSABILIDADE 3: Construir caminho do template (hardcoded)
    const forgotPasswordTemplate = path.resolve(
      __dirname, '..', 'views', 'forgot_password.hbs',
    );

    // RESPONSABILIDADE 4: Montar URL de reset (hardcoded com process.env)
    // RESPONSABILIDADE 5: Enviar email com variáveis
    await this.mailProvider.sendMail({
      to: { name: user.name, email: user.email },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
      },
    });
}
```

#### Impacto:
- **Hardcoding crítico**: Path do template e URL dependem de constantes
- **Difícil testar**: Impossível testar construção de URL isoladamente
- **Múltiplas razões para mudar**: Email template, URL, geração de token
- **Duplicação de lógica**: Construção de URL pode ser duplicada em outros services

#### Refatoração Sugerida:
Extrair construção de URL para interface separada (`IResetPasswordUrlBuilder`):

```typescript
// src/shared/container/providers/MailProvider/utils/IResetPasswordUrlBuilder.ts
interface IResetPasswordUrlBuilder {
  buildResetPasswordUrl(token: string): string;
}

// src/shared/container/providers/MailProvider/implementations/ResetPasswordUrlBuilder.ts
class ResetPasswordUrlBuilder implements IResetPasswordUrlBuilder {
  buildResetPasswordUrl(token: string): string {
    return `${process.env.APP_WEB_URL}/reset-password?token=${token}`;
  }
}

// Service refatorado
@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('ResetPasswordUrlBuilder')
    private urlBuilder: IResetPasswordUrlBuilder,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new AppError('User does not exists.');

    const { token } = await this.userTokensRepository.generate(user.id);
    const resetLink = this.urlBuilder.buildResetPasswordUrl(token);

    await this.sendResetEmail(user, resetLink);
  }

  private async sendResetEmail(user: User, resetLink: string): Promise<void> {
    const forgotPasswordTemplate = path.resolve(
      __dirname, '..', 'views', 'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: { name: user.name, email: user.email },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: { name: user.name, link: resetLink },
      },
    });
  }
}
```

**Benefícios:**
- URL builder testável isoladamente
- Service com responsabilidade clara
- Fácil mudar formato de URL sem mexer no service principal
- Padrão Strategy para construção de emails

---

## 🟡 IMPORTANTE (P1) - Corrigir em Sprint

### 4. **ListProviderDayAvailabilityService.ts** - VIOLAÇÃO OCP
**Linha:** 41-48  
**Tipo:** Open/Closed Principle - Valores hardcoded

#### Problema:
```typescript
const hourStart = 8;  // Hardcoded
const eachHourArray = Array.from(
  { length: 10 },    // Hardcoded: 8h - 17h
  (_, index) => index + hourStart,
);
```

Se precisar mudar horário comercial (ex: 9h - 18h), precisa editar o arquivo.

#### Refatoração Sugerida:
```typescript
// src/config/appointmentConfig.ts
export const appointmentConfig = {
  businessHours: {
    start: 8,
    end: 17,
  },
};

// Service refatorado
@injectable()
class ListProviderDayAvailabilityService {
  private businessHourStart = appointmentConfig.businessHours.start;
  private businessHourEnd = appointmentConfig.businessHours.end;

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id, year, month, day,
    });

    const hours = Array.from(
      { length: this.businessHourEnd - this.businessHourStart },
      (_, i) => i + this.businessHourStart,
    );

    const currentDate = new Date();
    return hours.map(hour => ({
      hour,
      available: !this.hasAppointment(hour, appointments) 
        && this.isAfterNow(year, month, day, hour, currentDate),
    }));
  }

  private hasAppointment(hour: number, appointments: Appointment[]): boolean {
    return appointments.some(a => getHours(a.date) === hour);
  }

  private isAfterNow(year: number, month: number, day: number, hour: number, now: Date): boolean {
    return isAfter(new Date(year, month - 1, day, hour), now);
  }
}
```

---

### 5. **ListProviderMonthAvailabilityService.ts** - VIOLAÇÃO OCP
**Linha:** 35  
**Tipo:** Open/Closed Principle - Valores hardcoded

#### Problema:
```typescript
return {
  day,
  available:
    isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,  // Hardcoded limit
};
```

Se precisar alterar limite de 10 agendamentos/dia para 12, precisa editar.

#### Refatoração Sugerida:
```typescript
// src/config/appointmentConfig.ts
export const appointmentConfig = {
  businessHours: { start: 8, end: 17 },
  maxAppointmentsPerDay: 10,
};

// Service refatorado
@injectable()
class ListProviderMonthAvailabilityService {
  private maxAppointmentsPerDay = appointmentConfig.maxAppointmentsPerDay;

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id, year, month,
    });

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const days = Array.from(
      { length: numberOfDaysInMonth },
      (_, i) => i + 1,
    );

    return days.map(day => ({
      day,
      available: this.isDayAvailable(day, year, month, appointments),
    }));
  }

  private isDayAvailable(day: number, year: number, month: number, appointments: Appointment[]): boolean {
    const appointmentsInDay = appointments.filter(
      a => getDate(a.date) === day,
    );
    const compareDate = new Date(year, month - 1, day, 23, 59, 59);
    return isAfter(compareDate, new Date()) 
      && appointmentsInDay.length < this.maxAppointmentsPerDay;
  }
}
```

---

## 🟢 BOM (P2) - Melhorias Futuras

### Observações Positivas:

✅ **ListProviderAppointmentsService.ts** - Bem estruturado
- Responsabilidade única: listar + cachear
- Injeção correta de dependências
- Código legível com 25 linhas

✅ **ListProvidersService.ts** - Bem estruturado  
- Responsabilidade única: listar + cachear
- Padrão consistente com ListProviderAppointmentsService

✅ **ShowProfileService.ts** - Bem estruturado
- Responsabilidade única: recuperar perfil
- Injeção correta, validação simples

✅ **AuthenticateUserService.ts** - Bem estruturado
- Responsabilidade única: autenticar
- Validações e JWT gerados claramente (20 linhas)

✅ **CreateUserService.ts** - Bem estruturado
- Responsabilidade única: criar usuário
- Padrão simples e consistente

✅ **ResetPasswordService.ts** - Bem estruturado
- Responsabilidade única: resetar senha
- 3 validações claras seguidas de atualização

✅ **UpdateUserAvatarService.ts** - Bem estruturado
- Responsabilidade única: atualizar avatar
- Delete antigo + salvar novo (padrão correto)

---

## 📊 RESUMO EXECUTIVO

| Service | Crítico | Tipo | Impacto | Esforço |
|---------|---------|------|--------|--------|
| CreateAppointmentService | 🔴 SRP | Validações indiscriminadas | Alto | Médio |
| UpdateProfileService | 🔴 SRP | Múltiplas responsabilidades | Alto | Médio |
| SendForgotPasswordEmailService | 🔴 SRP | Construção de URL hardcoded | Alto | Médio |
| ListProviderDayAvailabilityService | 🟡 OCP | Horários hardcoded | Médio | Baixo |
| ListProviderMonthAvailabilityService | 🟡 OCP | Limite hardcoded | Médio | Baixo |
| Demais Services | ✅ OK | Bem estruturados | Baixo | - |

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### Sprint 1 (Crítico):
1. Criar `AppointmentValidator` para `CreateAppointmentService`
2. Dividir `UpdateProfileService` em 2 services
3. Extrair `ResetPasswordUrlBuilder` para `SendForgotPasswordEmailService`

### Sprint 2 (Importante):
1. Crear `appointmentConfig.ts` com constantes de horário
2. Refatorar `ListProviderDayAvailabilityService` e `ListProviderMonthAvailabilityService`

### Estimativa:
- **Sprint 1**: 8-12 story points
- **Sprint 2**: 4-5 story points
- **Total**: 12-17 story points

---

## 📝 NOTAS ADICIONAIS

### Padrões Descobertos:
1. ✅ Injeção de dependência consistente (tsyringe)
2. ✅ Cache provider bem utilizado em services de listagem
3. ✅ AppError para erro padrão
4. ⚠️ Validações espalhadas em múltiplos places
5. ⚠️ Constantes de negócio hardcoded

### Recomendações Gerais:
- Criar `validators/` folder para centralizar regras de validação
- Criar `config/` com constantes de negócio
- Considerar usar `class-validator` para validações automáticas
- Implementar padrão Strategy para variações de comportamento
