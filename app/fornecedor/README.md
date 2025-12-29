# Portal do Fornecedor - Sistema Completo de Gestão de Locações

Sistema profissional e moderno para fornecedores gerenciarem equipamentos e locações na plataforma de aluguel de máquinas pesadas.

## 🎯 Funcionalidades Principais

### Dashboard
- Visão geral com métricas em tempo real
- Cards de estatísticas (equipamentos, locações ativas, pendentes, receita)
- Gráfico de evolução de receita dos últimos 6 meses
- Top 5 equipamentos mais rentáveis
- Lista de locações recentes
- Ações rápidas de acesso

### Gestão de Equipamentos
- Listagem completa com filtros e busca
- Criação de novos equipamentos com formulário completo
- Edição de equipamentos existentes
- Controle de status (Disponível, Alugado, Manutenção, Indisponível)
- Exclusão com validação de locações ativas
- Upload de imagens e informações detalhadas
- Suporte a valores diário, semanal e mensal
- Aprovação automática pendente (admin aprova)

### Gestão de Locações
- Listagem completa de todas as locações
- Filtros por status e busca
- Cards com estatísticas de locações
- Visualização detalhada de cada locação
- Atualização de status do fluxo:
  - Pendente → Confirmar
  - Confirmada → Iniciar
  - Em Andamento → Finalizar
  - Cancelar (com motivo)
- Informações completas do cliente
- Detalhes de entrega
- Valores e caução

### Análise e Relatórios
- Métricas de performance
- Evolução da receita com gráfico visual
- Equipamentos mais alugados
- Taxa de ocupação
- Comparativos mensais com tendências

### Configurações
- Perfil do fornecedor
- Dados pessoais e empresariais
- Informações de contato
- Endereço completo

## 🎨 Design e UX

### Princípios Aplicados
- Interface moderna e profissional
- Design System consistente com shadcn/ui
- Animações suaves e transições elegantes
- Responsivo para todos os dispositivos
- Dark mode nativo
- Feedback visual para todas as ações
- Loading states apropriados
- Toasts para notificações

### Paleta de Cores
- Uso minimalista de cores
- Foco em tons neutros
- Primary para ações principais
- Destructive para ações críticas
- Muted para informações secundárias

### Componentes
- Cards com hover effects
- Badges para status
- Avatars para imagens
- Dialogs e AlertDialogs para confirmações
- Dropdowns para ações
- Forms com validação
- Skeleton loaders
- Progress bars animados

## 📁 Estrutura de Arquivos

```
app/(fornecedor)/
├── layout.tsx                 # Layout principal com sidebar
├── page.tsx                   # Dashboard
├── actions.ts                 # Server actions compartilhadas
├── components/
│   ├── SupplierSidebar.tsx   # Navegação lateral
│   ├── SupplierHeader.tsx     # Header com perfil e notificações
│   ├── StatsCards.tsx         # Cards de estatísticas
│   ├── QuickActions.tsx       # Ações rápidas
│   ├── RecentRentals.tsx      # Locações recentes
│   ├── EquipmentPerformance.tsx # Top equipamentos
│   └── RevenueChart.tsx       # Gráfico de receita
├── equipamentos/
│   ├── page.tsx               # Lista de equipamentos
│   ├── actions.ts             # CRUD de equipamentos
│   ├── novo/
│   │   └── page.tsx           # Criar equipamento
│   ├── [id]/
│   │   └── page.tsx           # Editar equipamento
│   └── components/
│       ├── EquipmentList.tsx  # Grid de equipamentos
│       ├── EquipmentActions.tsx # Ações por equipamento
│       ├── EquipmentFilters.tsx # Filtros e busca
│       └── EquipmentForm.tsx  # Formulário completo
├── locacoes/
│   ├── page.tsx               # Lista de locações
│   ├── actions.ts             # Server actions de locações
│   ├── [id]/
│   │   └── page.tsx           # Detalhes da locação
│   └── components/
│       ├── RentalsList.tsx    # Lista de locações
│       ├── RentalActions.tsx  # Ações por locação
│       ├── RentalsFilters.tsx # Filtros
│       └── RentalsStats.tsx   # Estatísticas
├── analise/
│   ├── page.tsx               # Análises e relatórios
│   └── components/
│       ├── PerformanceMetrics.tsx # Métricas
│       └── AnalyticsCharts.tsx    # Gráficos
└── configuracoes/
    ├── page.tsx               # Configurações
    ├── actions.ts             # Server actions de perfil
    └── components/
        └── SupplierProfileForm.tsx # Formulário de perfil
```

## 🔐 Segurança

### Autenticação e Autorização
- Todas as páginas protegidas por middleware
- Verificação de role SUPPLIER em todas as server actions
- Redirecionamento para /login se não autenticado
- Redirecionamento para /login/unauthorized se não for SUPPLIER
- Validação de propriedade em todas as operações

### Validações
- Schema Zod em todos os formulários
- Validação server-side em todas as actions
- Sanitização de inputs
- Verificação de permissões antes de qualquer operação
- Proteção contra exclusão de equipamentos com locações ativas

### Boas Práticas
- Server actions com 'use server'
- Client components apenas quando necessário
- Sem exposição de dados sensíveis
- Queries otimizadas com includes seletivos
- Revalidação de paths após mutações

## 🚀 Performance

### Otimizações
- Server Components por padrão
- Suspense boundaries com skeletons
- Lazy loading de componentes pesados
- Queries otimizadas com select específicos
- Agregações no banco de dados
- Cálculos no servidor

### Caching
- Next.js caching automático
- Revalidação estratégica de paths
- Server actions com revalidatePath

## 📊 Fluxo de Trabalho

### Cadastro de Equipamento
1. Fornecedor acessa "Novo Equipamento"
2. Preenche formulário completo
3. Equipamento criado com status "Disponível"
4. isApproved = false (aguarda aprovação do admin)
5. Após aprovação, fica visível no marketplace

### Gestão de Locação
1. Cliente cria locação no marketplace
2. Status inicial: PENDING
3. Fornecedor recebe notificação (futuro)
4. Fornecedor confirma → CONFIRMED
5. No dia, inicia → IN_PROGRESS
6. Ao fim, finaliza → COMPLETED
7. Pode cancelar (PENDING ou CONFIRMED) com motivo

### Análise de Desempenho
1. Dashboard mostra visão geral
2. Página de análise com detalhes
3. Gráficos de receita mensal
4. Ranking de equipamentos
5. Métricas de ocupação

## 🎯 Próximas Melhorias

### Funcionalidades
- [ ] Sistema de notificações em tempo real
- [ ] Chat com clientes
- [ ] Upload de múltiplas imagens
- [ ] Gestão de agenda/calendário
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Sistema de avaliações e feedback
- [ ] Integração com sistema de pagamento
- [ ] Gestão de manutenções

### UX/UI
- [ ] Onboarding para novos fornecedores
- [ ] Tutorial interativo
- [ ] Atalhos de teclado
- [ ] Modo de visualização compacto/expandido
- [ ] Customização de dashboard
- [ ] Temas personalizados

### Performance
- [ ] Virtual scrolling para listas grandes
- [ ] Paginação otimizada
- [ ] Cache mais agressivo
- [ ] Otimização de imagens
- [ ] Service Worker para offline

## 📱 Responsividade

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Adaptações
- Sidebar oculta em mobile
- Grid responsivo (1-2-3-4 colunas)
- Menu hamburguer em mobile
- Cards stack verticalmente
- Tabelas com scroll horizontal

## 🎨 Componentes Reutilizáveis

Todos os componentes seguem o padrão shadcn/ui:
- Button, Input, Textarea
- Card, Badge, Avatar
- Dialog, AlertDialog, Sheet
- Select, Combobox
- Form com react-hook-form + Zod
- Table, DataTable
- Skeleton, Loading states

## 🔧 Tecnologias

- Next.js 15 (App Router)
- React 19 (Server Components)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma (Neon PostgreSQL)
- NextAuth 5
- Zod (validação)
- react-hook-form
- date-fns
- Sonner (toasts)

## 📝 Convenções de Código

### Nomenclatura
- Componentes: PascalCase
- Arquivos: PascalCase para componentes, camelCase para utils
- Functions: camelCase
- Constants: UPPER_CASE
- Types: PascalCase

### Estrutura
- Server actions em arquivos actions.ts
- Componentes em pasta components/
- Tipos inline quando simples
- Funções pequenas (máx 10 linhas)
- Máximo 3 parâmetros por função
- Arrow functions sempre
- Sem comentários no código

### Princípios
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- SOLID
- Single Responsibility
- Composição sobre herança

## 🌟 Destaques de Implementação

### Animações Modernas
- Transições suaves em hover
- Loading states elegantes
- Progress bars animados
- Fade in/out em dialogs
- Scale em cards
- Skeleton loaders

### UX Profissional
- Feedback imediato em todas as ações
- Estados de loading apropriados
- Mensagens de erro claras
- Confirmações para ações destrutivas
- Breadcrumbs e navegação clara
- Atalhos visuais e quick actions

### Design System Consistente
- Espaçamentos padronizados
- Tipografia hierárquica
- Cores semânticas
- Componentes reutilizáveis
- Padrões de layout consistentes
- Iconografia uniforme (lucide-react)

---

**Sistema desenvolvido seguindo as mais modernas práticas de desenvolvimento web, com foco em segurança, performance e experiência do usuário profissional.**
