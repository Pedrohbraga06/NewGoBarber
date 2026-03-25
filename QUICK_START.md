# ⚡ Quick Start - GoBarber

## 🚀 Iniciar o Projeto em 5 minutos

### 1️⃣ Backend API

```bash
# Navegue para a pasta
cd GoBarberAPI

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev:server

# ✅ API rodando em http://localhost:3333
```

**Endpoints principais:**
```
POST   /sessions           → Login
POST   /users              → Criar conta
GET    /appointments/me    → Meus agendamentos
POST   /appointments       → Criar agendamento
GET    /providers          → Lista de provedores
PATCH  /profile            → Atualizar perfil
POST   /password/forgot    → Recuperar senha
```

---

### 2️⃣ Frontend Web

```bash
# Navegue para a pasta
cd GoBarberFront/gobarberweb

# Instale as dependências
npm install

# Inicie o servidor
npm start

# ✅ Web rodando em http://localhost:3000
```

**Páginas principais:**
```
/ (/) → SignIn
/signup → SignUp
/dashboard → Dashboard (protegido)
/profile → Perfil (protegido)
```

---

### 3️⃣ Mobile App

```bash
# Navegue para a pasta
cd GoBarberApp/GoBarberMobile

# Instale as dependências
npm install

# Inicie o Metro bundler
npm start

# Em outro terminal, execute Android ou iOS:
npm run android
# ou
npm run ios
```

---

## 🔧 Configuração

### Backend - Variáveis de Ambiente

Crie `.env` na raiz de `GoBarberAPI`:

```env
# Database
DATABASE_URL=postgres://user:password@localhost:5432/gobarber

# JWT
JWT_SECRET=seu-super-secret-key-aqui
JWT_EXPIRES_IN=7d

# Upload
STORAGE_TYPE=disk

# Mail (opcional)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USER=seu-email@example.com
MAIL_PASS=sua-senha

# Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Mobile - Configurar IP

Edite `GoBarberApp/GoBarberMobile/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://SEU_IP_AQUI:3333', // Seu IP da máquina
  timeout: 10000,
});
```

---

## 📋 Checklist Inicial

### Setup Backend
- [ ] Node.js instalado (v14+)
- [ ] PostgreSQL instalado e rodando
- [ ] `.env` configurado
- [ ] `npm install` executado
- [ ] `npm run dev:server` funcionando

### Setup Frontend
- [ ] Node.js instalado
- [ ] `.env` ou `config` apontando para backend
- [ ] `npm install` executado
- [ ] `npm start` funcionando
- [ ] Backend rodando na porta 3333

### Setup Mobile
- [ ] Node.js instalado
- [ ] Android Studio OU Xcode instalado
- [ ] `npm install` executado
- [ ] IP do backend configurado
- [ ] `npm run android/ios` funcionando

---

## 🧪 Testar Funcionalidades

### 1. Criar Conta
```
URL: http://localhost:3000/signup
Email: seu@email.com
Senha: 123456
Nome: Seu Nome
```

### 2. Fazer Login
```
URL: http://localhost:3000
Email: seu@email.com
Senha: 123456
```

### 3. Ver Agendamentos
```
Após login, irá para Dashboard
Mostra agendamentos de hoje
Divididos em Manhã e Tarde
```

### 4. Testar com cURL

```bash
# Login
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"123456"}'

# Response (salve o token):
{
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "eyJhbGc..."
}

# Usar token para requisições autenticadas:
curl -X GET http://localhost:3333/appointments/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

---

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verifique se PostgreSQL está rodando
# Verifique se .env está correto
# Verifique erros:
npm run dev:server
```

### Frontend não conecta com backend
```bash
# Verifique URL da API em src/services/api.ts
# Verifique se backend está rodando em :3333
# Verifique firewall/CORS
```

### Mobile não encontra backend
```bash
# Verifique IP em src/services/api.js
# Use: ipconfig (Windows) ou ifconfig (Linux/Mac)
# Deve ser IP da rede local, não localhost
```

### Erro 401 em autenticado
```bash
# Token pode estar expirado
# Limpar localStorage:
localStorage.clear() // No console do navegador

# Fazer login novamente
```

---

## 📚 Documentação Importante

Após entender o básico, leia:

1. **DEVELOPMENT_GUIDE.md**
   - Padrões de código
   - Git workflow
   - Testing
   - Performance

2. **MELHORIAS_IMPLEMENTADAS.md**
   - Detalhes técnicos
   - O que foi mudado
   - Por quê mudou

3. **README_SUMMARY.md**
   - Visão executiva
   - Estatísticas
   - Roadmap

---

## 🎓 Próximas Ações

### Para Desenvolvedores
1. Ler `DEVELOPMENT_GUIDE.md`
2. Entender padrões de código
3. Clonar e criar feature branch
4. Fazer alterações seguindo padrões
5. Criar Pull Request

### Para DevOps/Infra
1. Setup CI/CD (GitHub Actions)
2. Configurar variáveis de ambiente
3. Setup database production
4. Deploy backend
5. Deploy frontend

### Para Testes
1. Escrever testes unitários
2. Setup Jest
3. Adicionar GitHub Actions
4. Garantir 70%+ coverage

---

## ⚙️ Comandos Úteis

### Backend
```bash
npm run dev:server          # Inicia servidor
npm test                    # Roda testes
npm run build               # Build para produção
npm run typeorm             # CLI do TypeORM
npm run migrations:run      # Rodas migrações
```

### Frontend Web
```bash
npm start                   # Inicia dev server
npm build                   # Build production
npm test                    # Roda testes
npm eject                   # Eject do CRA (⚠️ irreversível)
```

### Mobile
```bash
npm start                   # Inicia Metro bundler
npm run android             # Inicia em Android
npm run ios                 # Inicia em iOS
npm test                    # Roda testes
npm run lint                # Roda eslint
```

---

## 🔐 Segurança Básica

### Não fazer commit de:
```
.env
.env.local
node_modules/
.DS_Store
dist/
build/
```

### Usar sempre:
```
Git para versionamento
Branches para features
Pull Requests para review
Commits atômicos e descritivos
```

---

## 💬 Dúvidas Frequentes

**P: Como mudo a porta do backend?**
A: Em `server.ts`, altere o `app.listen(3333, ...)` para a porta desejada

**P: Como uso outro banco de dados?**
A: Configure `ormconfig.json` e variáveis de ambiente

**P: Como faço build para produção?**
A: Backend: `npm run build` | Frontend: `npm build`

**P: Preciso de Docker?**
A: Recomendado para produção, mas não é obrigatório para desenvolvimento

**P: Como contribuo com o projeto?**
A: Fork → Branch → Commit → Push → Pull Request

---

## 📞 Suporte

- 📖 Documentação: Veja `DEVELOPMENT_GUIDE.md`
- 🔧 Problemas: Veja `TROUBLESHOOTING.md` (quando criado)
- 💬 Discussões: Use GitHub Issues
- 📧 Email: seu-email@example.com

---

**🎉 Pronto para começar! Divirta-se desenvolvendo!**

---

*Última atualização: 4 de Fevereiro de 2026*
