# TODO List - EquipRent

## 🎯 Prioridades

### 🔴 CRÍTICO - Fazer Antes de Produção

#### 1. Sistema de Pagamentos
**Status**: Não iniciado  
**Estimativa**: 2-3 dias  
**Responsável**: TBD

- [ ] Escolher provedor (Stripe vs Mercado Pago vs Asaas)
- [ ] Criar conta de desenvolvedor
- [ ] Instalar SDK
  ```bash
  pnpm add stripe @stripe/stripe-js
  # ou
  pnpm add mercadopago
  ```
- [ ] Criar Server Actions de pagamento
  - [ ] `createPaymentIntent()` - Inicia pagamento
  - [ ] `confirmPayment()` - Confirma pagamento
  - [ ] `refundPayment()` - Estorna pagamento
  - [ ] `captureDeposit()` - Captura caução
- [ ] Criar webhook endpoint `/api/webhooks/payment`
  - [ ] Validar assinatura do webhook
  - [ ] Atualizar status da locação
  - [ ] Notificar cliente e fornecedor
- [ ] Criar fluxo de checkout
  - [ ] Página `/carrinho/checkout`
  - [ ] Formulário de pagamento
  - [ ] Página de confirmação
  - [ ] Página de erro
- [ ] Implementar repasse para fornecedores
  - [ ] Stripe Connect ou Split de pagamento
  - [ ] Cálculo de comissão da plataforma
  - [ ] Agenda de pagamentos
- [ ] Testes
  - [ ] Testar com cartões de teste
  - [ ] Testar webhooks localmente (ngrok)
  - [ ] Testar estornos

**Arquivos a criar/modificar:**
```
app/
├── (marketplace)/carrinho/
│   ├── checkout/
│   │   ├── page.tsx
│   │   ├── actions.ts
│   │   └── PaymentForm.tsx
│   └── success/
│       └── page.tsx
├── api/webhooks/
│   └── payment/
│       └── route.ts
lib/
├── payment/
│   ├── stripe.ts (ou mercadopago.ts)
│   └── webhook.ts
prisma/schema.prisma (adicionar campos de pagamento)
```

---

#### 2. Upload de Imagens
**Status**: Não iniciado  
**Estimativa**: 1-2 dias  
**Responsável**: TBD

- [ ] Escolher provedor (Cloudinary vs S3 vs UploadThing)
- [ ] Criar conta e obter credenciais
- [ ] Instalar SDK
  ```bash
  pnpm add uploadthing @uploadthing/react
  # ou
  pnpm add cloudinary next-cloudinary
  ```
- [ ] Criar API route `/api/uploadthing`
- [ ] Criar componente de upload
  - [ ] Drag & drop
  - [ ] Preview antes de enviar
  - [ ] Múltiplas imagens
  - [ ] Crop e resize
- [ ] Atualizar schema do Prisma
  ```prisma
  model EquipmentImage {
    id          String    @id @default(cuid())
    url         String
    key         String    // Para deletar depois
    equipmentId String
    equipment   Equipment @relation(...)
    order       Int       @default(0)
    createdAt   DateTime  @default(now())
  }
  ```
- [ ] Criar Server Actions
  - [ ] `uploadEquipmentImages()` - Upload múltiplas imagens
  - [ ] `deleteEquipmentImage()` - Deleta imagem
  - [ ] `reorderImages()` - Reordena galeria
- [ ] Integrar no formulário de equipamento
  - [ ] Fornecedor pode fazer upload ao criar/editar
  - [ ] Galeria exibida na página de detalhes
- [ ] Otimizações
  - [ ] Lazy loading de imagens
  - [ ] Placeholder blur (next/image)
  - [ ] Redimensionamento automático

**Arquivos a criar/modificar:**
```
app/
├── api/uploadthing/
│   ├── core.ts
│   └── route.ts
components/
├── EquipmentImageUpload.tsx
├── ImageGallery.tsx
lib/
├── uploadthing.ts
prisma/schema.prisma
```

---

#### 3. Páginas do Fornecedor - Equipamentos
**Status**: Estrutura criada, faltam páginas  
**Estimativa**: 1 dia  
**Responsável**: TBD

- [ ] Página de listagem `/fornecedor/equipamentos`
  - [ ] Tabela com equipamentos do fornecedor
  - [ ] Colunas: Foto, Nome, Status, Aprovação, Ações
  - [ ] Badge de status (Aprovado/Pendente/Reprovado)
  - [ ] Filtros (Todos/Aprovados/Pendentes)
  - [ ] Botão "Adicionar Novo"
- [ ] Página de criação `/fornecedor/equipamentos/novo`
  - [ ] Formulário completo
  - [ ] Campos: Nome, Descrição, Categoria, Marca, Ano
  - [ ] Preços: Diária, Semanal, Mensal
  - [ ] Localização
  - [ ] Especificações técnicas
  - [ ] Upload de imagens (após implementar upload)
  - [ ] Submit com Server Action `createSupplierEquipment()`
- [ ] Página de edição `/fornecedor/equipamentos/[id]`
  - [ ] Formulário pré-preenchido
  - [ ] Não pode editar se já aprovado (ou requer nova aprovação)
  - [ ] Submit com `updateSupplierEquipment()`
- [ ] Página de locações recebidas `/fornecedor/locacoes`
  - [ ] Tabela de locações dos equipamentos do fornecedor
  - [ ] Filtros por status
  - [ ] Detalhes do cliente
  - [ ] Ações (marcar como entregue/devolvido)

**Arquivos a criar:**
```
app/(fornecedor)/fornecedor/
├── equipamentos/
│   ├── page.tsx              # Lista
│   ├── novo/
│   │   └── page.tsx          # Criar
│   ├── [id]/
│   │   └── page.tsx          # Editar
│   └── EquipmentForm.tsx     # Formulário reutilizável
└── locacoes/
    └── page.tsx
```

---

#### 4. Páginas do Admin - Aprovações
**Status**: Actions criadas, falta UI  
**Estimativa**: 1 dia  
**Responsável**: TBD

- [ ] Página de aprovações `/admin/aprovacoes`
  - [ ] Ou modificar `/admin/equipamentos` com abas
  - [ ] Aba "Pendentes de Aprovação"
  - [ ] Cards ou tabela com equipamentos pendentes
  - [ ] Preview: foto, nome, fornecedor, preço
  - [ ] Botões: "Aprovar" e "Reprovar"
  - [ ] Modal de confirmação
  - [ ] Feedback visual após ação
- [ ] Integrar Server Actions existentes
  - [ ] `approveEquipment(id)` - Já criada
  - [ ] `rejectEquipment(id, reason?)` - Adicionar motivo opcional
- [ ] Notificação ao fornecedor
  - [ ] Email quando aprovado
  - [ ] Email quando reprovado (com motivo)
- [ ] Histórico de aprovações
  - [ ] Quem aprovou/reprovou
  - [ ] Quando
  - [ ] Motivo (se reprovado)

**Arquivos a criar/modificar:**
```
app/(admin)/admin/
├── equipamentos/
│   └── page.tsx              # Adicionar tabs ou filtro
├── aprovacoes/               # Ou página separada
│   └── page.tsx
└── actions.ts                # Adicionar campo reason
prisma/schema.prisma          # Adicionar ApprovalLog?
```

---

### 🟡 IMPORTANTE - Fazer Logo Após

#### 5. Filtrar Marketplace (Apenas Aprovados)
**Status**: Não iniciado  
**Estimativa**: 2 horas  
**Responsável**: TBD

- [ ] Atualizar queries em `app/(marketplace)/actions/`
  ```typescript
  where: {
    isApproved: true,
    status: 'AVAILABLE',
    // outros filtros
  }
  ```
- [ ] Testar todas as páginas do marketplace
  - [ ] Landing page
  - [ ] `/equipamentos`
  - [ ] `/equipamentos/[id]`
  - [ ] Busca
- [ ] Garantir que equipamentos não aprovados não apareçam

**Arquivos a modificar:**
```
app/(marketplace)/
├── actions/equipment.ts
└── equipamentos/actions.ts
```

---

#### 6. Sistema de Notificações
**Status**: Não iniciado  
**Estimativa**: 2 dias  
**Responsável**: TBD

- [ ] Escolher estratégia
  - [ ] Email: nodemailer + SMTP
  - [ ] In-app: Tabela Notification no Prisma
  - [ ] Push: Firebase Cloud Messaging
- [ ] Email notifications
  - [ ] Setup nodemailer ou Resend
  - [ ] Templates de email (HTML)
  - [ ] Eventos:
    - [ ] Cliente: Locação confirmada, lembrete de devolução
    - [ ] Fornecedor: Nova locação, equipamento aprovado/reprovado
    - [ ] Admin: Nova locação, novo equipamento pendente
- [ ] In-app notifications
  - [ ] Schema Prisma
    ```prisma
    model Notification {
      id        String   @id @default(cuid())
      userId    String
      user      User     @relation(...)
      title     String
      message   String
      read      Boolean  @default(false)
      link      String?
      createdAt DateTime @default(now())
    }
    ```
  - [ ] Componente de sino (bell icon)
  - [ ] Dropdown com lista de notificações
  - [ ] Marcar como lida
  - [ ] Badge com contador

**Arquivos a criar:**
```
lib/
├── email/
│   ├── client.ts
│   └── templates/
│       ├── rental-confirmed.tsx
│       ├── equipment-approved.tsx
│       └── equipment-rejected.tsx
components/
├── NotificationBell.tsx
app/api/notifications/
└── mark-read/
    └── route.ts
```

---

#### 7. Avaliações (Reviews)
**Status**: Schema pronto, falta implementação  
**Estimativa**: 1 dia  
**Responsável**: TBD

- [ ] Permitir cliente avaliar após locação completada
  - [ ] Página `/minha-conta/locacoes/[id]/avaliar`
  - [ ] Formulário: nota (1-5 estrelas), comentário
  - [ ] Submit com `createReview()`
- [ ] Exibir avaliações na página do equipamento
  - [ ] Média de estrelas
  - [ ] Lista de reviews com nome do cliente
  - [ ] Paginação
- [ ] Filtrar por nota nas buscas
- [ ] Impedir múltiplas avaliações da mesma locação

**Arquivos a criar:**
```
app/(marketplace)/
├── minha-conta/locacoes/[id]/
│   └── avaliar/
│       └── page.tsx
components/
├── ReviewForm.tsx
├── ReviewList.tsx
└── StarRating.tsx
```

---

### 🟢 NICE TO HAVE - Melhorias Futuras

#### 8. Chat Cliente-Fornecedor
**Status**: Não iniciado  
**Estimativa**: 3-4 dias

- [ ] Escolher solução
  - [ ] WebSockets (socket.io)
  - [ ] Server-Sent Events
  - [ ] Firebase Realtime Database
- [ ] Schema Prisma
  ```prisma
  model Conversation {
    id         String    @id @default(cuid())
    rental     Rental    @relation(...)
    messages   Message[]
    createdAt  DateTime  @default(now())
  }
  
  model Message {
    id             String       @id @default(cuid())
    conversationId String
    conversation   Conversation @relation(...)
    senderId       String
    sender         User         @relation(...)
    content        String
    read           Boolean      @default(false)
    createdAt      DateTime     @default(now())
  }
  ```
- [ ] Componente de chat
- [ ] Notificações de novas mensagens

---

#### 9. Dashboard Analytics
**Status**: Não iniciado  
**Estimativa**: 2-3 dias

- [ ] Gráficos com Chart.js ou Recharts
- [ ] Métricas para fornecedor:
  - [ ] Receita ao longo do tempo
  - [ ] Taxa de aprovação de equipamentos
  - [ ] Equipamentos mais alugados
  - [ ] Taxa de ocupação
- [ ] Métricas para admin:
  - [ ] GMV (Gross Merchandise Value)
  - [ ] Novos usuários por mês
  - [ ] Top fornecedores
  - [ ] Top equipamentos
- [ ] Exportar relatórios (CSV/PDF)

---

#### 10. SEO e Performance
**Status**: Parcialmente implementado  
**Estimativa**: 2 dias

- [ ] Metadata dinâmica para todas as páginas
  ```typescript
  export async function generateMetadata({ params }) {
    const equipment = await getEquipment(params.id);
    return {
      title: equipment.name,
      description: equipment.description,
      openGraph: { images: [equipment.image] }
    };
  }
  ```
- [ ] Sitemap.xml dinâmico
- [ ] robots.txt
- [ ] Schema.org markup (JSON-LD)
  - [ ] Organization
  - [ ] Product (equipamentos)
  - [ ] Review
- [ ] Otimizações de imagem
  - [ ] WebP/AVIF
  - [ ] Responsive images
  - [ ] Lazy loading
- [ ] Bundle analysis e code splitting

---

#### 11. PWA e Mobile
**Status**: Não iniciado  
**Estimativa**: 3-5 dias

- [ ] Configurar PWA
  - [ ] manifest.json
  - [ ] Service Worker
  - [ ] Ícones e splash screens
- [ ] Offline support
  - [ ] Cache de páginas visitadas
  - [ ] Fallback quando offline
- [ ] Notificações push
  - [ ] Integrar Firebase Cloud Messaging
  - [ ] Solicitar permissão
  - [ ] Enviar notificações de novas locações
- [ ] Geolocalização
  - [ ] Buscar equipamentos próximos
  - [ ] Mapas interativos (Google Maps/Mapbox)
- [ ] App Nativo (opcional)
  - [ ] React Native com Expo
  - [ ] Compartilhar lógica com Next.js (tRPC?)

---

#### 12. Testes Automatizados
**Status**: Não iniciado  
**Estimativa**: Ongoing

- [ ] Setup testing framework
  ```bash
  pnpm add -D vitest @testing-library/react @testing-library/jest-dom
  pnpm add -D @playwright/test
  ```
- [ ] Testes unitários (Vitest)
  - [ ] Utils (formatters, validators)
  - [ ] Server Actions (mock Prisma)
- [ ] Testes de integração
  - [ ] Fluxo de autenticação
  - [ ] Fluxo de criação de equipamento
  - [ ] Fluxo de locação
- [ ] E2E (Playwright)
  - [ ] Jornada do cliente
  - [ ] Jornada do fornecedor
  - [ ] Jornada do admin
- [ ] CI/CD
  - [ ] GitHub Actions
  - [ ] Rodar testes em PRs
  - [ ] Deploy automático (Vercel)

---

#### 13. Segurança Avançada
**Status**: Parcialmente implementado  
**Estimativa**: 2 dias

- [ ] Rate limiting
  - [ ] Implementar Redis (Upstash)
  - [ ] Limitar login attempts
  - [ ] Limitar criação de equipamentos
  - [ ] Limitar uploads
- [ ] 2FA para admins
  - [ ] TOTP (Google Authenticator)
  - [ ] Backup codes
- [ ] Logs de auditoria
  - [ ] Tabela AuditLog
  - [ ] Registrar ações sensíveis
  - [ ] IP, timestamp, user agent
- [ ] CAPTCHA em formulários públicos
- [ ] CSP (Content Security Policy)
- [ ] Sanitização de inputs (XSS prevention)

---

#### 14. Internacionalização (i18n)
**Status**: Não iniciado  
**Estimativa**: 2-3 dias

- [ ] Setup next-intl
  ```bash
  pnpm add next-intl
  ```
- [ ] Estrutura de traduções
  ```
  messages/
  ├── pt-BR.json
  ├── en.json
  └── es.json
  ```
- [ ] Detectar locale do usuário
- [ ] Seletor de idioma
- [ ] Traduzir todas as strings
- [ ] Formatação de datas/moedas por locale

---

## 📊 Resumo de Prioridades

### Sprint 1 (1 semana)
- [ ] Sistema de Pagamentos (CRÍTICO)
- [ ] Upload de Imagens (CRÍTICO)
- [ ] Páginas do Fornecedor (CRÍTICO)

### Sprint 2 (1 semana)
- [ ] Páginas do Admin - Aprovações (CRÍTICO)
- [ ] Filtrar Marketplace (IMPORTANTE)
- [ ] Sistema de Notificações (IMPORTANTE)

### Sprint 3 (1 semana)
- [ ] Avaliações (IMPORTANTE)
- [ ] SEO e Performance (NICE TO HAVE)
- [ ] Dashboard Analytics (NICE TO HAVE)

### Backlog (Futuro)
- [ ] Chat
- [ ] PWA/Mobile
- [ ] Testes
- [ ] Segurança Avançada
- [ ] i18n

---

## 📝 Notas

- Priorize funcionalidades que desbloqueiam o MVP
- Pagamentos é bloqueador para lançamento
- Upload de imagens é essencial para UX
- Aprovações são core do modelo de negócio
- Demais features podem ser lançadas incrementalmente

---

**Última atualização**: 2024
