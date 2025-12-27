# Guia de Desenvolvimento - EquipRent

Este documento é um guia prático para desenvolvedores que vão trabalhar no projeto.

## 🚀 Configuração Inicial

### 1. Pré-requisitos

```bash
# Versões necessárias
Node.js >= 20.x
pnpm >= 9.x (recomendado) ou npm >= 10.x
Git
PostgreSQL (ou usar Neon online)
```

### 2. Clone e Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd machine-location

# Instale dependências
pnpm install

# Copie o .env.example
cp .env.example .env.local
```

### 3. Configurar Banco de Dados

**Opção A: Neon (Recomendado para desenvolvimento)**

1. Crie conta em https://neon.tech
2. Crie novo projeto PostgreSQL
3. Copie as connection strings para `.env.local`:

```env
POSTGRES_PRISMA_URL="postgresql://user:pass@host/db?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://user:pass@host/db?sslmode=require"
```

**Opção B: PostgreSQL Local**

```bash
# Windows (com PostgreSQL instalado)
createdb equiprent

# Adicione ao .env.local
DATABASE_URL="postgresql://postgres:sua-senha@localhost:5432/equiprent"
```

### 4. Configurar NextAuth

```bash
# Gere uma secret key
openssl rand -base64 32

# Adicione ao .env.local
NEXTAUTH_SECRET="sua-chave-gerada-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Google OAuth (Opcional)

1. Vá para https://console.cloud.google.com
2. Crie novo projeto
3. Habilite Google+ API
4. Crie credenciais OAuth 2.0
5. Adicione ao `.env.local`:

```env
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

### 6. Inicializar Banco

```bash
# Gere o Prisma Client
pnpm prisma generate

# Execute as migrations
pnpm prisma migrate dev --name init

# (Opcional) Popular com dados de exemplo
pnpm db:seed
```

### 7. Iniciar Desenvolvimento

```bash
# Iniciar servidor Next.js
pnpm dev

# Abrir no navegador
http://localhost:3000
```

## 📁 Estrutura de Pastas

```
machine-location/
├── app/                          # Next.js App Router
│   ├── (marketplace)/            # Grupo de rotas públicas
│   │   ├── page.tsx              # Landing page
│   │   ├── equipamentos/         # Catálogo
│   │   └── minha-conta/          # Área do cliente
│   ├── (fornecedor)/fornecedor/  # Área do fornecedor
│   ├── (admin)/admin/            # Painel admin
│   ├── login/                    # Autenticação
│   └── api/auth/[...nextauth]/   # NextAuth API
│
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui components
│   ├── DarkMode.tsx
│   └── ...
│
├── lib/                          # Bibliotecas e utilitários
│   ├── auth/                     # NextAuth config
│   ├── prisma/                   # Prisma client
│   ├── schemas/                  # Zod validation schemas
│   └── utils/                    # Funções utilitárias
│
├── prisma/
│   └── schema.prisma             # Schema do banco
│
├── public/                       # Assets estáticos
│
└── package.json
```

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
pnpm dev              # Inicia servidor de desenvolvimento
pnpm build            # Build de produção
pnpm start            # Inicia servidor de produção
pnpm lint             # Verifica código com ESLint
```

### Banco de Dados

```bash
# Prisma
pnpm prisma studio            # Interface visual do banco
pnpm prisma generate          # Regenera Prisma Client
pnpm prisma migrate dev       # Cria e aplica migration
pnpm prisma migrate reset     # ⚠️ RESETA o banco (cuidado!)

# Seeds
pnpm db:seed                  # Popula banco com dados de exemplo
```

### TypeScript

```bash
pnpm tsc --noEmit            # Verifica tipos sem compilar
```

## 🎨 Padrões de Código

### Componentes React

```typescript
// Use "use client" apenas quando necessário
// Prefira Server Components sempre que possível

// ✅ Server Component (padrão)
export default async function EquipmentList() {
  const equipment = await getEquipmentList();
  
  return (
    <div>
      {equipment.map(item => (
        <EquipmentCard key={item.id} equipment={item} />
      ))}
    </div>
  );
}

// ✅ Client Component (quando precisa de interatividade)
'use client';

import { useState } from 'react';

export function EquipmentFilter() {
  const [category, setCategory] = useState('');
  
  return (
    <select onChange={(e) => setCategory(e.target.value)}>
      {/* ... */}
    </select>
  );
}
```

### Server Actions

```typescript
// Sempre use 'use server' no topo do arquivo
'use server';

import { prisma } from '@/lib/prisma/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/auth';

// Exemplo de Server Action
export async function createEquipment(formData: FormData) {
  // 1. Autenticação
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  
  // 2. Validação com Zod
  const validated = equipmentSchema.parse({
    name: formData.get('name'),
    // ...
  });
  
  // 3. Autorização (role check)
  if (session.user.role !== 'SUPPLIER') {
    throw new Error('Only suppliers can create equipment');
  }
  
  // 4. Database operation
  const equipment = await prisma.equipment.create({
    data: {
      ...validated,
      ownerId: session.user.id,
      isApproved: false,
      status: 'MAINTENANCE',
    },
  });
  
  // 5. Revalidação de cache
  revalidatePath('/fornecedor/equipamentos');
  
  return equipment;
}
```

### Validação com Zod

```typescript
// lib/schemas/equipment.ts
import { z } from 'zod';

export const equipmentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  categoryId: z.string().cuid(),
  brandId: z.string().cuid(),
  dailyRate: z.number().positive('Preço deve ser positivo'),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  // ...
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;
```

### Nomeação

```typescript
// ✅ Componentes: PascalCase
EquipmentCard.tsx
UserProfile.tsx

// ✅ Funções: camelCase
getEquipmentList()
createRental()

// ✅ Constantes: UPPER_SNAKE_CASE
const MAX_RENTAL_DAYS = 365;

// ✅ Tipos/Interfaces: PascalCase
type Equipment = { ... }
interface User { ... }

// ✅ Arquivos de ações: kebab-case ou actions.ts
app/(marketplace)/equipments/actions.ts
```

## 🗄️ Trabalhando com Prisma

### Modificar Schema

```bash
# 1. Edite prisma/schema.prisma
# 2. Crie migration
pnpm prisma migrate dev --name descricao-da-mudanca

# 3. Prisma Client será regenerado automaticamente
```

### Queries Comuns

```typescript
// Buscar todos
const equipment = await prisma.equipment.findMany();

// Buscar por ID
const equipment = await prisma.equipment.findUnique({
  where: { id: 'cuid' }
});

// Buscar com filtros
const equipment = await prisma.equipment.findMany({
  where: {
    status: 'AVAILABLE',
    isApproved: true,
    categoryId: 'category-id',
  },
  include: {
    category: true,
    brand: true,
    owner: {
      select: { name: true, email: true }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

// Criar
const equipment = await prisma.equipment.create({
  data: {
    name: 'Escavadeira',
    ownerId: 'user-id',
    categoryId: 'category-id',
    // ...
  }
});

// Atualizar
const equipment = await prisma.equipment.update({
  where: { id: 'equipment-id' },
  data: { status: 'RENTED' }
});

// Deletar
await prisma.equipment.delete({
  where: { id: 'equipment-id' }
});
```

## 🎯 Fluxos de Desenvolvimento Comuns

### Adicionar Nova Feature

1. **Criar branch**
```bash
git checkout -b feature/nome-da-feature
```

2. **Se precisar modificar schema**
```bash
# Edite prisma/schema.prisma
pnpm prisma migrate dev --name adiciona-campo-x
```

3. **Criar Server Actions**
```typescript
// app/sua-area/actions.ts
'use server';

export async function suaNovaAction() {
  // implementação
}
```

4. **Criar/Atualizar Componentes**
```typescript
// app/sua-area/page.tsx ou components/...
```

5. **Testar localmente**
```bash
pnpm dev
# Testa no navegador
```

6. **Commit e Push**
```bash
git add .
git commit -m "feat: adiciona funcionalidade X"
git push origin feature/nome-da-feature
```

### Adicionar Novo Componente shadcn/ui

```bash
# Lista componentes disponíveis
npx shadcn@latest add

# Adiciona um componente específico
npx shadcn@latest add dialog
npx shadcn@latest add calendar

# Componente será criado em components/ui/
```

### Debugging

```typescript
// 1. Console.log em Server Components
export default async function Page() {
  const data = await getData();
  console.log('Data:', data); // Aparece no terminal, não no navegador
  return <div>...</div>;
}

// 2. Console.log em Client Components
'use client';

export function Component() {
  console.log('Client log'); // Aparece no navegador
}

// 3. Prisma debug
// Adicione ao .env
DEBUG=prisma:query

// 4. NextAuth debug
// Adicione ao .env
NEXTAUTH_DEBUG=true
```

## 🔐 Autenticação

### Obter Sessão em Server Component

```typescript
import { auth } from '@/lib/auth/auth';

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Olá, {session.user.name}</div>;
}
```

### Obter Sessão em Client Component

```typescript
'use client';

import { useSession } from '@/lib/hooks/use-session';

export function UserMenu() {
  const session = useSession();
  
  if (!session) return <LoginButton />;
  
  return <div>{session.user.name}</div>;
}
```

### Proteger Server Action

```typescript
'use server';

import { auth } from '@/lib/auth/auth';

export async function protectedAction() {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  
  if (session.user.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }
  
  // Ação permitida
}
```

## 🎨 Estilos com Tailwind

```typescript
// ✅ Use classes utilitárias
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">

// ✅ Use variáveis CSS para temas
<div className="bg-background text-foreground">

// ✅ Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ✅ Dark mode
<div className="bg-white dark:bg-gray-900">

// ❌ Evite inline styles
<div style={{ padding: '16px' }}>
```

## 📝 Convenções Git

### Mensagens de Commit

```bash
# Formato
tipo(escopo): descrição

# Tipos comuns
feat:     # Nova funcionalidade
fix:      # Correção de bug
refactor: # Refatoração de código
style:    # Formatação, lint
docs:     # Documentação
test:     # Testes
chore:    # Tarefas gerais

# Exemplos
feat(auth): adiciona login com Google
fix(rental): corrige cálculo de preço
refactor(equipment): simplifica query do prisma
docs(readme): atualiza instruções de instalação
```

### Branches

```
main              # Produção
develop           # Desenvolvimento
feature/nome      # Novas features
fix/nome          # Correções
hotfix/nome       # Correções urgentes em produção
```

## 🐛 Problemas Comuns

### "Cannot find module '@/lib/...'"

```bash
# Reinstale dependências
rm -rf node_modules
pnpm install
```

### Erro de tipo do Prisma

```bash
# Regenere o Prisma Client
pnpm prisma generate
```

### Erro "NEXTAUTH_URL environment variable is not set"

```bash
# Adicione ao .env.local
NEXTAUTH_URL=http://localhost:3000
```

### Erro de conexão com banco

```bash
# Verifique se as variáveis estão corretas
cat .env.local

# Teste conexão
pnpm prisma db push
```

### Componente não atualiza após mudança

```bash
# Limpe cache do Next.js
rm -rf .next
pnpm dev
```

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 💡 Dicas

1. **Use TypeScript**: Aproveite a inferência de tipos do Prisma
2. **Prefira Server Components**: Melhor performance e SEO
3. **Use Server Actions**: Evite criar API routes desnecessárias
4. **Revalide cache**: Use `revalidatePath()` após mutações
5. **Trate erros**: Use try/catch e retorne mensagens amigáveis
6. **Valide inputs**: Sempre use Zod para validação
7. **Teste localmente**: Antes de fazer commit, teste tudo
8. **Leia os logs**: Terminal e DevTools Console são seus amigos

## 🚦 Checklist para PRs

- [ ] Código buildado sem erros (`pnpm build`)
- [ ] Sem erros de lint (`pnpm lint`)
- [ ] Tipos TypeScript corretos (`pnpm tsc --noEmit`)
- [ ] Testado localmente em diferentes cenários
- [ ] Migrations criadas se houver mudanças no schema
- [ ] Documentação atualizada se necessário
- [ ] Mensagens de commit seguem convenção
- [ ] Branch atualizada com develop/main

---

**Dúvidas?** Consulte a documentação ou pergunte no time!
