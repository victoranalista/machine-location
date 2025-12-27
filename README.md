# EquipRent - Marketplace de Locação de Equipamentos Pesados

Plataforma completa para locação de máquinas pesadas e equipamentos de construção. Uma aplicação moderna que compete com BigRentz, DOZR e EquipmentShare.

## 🚀 Tecnologias

- **Next.js 15** - App Router com Server Components
- **React 19** - Server Actions
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Banco de dados PostgreSQL (Neon)
- **NextAuth 5** - Autenticação (Google + Credentials)
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Estilização
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones

## � Tipos de Usuários

### 1. Cliente (USER)
- Navega e busca equipamentos
- Adiciona ao carrinho e aluga
- Gerencia suas locações
- Avalia equipamentos

### 2. Fornecedor (SUPPLIER)
- Cadastra seus próprios equipamentos
- Aguarda aprovação do admin
- Gerencia disponibilidade
- Recebe pagamentos por locações
- Acompanha estatísticas

### 3. Administrador (ADMIN)
- Aprova equipamentos dos fornecedores
- Gerencia todas as locações
- Gerencia categorias e marcas
- Acompanha métricas globais

## �📁 Estrutura do Projeto

```
app/
├── (marketplace)/              # Área pública do marketplace
│   ├── page.tsx               # Landing page
│   ├── equipamentos/          # Listagem e detalhes
│   ├── carrinho/              # Carrinho de locação
│   └── minha-conta/           # Área do cliente
│       ├── page.tsx           # Dashboard do cliente
│       ├── locacoes/          # Histórico de locações
│       ├── favoritos/         # Equipamentos salvos
│       └── configuracoes/     # Perfil
├── (fornecedor)/fornecedor/    # Área do fornecedor
│   ├── page.tsx               # Dashboard do fornecedor
│   ├── equipamentos/          # Gerenciar equipamentos próprios
│   └── locacoes/              # Locações dos seus equipamentos
├── (admin)/admin/              # Painel administrativo
│   ├── page.tsx               # Dashboard admin
│   ├── equipamentos/          # Aprovar/gerenciar todos
│   ├── locacoes/              # Todas as locações
│   └── categorias/            # Gerenciar categorias
├── login/                      # Login unificado
├── register/                   # Escolha tipo de conta
└── api/auth/                   # NextAuth routes
```

## � Fluxo de Autenticação

```
1. Usuário se registra escolhendo tipo de conta:
   - Cliente: acesso a /minha-conta
   - Fornecedor: acesso a /fornecedor
   - Admin: acesso a /admin

2. Login unificado em /login

3. Redirecionamento baseado em role:
   - USER → /minha-conta
   - SUPPLIER → /fornecedor
   - ADMIN → /admin
```

## 🔄 Fluxo do Fornecedor

```
1. Fornecedor se cadastra
2. Acessa /fornecedor
3. Cadastra equipamento
4. Equipamento fica com isApproved=false, status=MAINTENANCE
5. Admin aprova em /admin/equipamentos
6. Equipamento fica isApproved=true, status=AVAILABLE
7. Aparece no marketplace
8. Cliente aluga
9. Fornecedor recebe notificação e valor
```

## 💳 Sistema de Pagamentos (TODO)

O sistema está preparado para integração com:
- Stripe
- Mercado Pago
- Asaas

Campos já disponíveis:
- `PaymentStatus`: PENDING, PAID, REFUNDED, FAILED
- `depositAmount`: Valor de caução
- `depositPaid`: Caução paga
- `total`: Valor total

## �️ Instalação

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar .env.local
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
NEXTAUTH_SECRET="sua-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# 3. Gerar Prisma e migrations
pnpm prisma generate
pnpm prisma migrate dev --name init

# 4. Popular com dados de exemplo
pnpm db:seed

# 5. Iniciar desenvolvimento
pnpm dev
```

## 📦 Funcionalidades Implementadas

### ✅ Marketplace (Público)
- Landing page responsiva
- Busca e filtros de equipamentos
- Página de detalhes com galeria
- Sistema de carrinho
- Sistema de favoritos
- Avaliações (estrutura pronta)

### ✅ Área do Cliente
- Dashboard com resumo
- Histórico de locações
- Cancelamento de locações
- Gerenciar favoritos
- Editar perfil

### ✅ Área do Fornecedor
- Dashboard com estatísticas
- CRUD de equipamentos próprios
- Aguardar aprovação
- Ver locações recebidas
- Gestão de disponibilidade

### ✅ Painel Admin
- Dashboard com métricas globais
- Aprovar/reprovar equipamentos
- Gerenciar todas as locações
- CRUD de categorias
- CRUD de marcas (actions prontas)
- Gerenciar usuários (actions prontas)

### 🔄 Em Desenvolvimento
- Upload de imagens
- Sistema de pagamentos
- Notificações em tempo real
- Chat entre cliente e fornecedor
- Sistema de avaliações completo
- Relatórios e analytics

## 🗄️ Modelos de Dados

### Principais Tabelas

**User**
- Três roles: USER, SUPPLIER, ADMIN
- Autenticação via NextAuth
- Perfil completo

**Equipment**
- `ownerId`: Quem cadastrou (fornecedor)
- `isApproved`: Aprovado pelo admin
- `status`: AVAILABLE, RENTED, MAINTENANCE, UNAVAILABLE
- Preços: diária, semanal, mensal

**Rental**
- Cliente, equipamento, datas
- Status: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
- PaymentStatus: PENDING → PAID

**Category, Brand, Location**
- Dados auxiliares do marketplace

## 📝 Scripts Disponíveis

```bash
pnpm dev           # Desenvolvimento (localhost:3000)
pnpm build         # Build produção
pnpm start         # Rodar produção
pnpm lint          # ESLint
pnpm db:seed       # Popular banco
pnpm db:reset      # Resetar banco (⚠️ apaga tudo)
```

## � Próximos Passos

1. **Integrar Pagamentos**
   - Stripe ou Mercado Pago
   - Webhooks para confirmação
   - Sistema de repasse para fornecedores

2. **Upload de Imagens**
   - Cloudinary ou S3
   - Múltiplas imagens por equipamento
   - Crop e resize automático

3. **Notificações**
   - Email (nodemailer)
   - Push notifications
   - Sistema de alertas no app

4. **Analytics**
   - Relatórios de vendas
   - Equipamentos mais alugados
   - Receita por período

5. **SEO**
   - Metadata dinâmica
   - Sitemap.xml
   - Schema.org markup

## 🔒 Segurança

- Autenticação via NextAuth
- Senhas hashadas com bcrypt
- Proteção CSRF
- Validação server-side
- Rate limiting (estrutura pronta)

## 📄 Licença

Projeto privado - Todos os direitos reservados
