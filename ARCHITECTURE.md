# 🏗️ ARCHITECTURE.md

## Arquitetura do Sistema GoBarber

Este documento descreve a arquitetura completa do sistema GoBarber, uma plataforma de agendamento de serviços de beleza.

## 📋 Visão Geral

O GoBarber é uma aplicação full-stack composta por:
- **Backend API** (Node.js + Express + TypeORM)
- **Frontend Web** (React + TypeScript)
- **Mobile App** (React Native)
- **Banco de dados** (PostgreSQL)
- **Cache/Queue** (Redis - opcional)
- **Email** (Nodemailer - opcional)

## 🏛️ Arquitetura Backend

### Tecnologias
- **Node.js** com **TypeScript**
- **Express.js** para API REST
- **TypeORM** para ORM
- **PostgreSQL** como banco principal
- **Redis** para cache e filas
- **JWT** para autenticação
- **TSyringe** para injeção de dependências

### Estrutura de Diretórios
```
GoBarberAPI/
├── src/
│   ├── modules/           # Módulos de negócio
│   │   ├── users/         # Gestão de usuários
│   │   ├── appointments/  # Agendamentos
│   │   └── notifications/ # Notificações
│   ├── shared/            # Código compartilhado
│   │   ├── container/     # DI container
│   │   ├── errors/        # Tratamento de erros
│   │   ├── infra/         # Infraestrutura
│   │   └── utils/         # Utilitários
│   ├── config/            # Configurações
│   └── @types/            # TypeScript declarations
```

### Padrões Arquiteturais

#### SOLID Principles
- **Single Responsibility**: Cada classe tem uma responsabilidade
- **Open/Closed**: Extensível sem modificar código existente
- **Liskov Substitution**: Subtipos substituíveis
- **Interface Segregation**: Interfaces específicas
- **Dependency Inversion**: Dependências abstratas

#### Clean Architecture
```
┌─────────────────────────────────────┐
│           Controllers               │  ← HTTP Layer
├─────────────────────────────────────┤
│           Services                  │  ← Business Logic
├─────────────────────────────────────┤
│         Repositories                │  ← Data Access
├─────────────────────────────────────┤
│       External Interfaces           │  ← Frameworks & Drivers
└─────────────────────────────────────┘
```

#### Domain-Driven Design (DDD)
- **Entities**: Regras de negócio (User, Appointment)
- **Value Objects**: Objetos imutáveis
- **Repositories**: Abstração de persistência
- **Services**: Lógica de negócio
- **DTOs**: Transferência de dados

## 🌐 Arquitetura Frontend

### Tecnologias
- **React 18** com **TypeScript**
- **Styled Components** para CSS-in-JS
- **React Router** para navegação
- **Axios** para chamadas HTTP
- **Unform** para formulários
- **Yup** para validação
- **Context API** + hooks customizados

### Estrutura de Diretórios
```
GoBarberFront/gobarberweb/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas/Rotas
│   ├── hooks/         # Hooks customizados
│   ├── services/      # Integração com APIs
│   ├── styles/        # Estilos globais
│   ├── utils/         # Funções utilitárias
│   ├── types/         # Definições TypeScript
│   └── routes/        # Configuração de rotas
```

### Padrões de Componentes

#### Atomic Design
```
┌─────────────┐
│   Atoms     │  ← Button, Input, Icon
├─────────────┤
│  Molecules  │  ← Form, Card, Toast
├─────────────┤
│  Organisms  │  ← Header, Sidebar, Form
├─────────────┤
│  Templates  │  ← Page layouts
├─────────────┤
│   Pages     │  ← Complete pages
└─────────────┘
```

#### Container/Presentational Pattern
```typescript
// Container (lógica)
const DashboardContainer = () => {
  const { user } = useAuth();
  const { data, loading } = useAppointments();

  return <Dashboard user={user} appointments={data} loading={loading} />;
};

// Presentational (UI)
const Dashboard = ({ user, appointments, loading }) => (
  <Container>
    <Header user={user} />
    <AppointmentsList appointments={appointments} loading={loading} />
  </Container>
);
```

## 📱 Arquitetura Mobile

### Tecnologias
- **React Native** com **TypeScript**
- **Redux** + **Redux Saga** para state management
- **React Navigation** para navegação
- **Axios** para APIs
- **AsyncStorage** para persistência local

### Estrutura de State
```
Store/
├── modules/
│   ├── auth/          # Autenticação
│   ├── user/          # Dados do usuário
│   └── appointments/  # Agendamentos
├── sagas/             # Side effects
└── reducers/          # State updates
```

## 🗄️ Arquitetura de Dados

### PostgreSQL Schema
```
users
├── id (PK)
├── name
├── email (unique)
├── password (hashed)
├── avatar
└── created_at/updated_at

appointments
├── id (PK)
├── provider_id (FK → users)
├── user_id (FK → users)
├── date (datetime)
└── created_at/updated_at

user_tokens (password reset)
├── id (PK)
├── token (unique)
├── user_id (FK → users)
└── created_at
```

### Cache Strategy (Redis)
- **User sessions**: Cache JWT validation
- **Provider list**: Cache por 1 hora
- **Appointment availability**: Cache por 15 min

## 🔐 Segurança

### Autenticação
- **JWT** com expiração configurável
- **Refresh tokens** para sessões prolongadas
- **Password hashing** com bcrypt
- **Rate limiting** em endpoints públicos

### Autorização
- **Role-based access** (provider/client)
- **Middleware** para proteção de rotas
- **CORS** configurado
- **Helmet** para headers de segurança

### Validação
- **Yup schemas** no frontend
- **Joi/Class-validator** no backend
- **Sanitização** de inputs
- **SQL injection prevention** via ORM

## 🚀 Deploy & DevOps

### Ambiente de Desenvolvimento
- **Docker Compose** para serviços locais
- **Hot reload** em todos projetos
- **Debugging** integrado
- **Environment variables** isoladas

### Produção
- **Containerização** com Docker
- **Orquestração** com Kubernetes (opcional)
- **CI/CD** com GitHub Actions
- **Monitoring** com logs estruturados

### Escalabilidade
- **Horizontal scaling** via containers
- **Database sharding** para alto volume
- **CDN** para assets estáticos
- **Load balancing** para APIs

## 📊 Monitoramento

### Métricas
- **Response times** por endpoint
- **Error rates** e tipos
- **User activity** e retenção
- **Database performance**

### Logs
- **Structured logging** com Winston
- **Error tracking** com Sentry
- **Performance monitoring**
- **Audit trails** para ações críticas

## 🔄 Fluxos de Dados

### Agendamento
1. Cliente busca provedores disponíveis
2. Seleciona data/hora disponível
3. Sistema valida disponibilidade
4. Cria agendamento no banco
5. Envia notificação por email
6. Atualiza cache de disponibilidade

### Autenticação
1. Cliente envia credenciais
2. Backend valida e gera JWT
3. Token armazenado no localStorage
4. Interceptor adiciona token às requests
5. Backend valida token em cada request

## 🎯 Decisões Arquiteturais

### Por que Node.js?
- **JavaScript full-stack** para consistência
- **NPM ecosystem** rico
- **Performance** adequada para APIs
- **TypeScript** para type safety

### Por que React?
- **Component-based** architecture
- **Virtual DOM** para performance
- **Large ecosystem** e comunidade
- **Native mobile** com React Native

### Por que PostgreSQL?
- **ACID compliance** para transações
- **JSON support** para dados flexíveis
- **Performance** em queries complexas
- **Open source** e confiável

### Por que Redis?
- **In-memory** para velocidade
- **Data structures** avançadas
- **Pub/Sub** para notificações
- **Persistence** opcional

Esta arquitetura garante **escalabilidade**, **manutenibilidade** e **segurança** para o crescimento do GoBarber.