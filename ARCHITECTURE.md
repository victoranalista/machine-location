# Arquitetura do Sistema EquipRent

## 📋 Visão Geral

EquipRent é uma plataforma marketplace de três pontas (three-sided marketplace) para locação de equipamentos pesados:

1. **Clientes (USER)** - Alugam equipamentos
2. **Fornecedores (SUPPLIER)** - Listam e gerenciam seus equipamentos
3. **Administradores (ADMIN)** - Moderam e gerenciam a plataforma

## 🏗️ Arquitetura Técnica

### Stack Principal

```
┌─────────────────────────────────────┐
│     Next.js 15 (App Router)         │
│  Server Components + Server Actions │
├─────────────────────────────────────┤
│        NextAuth 5 (beta.30)         │
│      JWT Sessions + OAuth 2.0       │
├─────────────────────────────────────┤
│         Prisma ORM 6.x              │
│    PostgreSQL (Neon Serverless)     │
├─────────────────────────────────────┤
│      shadcn/ui + Tailwind CSS       │
│         Lucide Icons                │
└─────────────────────────────────────┘
```

### Separação de Rotas (Route Groups)

```
app/
├── (marketplace)/          # Área pública + área do cliente
│   ├── page.tsx           # Landing page
│   ├── equipamentos/      # Catálogo público
│   └── minha-conta/       # Dashboard do cliente (protegido)
│
├── (fornecedor)/fornecedor/  # Área do fornecedor (protegido)
│   ├── page.tsx              # Dashboard do fornecedor
│   ├── equipamentos/         # CRUD dos seus equipamentos
│   └── locacoes/             # Locações recebidas
│
├── (admin)/admin/            # Painel administrativo (protegido)
│   ├── page.tsx              # Dashboard admin
│   ├── equipamentos/         # Aprovar/gerenciar todos
│   ├── locacoes/             # Gerenciar todas as locações
│   └── categorias/           # Gerenciar categorias
│
├── login/                    # Login unificado
└── register/                 # Registro com seleção de tipo
```

## 🔐 Sistema de Autenticação

### Fluxo de Registro

```
1. Usuário acessa /register
2. Escolhe tipo de conta:
   ┌─────────────┐     ┌─────────────────┐
   │   Cliente   │  ou │   Fornecedor    │
   │   (USER)    │     │   (SUPPLIER)    │
   └─────────────┘     └─────────────────┘
3. Preenche formulário (nome, email, senha)
4. Servidor cria User com role apropriado
5. Redirecionado para /login
```

### Fluxo de Login

```
1. Usuário entra com email + senha (ou Google OAuth)
2. NextAuth valida credenciais
3. Cria JWT session com { id, email, name, role }
4. Redireciona baseado no role:
   - USER → /minha-conta
   - SUPPLIER → /fornecedor
   - ADMIN → /admin
```

### Proteção de Rotas

Todas as rotas protegidas usam:
```typescript
const session = await auth();
if (!session?.user) redirect('/login');
if (session.user.role !== 'REQUIRED_ROLE') redirect('/unauthorized');
```

## 🔄 Fluxo de Negócio - Fornecedor

### 1. Cadastro de Equipamento

```
┌──────────────┐
│  Fornecedor  │
└──────┬───────┘
       │
       │ 1. Acessa /fornecedor/equipamentos/novo
       ↓
┌──────────────────────────────────┐
│  Preenche formulário:            │
│  - Tipo de equipamento           │
│  - Marca, modelo, ano            │
│  - Descrição                     │
│  - Preços (diária/semanal/mensal)│
│  - Localização                   │
│  - Imagens                       │
└──────┬───────────────────────────┘
       │
       │ 2. Submete com Server Action
       ↓
┌──────────────────────────────────┐
│  createSupplierEquipment()       │
│  - ownerId = session.user.id     │
│  - isApproved = false            │
│  - status = MAINTENANCE          │
└──────┬───────────────────────────┘
       │
       │ 3. Equipamento criado
       ↓
┌──────────────────────────────────┐
│  Status: Aguardando Aprovação    │
│  Visível apenas no painel do     │
│  fornecedor com badge "Pendente" │
└──────────────────────────────────┘
```

### 2. Aprovação pelo Admin

```
┌──────────────┐
│     Admin    │
└──────┬───────┘
       │
       │ 1. Acessa /admin/equipamentos?filter=pending
       ↓
┌──────────────────────────────────┐
│  Vê lista de equipamentos        │
│  pendentes de aprovação          │
│  - Foto, nome, fornecedor        │
│  - Preço, localização            │
│  - Botões: Aprovar | Reprovar    │
└──────┬───────────────────────────┘
       │
       │ 2. Clica "Aprovar"
       ↓
┌──────────────────────────────────┐
│  approveEquipment(equipmentId)   │
│  - isApproved = true             │
│  - status = AVAILABLE            │
│  - revalidatePath()              │
└──────┬───────────────────────────┘
       │
       │ 3. Equipamento aprovado
       ↓
┌──────────────────────────────────┐
│  Equipamento agora aparece:      │
│  ✅ No marketplace público        │
│  ✅ Nas buscas                    │
│  ✅ Pode ser alugado              │
└──────────────────────────────────┘
```

### 3. Locação do Equipamento

```
┌──────────────┐
│   Cliente    │
└──────┬───────┘
       │
       │ 1. Busca equipamento
       ↓
┌──────────────────────────────────┐
│  /equipamentos                   │
│  - Filtros: categoria, local,    │
│    preço, disponibilidade        │
└──────┬───────────────────────────┘
       │
       │ 2. Seleciona equipamento
       ↓
┌──────────────────────────────────┐
│  /equipamentos/[id]              │
│  - Galeria de fotos              │
│  - Especificações                │
│  - Calendário de disponibilidade │
│  - Seletor de datas              │
└──────┬───────────────────────────┘
       │
       │ 3. Adiciona ao carrinho
       ↓
┌──────────────────────────────────┐
│  /carrinho                       │
│  - Resumo da locação             │
│  - Cálculo de preços             │
│  - Valor de caução               │
└──────┬───────────────────────────┘
       │
       │ 4. Finaliza locação
       ↓
┌──────────────────────────────────┐
│  createRental()                  │
│  - userId (cliente)              │
│  - equipmentId                   │
│  - startDate, endDate            │
│  - status = PENDING              │
│  - paymentStatus = PENDING       │
└──────┬───────────────────────────┘
       │
       │ 5. Processamento de pagamento
       ↓
┌──────────────────────────────────┐
│  [INTEGRAÇÃO STRIPE/MERCADOPAGO] │
│  - Pagamento confirmado          │
│  - paymentStatus = PAID          │
│  - status = CONFIRMED            │
└──────┬───────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Notificações enviadas:          │
│  📧 Cliente: confirmação         │
│  📧 Fornecedor: nova locação     │
│  📧 Admin: registro da transação │
└──────────────────────────────────┘
```

## 💾 Modelo de Dados

### Principais Relacionamentos

```
User (role: SUPPLIER) ──── 1:N ──── Equipment (ownerId)
                                         │
                                         │ N:1
                                         ↓
                                    Category
                                         
User (role: USER) ──── 1:N ──── Rental ──── N:1 ──── Equipment
                                    │
                                    │ N:1
                                    ↓
                               PaymentStatus
```

### Estados do Equipamento

```
Equipment {
  isApproved: boolean     // Aprovado pelo admin?
  status: enum            // Estado operacional
}

Ciclo de vida:
1. Criado pelo fornecedor
   → isApproved: false
   → status: MAINTENANCE
   
2. Aprovado pelo admin
   → isApproved: true
   → status: AVAILABLE
   
3. Durante locação
   → status: RENTED
   
4. Manutenção/indisponível
   → status: MAINTENANCE ou UNAVAILABLE
```

### Estados da Locação

```
RentalStatus:
  PENDING        // Aguardando confirmação de pagamento
  CONFIRMED      // Pagamento confirmado, aguardando retirada
  IN_PROGRESS    // Equipamento em uso pelo cliente
  COMPLETED      // Locação finalizada, equipamento devolvido
  CANCELLED      // Cancelada antes de iniciar

PaymentStatus:
  PENDING        // Aguardando pagamento
  PAID           // Pago
  REFUNDED       // Estornado (cancelamento)
  FAILED         // Falha no pagamento
```

## 🎯 Server Actions por Área

### Fornecedor (`app/(fornecedor)/fornecedor/actions.ts`)

```typescript
// Dashboard
getSupplierDashboardStats()    // Estatísticas do fornecedor

// Equipamentos
getSupplierEquipment()         // Lista equipamentos do fornecedor
createSupplierEquipment()      // Cria novo (isApproved=false)
updateSupplierEquipment()      // Atualiza existente
deleteSupplierEquipment()      // Deleta (se não tiver locações)

// Locações recebidas
getSupplierRentals()           // Locações dos equipamentos do fornecedor
```

### Admin (`app/(admin)/admin/actions.ts`)

```typescript
// Dashboard
getAdminDashboardStats()       // Estatísticas globais
getRecentRentals()             // Locações recentes

// Equipamentos
getAdminEquipmentList(filter)  // 'all' | 'pending' | 'approved'
approveEquipment(id)           // Aprova equipamento
rejectEquipment(id)            // Rejeita equipamento
updateEquipment()              // Atualiza qualquer equipamento
deleteEquipment()              // Deleta equipamento

// Locações
getAdminRentalList()           // Todas as locações
updateRentalStatus()           // Atualiza status

// Categorias
createCategory()               // Cria categoria
updateCategory()               // Atualiza categoria
deleteCategory()               // Deleta categoria

// Usuários
getUserList()                  // Lista usuários
updateUserRole()               // Muda role do usuário
```

### Marketplace (`app/(marketplace)/actions/...`)

```typescript
// Busca e catálogo
getEquipmentList(filters)      // Equipamentos públicos (isApproved=true)
getEquipmentById(id)           // Detalhes do equipamento
searchEquipment(query)         // Busca por texto

// Cliente
getUserRentals()               // Minhas locações
createRental()                 // Cria nova locação
cancelRental()                 // Cancela locação

// Favoritos
toggleFavorite()               // Adiciona/remove favorito
getUserFavorites()             // Lista favoritos

// Carrinho
addToCart()                    // Adiciona ao carrinho
removeFromCart()               // Remove do carrinho
getCart()                      // Busca carrinho
```

## 🚀 Deploy e Produção

### Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Migrations aplicadas no banco
- [ ] NEXTAUTH_SECRET gerado (openssl rand -base64 32)
- [ ] NEXTAUTH_URL apontando para domínio de produção
- [ ] Credenciais OAuth (Google) configuradas
- [ ] Integração de pagamento configurada
- [ ] Upload de imagens configurado (Cloudinary/S3)
- [ ] Rate limiting ativado
- [ ] Logs e monitoramento configurados

### Variáveis de Ambiente Necessárias

```env
# Database
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://seu-dominio.com

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Pagamentos (escolher um)
STRIPE_SECRET_KEY=
MERCADOPAGO_ACCESS_TOKEN=

# Upload de Imagens (escolher um)
CLOUDINARY_URL=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Email (opcional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# Redis (opcional, para cache e rate limit)
REDIS_URL=
```

## 🔒 Segurança

### Implementado

- ✅ Autenticação via NextAuth com JWT
- ✅ Senhas hashadas com bcrypt (14 rounds)
- ✅ CSRF protection (NextAuth built-in)
- ✅ Server-side validation em todas as actions
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting (estrutura pronta em lib/rateLimit.ts)

### TODO

- [ ] Implementar rate limiting em endpoints críticos
- [ ] Sanitização de inputs (XSS prevention)
- [ ] Validação de uploads de imagem
- [ ] Logs de auditoria para ações sensíveis
- [ ] 2FA para administradores
- [ ] Webhook signature validation (pagamentos)

## 📊 Performance

### Otimizações Implementadas

- Server Components (reduz bundle JS)
- Streaming SSR com loading.tsx
- Revalidação incremental com revalidatePath
- Parallel data fetching com Promise.all
- Database indexes em campos frequentes

### Métricas Alvo

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Time to Interactive: < 3.5s

## 🧪 Testes (TODO)

```
tests/
├── unit/              # Testes unitários
│   ├── actions/       # Server actions
│   └── utils/         # Funções utilitárias
├── integration/       # Testes de integração
│   ├── auth/          # Fluxos de autenticação
│   └── rental/        # Fluxos de locação
└── e2e/               # Testes end-to-end (Playwright)
    ├── marketplace/
    ├── supplier/
    └── admin/
```

## 📈 Roadmap

### Fase 1: MVP ✅
- [x] Autenticação multi-role
- [x] CRUD de equipamentos
- [x] Sistema de aprovação
- [x] Áreas separadas por role

### Fase 2: Pagamentos 🔄
- [ ] Integração Stripe/Mercado Pago
- [ ] Webhooks de confirmação
- [ ] Sistema de repasse para fornecedores
- [ ] Gestão de caução

### Fase 3: Mídia e Comunicação
- [ ] Upload múltiplo de imagens
- [ ] Galeria de fotos
- [ ] Chat entre cliente e fornecedor
- [ ] Sistema de notificações

### Fase 4: Analytics e SEO
- [ ] Dashboard de analytics
- [ ] Relatórios financeiros
- [ ] SEO otimizado
- [ ] Sitemap dinâmico

### Fase 5: Mobile
- [ ] PWA
- [ ] Notificações push
- [ ] Geolocalização
- [ ] App nativo (React Native)
