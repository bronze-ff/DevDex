# DevDex

Base pessoal de conhecimento técnico — site estático gerado com Astro + Starlight.

## Comandos

```bash
npm run dev       # servidor local em http://localhost:4321
npm run build     # build de produção (pasta dist/)
npm run preview   # preview do build local
```

## Estrutura

- `src/content/docs/` — todo o conteúdo em arquivos `.mdx`, organizado por seção
- `src/components/` — overrides de componentes do Starlight
- `astro.config.mjs` — configuração do Astro + sidebar + plugins

Cada pasta dentro de `docs/` é uma seção do sidebar. Para adicionar conteúdo: criar arquivo `.mdx` na pasta correspondente. O sidebar é gerado automaticamente via `autogenerate`.

---

## Git Workflow

### Sincronização com o remoto

Antes de qualquer trabalho, sempre verificar se o repositório local está atualizado:

```bash
git fetch origin
git status  # verifica se algum branch está atrás do remoto
```

### Branches

Sempre criar branch a partir de `main`. Nunca commitar direto em `main`.

Convenção de nomes:

```
feat/FIL-X-descricao-curta     # nova funcionalidade
fix/FIL-X-descricao-curta      # correção de bug
refactor/FIL-X-descricao       # refatoração
test/descricao                 # testes pontuais sem issue
chore/descricao                # manutenção, deps, config
```

Para criar uma branch nova, sempre partir explicitamente de `main` atualizado:

```bash
git checkout main && git pull
git checkout -b feat/FIL-X-descricao
```

### Worktrees

Para trabalhar em funcionalidades paralelas sem interromper o trabalho atual:

```bash
git checkout main && git pull
git worktree add -b feat/FIL-X-descricao ../App-9822-FIL-X main
# trabalhar no diretório separado
git worktree remove ../App-9822-FIL-X  # ao finalizar
```

### Commits

Seguir Conventional Commits. Sempre referenciar a issue do Linear no footer:

```
feat: adicionar filtro por status nas despesas

Closes FIL-X
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

### Pull Requests (via gh CLI)

Criar PRs com `gh pr create`. O corpo sempre deve conter `Closes FIL-X` para fechar a issue no Linear ao fazer merge:

```bash
gh pr create --title "feat: descrição" --body "$(cat <<'EOF'
## O que foi feito
- item 1
- item 2

## Como testar
1. passo 1
2. passo 2

Closes FIL-X
EOF
)"
```

Comandos úteis:

```bash
gh pr status                           # PRs abertos no repositório atual
gh pr checks                           # status de CI do PR atual
gh pr view                             # detalhes do PR atual
gh pr merge --squash --delete-branch   # mergear com histórico limpo
```

### Política de Merge

**Requer revisão do usuário antes do merge (criar PR e aguardar aprovação):**
- Qualquer alteração no banco de dados (queries, colunas lidas, DML de aprovação)
- Regras de negócio (fluxo de aprovação/reprovação, cálculo de retenções)
- Autenticação e permissões (JWT, middleware auth)
- Integrações externas

**Merge automático permitido (criar PR e mergear sem revisão):**
- Correções visuais de UI (cores, espaçamento, tipografia)
- Textos, labels, mensagens de erro
- Refatorações internas sem mudança de comportamento
- Documentação (CLAUDE.md, README)

### Integração Linear ↔ GitHub

- Issues são gerenciadas no Linear (planejamento, prioridade, sprint)
- PRs no GitHub referenciam as issues via `Closes FIL-X`
- Ao fazer merge do PR, o Linear fecha a issue automaticamente

---

## O que NUNCA fazer

**Git:**
- Nunca commitar direto em `main` — sempre branch + PR
- Nunca push em apenas um remote — sempre `origin` E `multicanal`

**UI/Design:**
- Nunca glassmorphism (`backdrop-blur`, `bg-white/80`, transparências em cards) — sistema é flat com bordas sólidas
- Nunca fonte Inter, Roboto ou system fonts — o projeto usa Bricolage Grotesque + DM Mono
- Nunca gradient blobs como decoração — backgrounds são planos; grid SVG sutil é o máximo permitido
- Nunca ícones dentro de círculos coloridos em KPI cards — KPIs usam número grande em mono
- Nunca `bg-gradient-to-br from-X-900 via-X-800` em logins — login usa navy via inline style com gradiente linear suave
- Nunca emojis em selects/options — usar texto limpo (ex: "Confirmar", não "✅ Confirmar")

