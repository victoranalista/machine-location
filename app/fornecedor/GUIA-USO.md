# 🚀 Guia de Início Rápido - Portal do Fornecedor

## Como Usar o Sistema

### 1. Acessar como Fornecedor

Para acessar o portal do fornecedor, o usuário precisa ter a role `SUPPLIER` no banco de dados.

#### Opção A: Criar Usuário Fornecedor via Registro
```typescript
// O usuário se registra normalmente em /register
// Depois, um ADMIN precisa alterar o role no banco de dados:

// Via Prisma Studio:
npx prisma studio
// Encontre o usuário e altere role de USER para SUPPLIER
```

#### Opção B: Criar Diretamente no Banco
```sql
UPDATE "User" 
SET role = 'SUPPLIER' 
WHERE email = 'seuemail@exemplo.com';
```

### 2. Login
```
URL: /login
Email: seuemail@exemplo.com
Senha: suasenha

Após login, será redirecionado para: /fornecedor
```

### 3. Navegação

- **Dashboard**: `/fornecedor` - Visão geral do negócio
- **Equipamentos**: `/fornecedor/equipamentos` - Gerenciar catálogo
- **Locações**: `/fornecedor/locacoes` - Acompanhar locações
- **Análise**: `/fornecedor/analise` - Relatórios e métricas
- **Configurações**: `/fornecedor/configuracoes` - Perfil

---

## 📝 Fluxo de Trabalho

### Cadastrar Primeiro Equipamento

1. Acesse `/fornecedor`
2. Clique em "Novo Equipamento" ou vá para `/fornecedor/equipamentos/novo`
3. Preencha o formulário:
   - **Obrigatório**: Nome, Descrição, Categoria, Diária
   - **Opcional**: Marca, Modelo, Ano, Semanal, Mensal, Caução, etc.
4. Clique em "Criar Equipamento"
5. Equipamento criado com status `AVAILABLE` e `isApproved: false`
6. Aguarde aprovação do admin para aparecer no marketplace

### Gerenciar Locações

#### Quando um cliente faz uma locação:
1. Aparece no dashboard em "Locações Recentes"
2. Status inicial: `PENDING`
3. Acesse a locação em `/fornecedor/locacoes`

#### Fluxo de Status:
```
PENDING (Pendente)
   ↓ Confirmar
CONFIRMED (Confirmada)
   ↓ Iniciar
IN_PROGRESS (Em Andamento)
   ↓ Finalizar
COMPLETED (Concluída)

Cancelar pode ser feito em PENDING ou CONFIRMED
```

#### Ações Disponíveis:
- **Ver detalhes**: Informações completas
- **Confirmar**: Aceitar a locação
- **Iniciar**: Marcar como iniciada
- **Finalizar**: Concluir a locação
- **Cancelar**: Com motivo obrigatório

### Acompanhar Performance

1. Acesse `/fornecedor/analise`
2. Veja métricas de:
   - Receita total e mensal
   - Taxa de ocupação
   - Equipamentos mais alugados
   - Evolução de receita

### Atualizar Perfil

1. Acesse `/fornecedor/configuracoes`
2. Preencha seus dados:
   - Nome, Empresa, Telefone
   - CPF/CNPJ
   - Endereço completo
3. Salve as alterações

---

## 🎯 Casos de Uso Comuns

### Editar um Equipamento
1. Vá para `/fornecedor/equipamentos`
2. Clique nos três pontos do equipamento
3. Selecione "Editar"
4. Atualize as informações
5. Salve

### Desativar um Equipamento
1. Vá para `/fornecedor/equipamentos`
2. Clique nos três pontos
3. Selecione "Desativar"
4. Status muda para `UNAVAILABLE`

### Excluir um Equipamento
1. Vá para `/fornecedor/equipamentos`
2. Clique nos três pontos
3. Selecione "Excluir"
4. Confirme a exclusão
5. ⚠️ **Não será possível se houver locações ativas**

### Cancelar uma Locação
1. Vá para `/fornecedor/locacoes`
2. Clique nos três pontos da locação
3. Selecione "Cancelar locação"
4. **Obrigatório**: Informe o motivo
5. Confirme o cancelamento

---

## 🔒 Permissões e Segurança

### O que o Fornecedor PODE fazer:
✅ Ver e gerenciar APENAS seus equipamentos
✅ Ver e gerenciar APENAS locações dos seus equipamentos
✅ Atualizar seu próprio perfil
✅ Ver análises dos seus próprios dados

### O que o Fornecedor NÃO pode fazer:
❌ Ver equipamentos de outros fornecedores
❌ Ver locações de outros fornecedores
❌ Aprovar equipamentos (apenas ADMIN)
❌ Alterar dados de clientes
❌ Processar pagamentos

---

## 📱 Responsividade

### Mobile (< 640px)
- Menu hamburguer lateral
- Cards em coluna única
- Tabelas com scroll horizontal
- Sidebar oculta por padrão

### Tablet (640px - 1024px)
- Grid de 2 colunas
- Sidebar oculta por padrão
- Cards adaptados

### Desktop (> 1024px)
- Sidebar fixa visível
- Grid de 3-4 colunas
- Layout completo

---

## 🎨 Atalhos e Dicas

### Dashboard
- Clique nos cards de métricas para ir para a página correspondente
- Use os botões de "Ações Rápidas" para acesso direto

### Equipamentos
- Use a busca para filtrar rapidamente
- Selecione status no dropdown para ver apenas disponíveis, alugados, etc.

### Locações
- Filtre por status para ver apenas pendentes, em andamento, etc.
- Use a busca por número da locação ou nome do cliente

### Dark Mode
- Clique no ícone de sol/lua no header
- A preferência é salva automaticamente

---

## 🐛 Solução de Problemas

### "Acesso negado" ao tentar acessar /fornecedor
**Problema**: Usuário não tem role SUPPLIER
**Solução**: Altere o role no banco de dados ou peça ao admin

### Equipamento não aparece no marketplace
**Problema**: `isApproved: false`
**Solução**: Aguarde aprovação do admin ou peça para aprovar

### Não consigo excluir equipamento
**Problema**: Equipamento tem locações ativas
**Solução**: Aguarde finalizar as locações ou desative o equipamento

### Formulário não envia
**Problema**: Campos obrigatórios não preenchidos
**Solução**: Verifique mensagens de erro embaixo dos campos

---

## 📊 Métricas e KPIs

### Dashboard mostra:
- Total de equipamentos cadastrados
- Locações ativas (IN_PROGRESS)
- Locações pendentes (PENDING)
- Receita do mês atual
- Receita total histórica

### Análise mostra:
- Evolução de receita (últimos 6 meses)
- Top 5 equipamentos mais alugados
- Taxa de ocupação em %
- Crescimento mensal em %

---

## 🎓 Boas Práticas

### Ao Cadastrar Equipamentos
1. ✅ Use nomes descritivos e claros
2. ✅ Preencha descrição completa
3. ✅ Adicione imagem de qualidade
4. ✅ Defina valores realistas
5. ✅ Configure caução quando necessário
6. ✅ Mantenha informações atualizadas

### Ao Gerenciar Locações
1. ✅ Confirme rapidamente locações pendentes
2. ✅ Atualize status conforme andamento
3. ✅ Seja claro ao cancelar (motivo detalhado)
4. ✅ Responda dúvidas dos clientes
5. ✅ Mantenha informações de entrega corretas

### Perfil
1. ✅ Mantenha telefone atualizado
2. ✅ Preencha endereço completo
3. ✅ Use email profissional
4. ✅ Adicione informações da empresa

---

## 🔄 Atualizações Futuras

### Em Desenvolvimento
- [ ] Notificações em tempo real
- [ ] Chat com clientes
- [ ] Upload múltiplo de imagens
- [ ] Calendário de disponibilidade
- [ ] Exportação de relatórios
- [ ] Sistema de avaliações

### Planejado
- [ ] App mobile
- [ ] API pública
- [ ] Integrações
- [ ] Automações

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Acesse "Suporte 24/7" na sidebar
- Email: suporte@maquinaloc.com
- WhatsApp: (11) 99999-9999

---

**Sistema pronto para uso! Boas vendas! 🚀**
