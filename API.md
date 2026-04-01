# 📚 API.md

## Documentação da API GoBarber

Esta documentação descreve os endpoints da API REST do GoBarber.

**Base URL**: `http://localhost:3333` (desenvolvimento)

---

## 🔐 Autenticação

Todos os endpoints (exceto os marcados como públicos) requerem autenticação via **Bearer Token** no header:

```
Authorization: Bearer <token>
```

### Login
```http
POST /sessions
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

---

## 👥 Usuários

### Criar Conta
```http
POST /users
```

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### Buscar Perfil
```http
GET /profile
```
**Auth Required**: ✅

**Response (200):**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "user@example.com",
  "avatar": "avatar-url",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### Atualizar Perfil
```http
PATCH /profile
```
**Auth Required**: ✅

**Request Body:**
```json
{
  "name": "João Silva Atualizado",
  "email": "novoemail@example.com"
}
```

### Upload de Avatar
```http
PATCH /users/avatar
```
**Auth Required**: ✅

**Content-Type**: `multipart/form-data`

**Form Data:**
- `avatar`: arquivo de imagem

---

## 📅 Agendamentos

### Listar Meus Agendamentos
```http
GET /appointments/me
```
**Auth Required**: ✅

**Query Parameters:**
- `year`: número (obrigatório)
- `month`: número (obrigatório)
- `day`: número (obrigatório)

**Exemplo:**
```
GET /appointments/me?year=2024&month=1&day=15
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "date": "2024-01-15T14:00:00.000Z",
    "user": {
      "name": "João Silva"
    },
    "provider": {
      "name": "Maria Cabeleireira"
    }
  }
]
```

### Criar Agendamento
```http
POST /appointments
```
**Auth Required**: ✅

**Request Body:**
```json
{
  "provider_id": "uuid-do-provider",
  "date": "2024-01-15T14:00:00.000Z"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "date": "2024-01-15T14:00:00.000Z",
  "user_id": "uuid",
  "provider_id": "uuid"
}
```

### Cancelar Agendamento
```http
DELETE /appointments/:id
```
**Auth Required**: ✅

**Response (204):** No Content

---

## 👨‍💼 Provedores

### Listar Provedores
```http
GET /providers
```
**Auth Required**: ✅

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Maria Cabeleireira",
    "email": "maria@example.com",
    "avatar": "avatar-url"
  }
]
```

### Verificar Disponibilidade
```http
GET /appointments/:provider_id/available
```
**Auth Required**: ✅

**Query Parameters:**
- `date`: timestamp em milissegundos

**Exemplo:**
```
GET /appointments/uuid-provider/available?date=1705324800000
```

**Response (200):**
```json
[
  {
    "hour": 8,
    "available": true
  },
  {
    "hour": 9,
    "available": false
  }
]
```

---

## 🔑 Recuperação de Senha

### Solicitar Reset
```http
POST /password/forgot
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (204):** No Content

### Resetar Senha
```http
POST /password/reset
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "new-password",
  "password_confirmation": "new-password"
}
```

**Response (204):** No Content

---

## 📊 Códigos de Status

### Sucesso
- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado
- **204 No Content**: Sucesso sem conteúdo de resposta

### Erro do Cliente
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Token inválido/ausente
- **403 Forbidden**: Acesso negado
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: horário indisponível)
- **422 Unprocessable Entity**: Validação falhou

### Erro do Servidor
- **500 Internal Server Error**: Erro interno

## 📝 Estrutura de Erros

```json
{
  "status": "error",
  "message": "Mensagem de erro descritiva"
}
```

Ou para validação:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": "Email já cadastrado",
    "password": "Senha deve ter pelo menos 6 caracteres"
  }
}
```

## 🔒 Rate Limiting

- **Endpoints públicos**: 10 requests por minuto por IP
- **Endpoints autenticados**: 100 requests por minuto por usuário

## 🧪 Testando a API

### Usando cURL

```bash
# Login
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Listar agendamentos (com token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/appointments/me?year=2024&month=1&day=15
```

### Usando Postman/Insomnia

1. Importe a collection do repositório
2. Configure variáveis de ambiente
3. Use o token de autenticação nas requests

## 📋 Validações

### Usuário
- **name**: obrigatório, 2-100 caracteres
- **email**: obrigatório, formato válido, único
- **password**: obrigatório, mínimo 6 caracteres

### Agendamento
- **provider_id**: obrigatório, deve ser provedor válido
- **date**: obrigatório, futuro, horário comercial (8h-18h), não conflitante

### Senha
- **password**: mínimo 6 caracteres
- **password_confirmation**: deve coincidir

---

**Nota**: Esta documentação reflete a API atual. Para mudanças, consulte o código fonte em `GoBarberAPI/src/`.