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

Antes de qualquer trabalho, verificar se o repositório local está atualizado:

```bash
git fetch origin
git status
```

### Quando commitar direto no `master`

Para mudanças de conteúdo rotineiras, commit direto no `master` é permitido:

- Adição e edição de páginas `.mdx`
- Adições a Sites Salvos e Setup
- README e CLAUDE.md
- Correções de texto ou links

### Quando criar branch + PR

Para mudanças estruturais ou de código, sempre usar branch + PR:

- Nova seção do sidebar (nova pasta em `docs/`)
- Mudanças no `astro.config.mjs` que afetam estrutura ou navegação
- Novos componentes Astro em `src/components/`
- Atualização de dependências (`package.json`)
- Qualquer mudança experimental ou de maior risco

Convenção de nomes:

```
feat/descricao-curta     # nova funcionalidade
fix/descricao-curta      # correção de bug
chore/descricao          # manutenção, deps, config
```

Criar branch sempre a partir do `master` atualizado:

```bash
git checkout master && git pull
git checkout -b feat/descricao
```

### Commits

Seguir Conventional Commits:

```
feat: adicionar seção de TypeScript ao sidebar
fix: corrigir link quebrado na página de Git
docs: atualizar README com novas seções
chore: atualizar dependência do Starlight
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `chore`

### Pull Requests (via gh CLI)

```bash
gh pr create --title "feat: descrição" --body "$(cat <<'EOF'
## O que foi feito
- item 1
- item 2

## Como testar
1. passo 1
2. passo 2
EOF
)"
```

Comandos úteis:

```bash
gh pr status                           # PRs abertos no repositório atual
gh pr view                             # detalhes do PR atual
gh pr merge --squash --delete-branch   # mergear com histórico limpo
```

---

## O que NUNCA fazer

- Nunca force push no `master`
- Nunca commitar arquivos de ambiente (`.env`, credenciais)

