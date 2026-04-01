# 📄 CONTRIBUTING.md

## Como Contribuir para o GoBarber

Bem-vindo! Este documento explica como contribuir para o projeto GoBarber.

### 🚀 Começando

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/SEU_USERNAME/gobarber.git`
3. **Instale dependências**:
   ```bash
   # Backend
   cd GoBarberAPI && npm install

   # Frontend
   cd GoBarberFront/gobarberweb && npm install

   # Mobile (opcional)
   cd GoBarberApp/GoBarberMobile && npm install
   ```

4. **Configure variáveis de ambiente** (veja SETUP_GUIDE.md)
5. **Execute os testes**: `npm test`
6. **Crie uma branch**: `git checkout -b feature/nome-da-feature`

### 📝 Padrões de Commit

Usamos [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

Types:
- feat: nova funcionalidade
- fix: correção de bug
- docs: documentação
- style: formatação
- refactor: refatoração
- test: testes
- chore: manutenção
```

Exemplos:
- `feat(auth): add password reset functionality`
- `fix(api): resolve appointment booking race condition`
- `docs(readme): update installation instructions`

### 🛠️ Desenvolvimento

#### Backend (Node.js + TypeScript)
- Use **SOLID principles**
- Implemente testes unitários
- Use **dependency injection** com TSyringe
- Documente APIs com comentários JSDoc

#### Frontend (React + TypeScript)
- Use **functional components** com hooks
- Implemente **Storybook** para componentes
- Use **styled-components** para estilos
- Mantenha **acessibilidade** (WCAG 2.1)

#### Mobile (React Native)
- Use **TypeScript**
- Implemente **Redux** para state management
- Teste em dispositivos reais

### 🧪 Testes

```bash
# Backend
npm run test
npm run test:watch

# Frontend
npm test
npm run test:coverage

# Mobile
npm test
```

### 📋 Pull Request Process

1. **Atualize sua branch** com a main
2. **Execute todos os testes**
3. **Verifique linting**: `npm run lint`
4. **Crie PR** com descrição detalhada
5. **Aguarde review** e implemente feedback

### 🎯 Code Quality

- **ESLint** configurado para todos projetos
- **Prettier** para formatação consistente
- **TypeScript** strict mode
- Cobertura de testes > 80%
- Sem vulnerabilidades de segurança

### 📚 Documentação

- Mantenha README atualizado
- Documente APIs no código
- Adicione exemplos de uso
- Atualize guias de setup

### 🐛 Reportando Bugs

Use o template de issue para bugs:
- Descrição clara do problema
- Passos para reproduzir
- Ambiente (OS, browser, versão)
- Logs de erro
- Screenshots se aplicável

### 💡 Sugestões de Features

Para novas funcionalidades:
- Descreva o problema que resolve
- Explique a solução proposta
- Considere impacto na arquitetura
- Discuta alternativas

### 📞 Suporte

- **Issues**: Para bugs e features
- **Discussions**: Para perguntas gerais
- **Discord**: Para chat em tempo real

### 📜 Licença

Contribuições são licenciadas sob MIT. Ao contribuir, você concorda que seu código pode ser usado sob esta licença.

---

Obrigado por contribuir! 🎉