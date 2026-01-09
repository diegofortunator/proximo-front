# Proximo - Rede Social Baseada em Geolocalização

![Proximo Logo](https://img.shields.io/badge/Proximo-Social-6366f1?style=for-the-badge)

**Proximo** é uma rede social inovadora que conecta pessoas baseada em proximidade física. Descubra quem está ao seu redor, veja perfis de pessoas próximas e inicie conversas efêmeras que existem apenas enquanto vocês estão a menos de 50 metros de distância.

## 🎯 Conceito

Imagine estar em uma praia, festival ou evento e querer saber quem são as pessoas ao seu redor - se estão solteiras, qual a profissão, interesses. O Proximo permite que você:

- 📍 Veja pessoas em um raio de 50 metros
- 👤 Acesse perfis com informações como estado civil, idade, profissão
- 💬 Converse em tempo real com mensagens temporárias
- 👥 Crie grupos de proximidade para eventos
- 🔔 Receba notificações de reencontros

## ✨ Funcionalidades

### Radar de Proximidade
- Visualização radar mostrando direção e distância das pessoas próximas
- Lista de usuários com distância em metros
- Indicador de direção (Norte, Sul, etc.)

### Mensagens Temporárias
- Conversas que só existem enquanto vocês estão próximos
- Quando alguém sai do raio de 50m, as mensagens "desaparecem"
- Suporte a imagens

### Grupos de Proximidade
- Crie grupos para eventos ou locais
- Mensagens de quem saiu do raio aparecem como "Usuário desconhecido"
- Ideal para festas, eventos e encontros

### Privacidade
- Controle total sobre sua visibilidade
- Escolha quais informações mostrar (idade, profissão, estado civil)
- Sistema de bloqueio de usuários

## 🛠️ Tecnologias

### Backend (proximo-api)
- **Framework**: NestJS 10.x
- **Linguagem**: TypeScript
- **ORM**: Prisma 6.x
- **Banco de Dados**: MariaDB
- **WebSocket**: Socket.io
- **Autenticação**: JWT + bcrypt
- **Geolocalização**: geolib

### Frontend (proximo-front)
- **Framework**: React 19
- **Build Tool**: Vite 6
- **UI Library**: Material UI 6
- **State Management**: Zustand 5
- **WebSocket Client**: Socket.io Client
- **Roteamento**: React Router 7

## 📁 Estrutura do Projeto

```
PROXIMO/
├── proximo-api/          # Backend NestJS
│   ├── prisma/
│   │   └── schema.prisma # Esquema do banco de dados
│   └── src/
│       ├── modules/
│       │   ├── auth/     # Autenticação JWT
│       │   ├── users/    # Gestão de usuários
│       │   ├── profiles/ # Perfis de usuários
│       │   ├── location/ # Geolocalização e proximidade
│       │   ├── chat/     # Mensagens diretas
│       │   ├── groups/   # Grupos de proximidade
│       │   ├── blocks/   # Sistema de bloqueio
│       │   ├── proximity/# Tokens de proximidade
│       │   ├── notifications/ # Notificações
│       │   └── upload/   # Upload de imagens
│       ├── common/       # Guards, decorators
│       └── main.ts
│
└── proximo-front/        # Frontend React
    └── src/
        ├── components/   # Componentes reutilizáveis
        ├── pages/        # Páginas da aplicação
        ├── stores/       # Estados globais (Zustand)
        ├── services/     # APIs e WebSocket
        └── hooks/        # Custom hooks
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- MariaDB ou MySQL

### Backend

```bash
cd proximo-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Executar migrations do Prisma
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run start:dev
```

### Frontend

```bash
cd proximo-front

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/proximo"
JWT_SECRET="seu-secret-super-seguro"
JWT_EXPIRES_IN="7d"
UPLOAD_DIR="./uploads"
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

## 📱 Telas

### Home
- **Radar**: Visualização em radar dos usuários próximos
- **Lista**: Lista de usuários com foto, nome e distância
- **Chats**: Conversas ativas
- **Grupos**: Grupos de proximidade

### Perfil
- Visualização e edição de perfil
- Upload de foto
- Configurações de privacidade

### Chat
- Mensagens em tempo real
- Indicador de digitação
- Envio de imagens
- Aviso quando usuário sai do raio

### Grupos
- Criação de grupos
- Lista de membros
- Mensagens em tempo real
- Anonimização de usuários que saíram

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Tokens de Proximidade**: Acesso temporário a perfis
- **Bcrypt**: Hash seguro de senhas
- **CORS**: Configuração adequada para produção
- **Validação**: DTOs com class-validator

## 📊 Modelos de Dados

### Principais Entidades
- **User**: Usuário do sistema
- **Profile**: Perfil público do usuário
- **UserLocation**: Localização em tempo real
- **UserSettings**: Configurações de privacidade
- **Message**: Mensagens diretas (com flag isExpired)
- **GroupChat**: Grupos de proximidade
- **GroupMessage**: Mensagens de grupo (com flag isAnonymized)
- **Block**: Bloqueios entre usuários
- **Encounter**: Histórico de reencontros

## 🌐 WebSocket Namespaces

- `/location`: Atualizações de localização em tempo real
- `/chat`: Mensagens diretas
- `/groups`: Mensagens de grupo
- `/notifications`: Notificações de sistema

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Proximo Team** - *Desenvolvimento inicial*

---

<p align="center">
  Feito com ❤️ para conectar pessoas próximas
</p>
