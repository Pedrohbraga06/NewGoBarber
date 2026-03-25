# 🛠️ Guia de Desenvolvimento - GoBarber

## 📚 Índice
1. [Arquitetura](#arquitetura)
2. [Padrões de Código](#padrões-de-código)
3. [Git Workflow](#git-workflow)
4. [Testing](#testing)
5. [Performance](#performance)
6. [Security](#security)

---

## 🏗️ Arquitetura

### Backend (Node.js + Express + TypeORM)

```
src/
├── modules/
│   ├── appointments/
│   │   ├── dtos/              # Data Transfer Objects
│   │   ├── infra/             # HTTP & Database
│   │   │   ├── http/
│   │   │   │   ├── controller/
│   │   │   │   └── routes/
│   │   │   └── typeorm/
│   │   ├── repositories/      # Database interfaces
│   │   └── services/          # Business logic
│   ├── users/
│   └── notifications/
├── shared/
│   ├── container/             # Dependency Injection
│   ├── errors/                # Custom errors
│   └── infra/
│       ├── http/              # Server setup
│       └── typeorm/           # Database connection
└── config/                    # Configuration
```

### Frontend Web (React + TypeScript)

```
src/
├── components/                # Reutilizáveis
├── pages/                     # Rotas principais
├── hooks/                     # Custom hooks
├── services/                  # API & extern services
├── styles/                    # Global & shared styles
├── utils/                     # Helpers
├── types/                     # TypeScript types
└── routes/                    # Route definition
```

### Mobile (React Native)

```
src/
├── components/
├── pages/
├── services/
├── store/
│   └── modules/
│       ├── auth/
│       ├── user/
│       └── rootReducer
├── routes/
└── config/
```

---

## 💻 Padrões de Código

### Backend Services

**Sempre use Dependency Injection:**
```typescript
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IRequest): Promise<Appointment> {
    // Validar entrada
    if (!data.provider_id || !data.user_id || !data.date) {
      throw new AppError('Missing required fields', 400);
    }

    // Lógica de negócio
    
    // Retornar resultado
    return result;
  }
}
```

**Error Handling:**
```typescript
try {
  const result = await this.repository.findById(id);
  if (!result) {
    throw new AppError('Not found', 404);
  }
  return result;
} catch (error) {
  if (error instanceof AppError) {
    throw error;
  }
  // Log unexpected errors
  console.error('Unexpected error:', error);
  throw new AppError('Internal server error', 500);
}
```

### Frontend Components

**Use Custom Hooks:**
```tsx
// ✅ Bom: Custom hook reutilizável
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<T>(url);
        setData(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

**Use useRef para inputs:**
```tsx
// ✅ Melhor performance
const emailRef = useRef<HTMLInputElement>(null);

const handleSubmit = (e: FormEvent) => {
  const email = emailRef.current?.value || '';
  // ...
};
```

**Sempre validar antes de submeter:**
```tsx
const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  try {
    // Validar entrada
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const data = { email, password };
    await schema.validate(data, { abortEarly: false });

    // Fazer requisição
    await api.post('/sessions', data);
  } catch (err) {
    // Tratar erro
  }
}, []);
```

### Type Safety

**TypeScript - Use Interfaces:**
```typescript
// ✅ Bom
interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  user: User;
  token: string;
}

// ❌ Evitar
interface User {
  [key: string]: any;
}
```

---

## 🌿 Git Workflow

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Novo feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação de código
- `refactor`: Refatoração
- `perf`: Performance
- `test`: Testes
- `chore`: Build, dependencies

**Exemplos:**
```bash
# Feature
git commit -m "feat(auth): add 2FA support"

# Bug fix
git commit -m "fix(appointments): prevent past bookings"

# Documentation
git commit -m "docs(readme): update setup instructions"

# Performance
git commit -m "perf(dashboard): add caching for appointments"
```

### Branch Naming

```bash
feature/add-2fa-support
bugfix/prevent-past-bookings
docs/update-readme
refactor/extract-validation-logic
```

### PR Template

```markdown
## Description
Breve descrição do que foi alterado

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
```

---

## 🧪 Testing

### Backend Tests

**Service Unit Tests:**
```typescript
import AppError from '@shared/errors/AppError';
import FakeRepository from '../repositories/fakes/FakeRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeRepository: FakeRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeRepository = new FakeRepository();
    createAppointment = new CreateAppointmentService(fakeRepository);
  });

  it('should create an appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: 'provider-1',
      user_id: 'user-1',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-1');
  });

  it('should not create appointment for past date', async () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 2);

    await expect(
      createAppointment.execute({
        provider_id: 'provider-1',
        user_id: 'user-1',
        date: pastDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
```

### Frontend Tests

**Component Testing:**
```typescript
import { render, screen, userEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('is disabled during loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Run Tests

```bash
# Backend
cd GoBarberAPI
npm test
npm test -- --coverage

# Frontend Web
cd GoBarberFront/gobarberweb
npm test

# Mobile
cd GoBarberApp/GoBarberMobile
npm test
```

---

## ⚡ Performance

### Backend Optimization

**1. Database Queries:**
```typescript
// ❌ N+1 Problem
const users = await usersRepository.find();
for (const user of users) {
  const appointments = await appointmentsRepository.findByUserId(user.id);
}

// ✅ Use Joins
const users = await usersRepository.createQueryBuilder('user')
  .leftJoinAndSelect('user.appointments', 'appointments')
  .getMany();
```

**2. Caching:**
```typescript
// Use Redis para dados que não mudam frequentemente
public async execute({ user_id }: IRequest): Promise<User[]> {
  let users = await this.cacheProvider.recover<User[]>(
    `providers-list:${user_id}`,
  );

  if (!users) {
    users = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    await this.cacheProvider.save(
      `providers-list:${user_id}`,
      instanceToInstance(users),
    );
  }

  return users;
}
```

**3. Pagination:**
```typescript
// Sempre paginar grandes resultados
const appointments = await appointmentsRepository
  .createQueryBuilder('appointment')
  .where('appointment.date >= :startDate', { startDate: start })
  .skip(page * limit)
  .take(limit)
  .getMany();
```

### Frontend Optimization

**1. Code Splitting:**
```tsx
import React, { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

**2. Memoization:**
```tsx
// ✅ Evitar re-renders desnecessários
const Component = React.memo(({ data }: Props) => {
  return <div>{data.name}</div>;
}, (prevProps, nextProps) => prevProps.data.id === nextProps.data.id);
```

**3. useCallback:**
```tsx
// ✅ Memoizar callbacks
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []);
```

---

## 🔒 Security

### Authentication & Authorization

**1. Token Validation:**
```typescript
// ✅ Always validate token format
const [scheme, token] = authHeader.split(' ');

if (scheme !== 'Bearer' || !token) {
  throw new AppError('Invalid token format', 401);
}
```

**2. Password Hashing:**
```typescript
// ✅ Usar bcryptjs
import bcryptjs from 'bcryptjs';

const hashedPassword = await bcryptjs.hash(password, 8);
const passwordMatched = await bcryptjs.compare(password, hashedPassword);
```

**3. Environment Variables:**
```bash
# ✅ Never commit secrets
# .env
DATABASE_URL=postgres://user:password@host:port/db
JWT_SECRET=your-super-secret-key

# .gitignore
.env
.env.local
```

### Input Validation

**1. Server-side validation:**
```typescript
// ✅ Sempre validar no backend
if (!email || !password) {
  throw new AppError('Email and password are required', 400);
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new AppError('Invalid email format', 400);
}
```

**2. SQL Injection Prevention:**
```typescript
// ✅ Use parameterized queries com TypeORM
const user = await usersRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .getOne();

// ❌ Nunca faça:
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

### CORS & Headers

```typescript
// ✅ Configure CORS properly
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// ✅ Add security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});
```

---

## 📋 Checklists

### Antes de fazer Push

- [ ] Código segue o style guide
- [ ] Tests passam (100% coverage para novos código)
- [ ] Sem console.log ou debug statements
- [ ] Sem erros do TypeScript
- [ ] Sem warnings do linter
- [ ] Commit message é descritivo
- [ ] PR description é clara

### Code Review

- [ ] Código é legível e bem comentado
- [ ] Sem código duplicado
- [ ] Error handling é robusto
- [ ] Performance é aceitável
- [ ] Security concerns foram endereçados
- [ ] Tests cobrem casos críticos

---

## 🎓 Recursos

### Backend
- [Express Docs](https://expressjs.com/)
- [TypeORM Docs](https://typeorm.io/)
- [TSyringe](https://github.com/microsoft/tsyringe)

### Frontend
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [React Testing Library](https://testing-library.com/react)

### Mobile
- [React Native Docs](https://reactnative.dev/)
- [Redux](https://redux.js.org/)

---

**Última atualização**: 4 de Fevereiro de 2026
