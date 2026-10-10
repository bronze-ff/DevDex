# Fluxo de desenvolvimento — DevDex

Issues, branches e PRs deste repositório. As regras para agentes estão no `AGENTS.md`. Este arquivo veio da raiz (`WORKFLOW.md`) em 10/10/2026: o tracker passou a ser o GitHub Issues daqui, não o Linear.

## Issues

Abra a issue em [bronze-ff/DevDex](https://github.com/bronze-ff/DevDex/issues). Use os templates de bug e feature. No PR, `Fixes #n` fecha a issue no merge.

## gh CLI

No PowerShell, se o `gh` ainda não estiver instalado: `winget install --id GitHub.cli -e`, depois `gh auth login`.

## Sincronizar

```powershell
git fetch origin
git status
```

## Branches

Sempre a partir do `master` atualizado. Não commitar direto no `master`.

```text
feat/descricao-curta
fix/descricao-curta
chore/descricao
```

```powershell
git switch master
git pull
git switch -c feat/descricao-curta
```

## Worktrees

Para duas mudanças ao mesmo tempo:

```powershell
git switch master
git pull
git worktree add -b feat/descricao ..\DevDex-descricao master
```

Ao terminar: `git worktree remove ..\DevDex-descricao`.

## Commits

Conventional Commits. Com issue:

```text
feat: adicionar página de TypeScript

Fixes #12
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `chore`.

## Pull request

`npm run verify` verde antes de abrir. O Codex Review lê o PR sozinho; não é preciso comentar `@codex review`. Merge só com review limpa e CI verde.

```powershell
gh pr create --title "feat: descrição" --body "$(@'
## O que foi feito
- item

## Como testar
1. npm run verify

Fixes #12
'@)"
```

```powershell
gh pr status
gh pr checks
gh pr view
gh pr merge --squash --delete-branch
```

## O que pede olhar antes do merge

- `vercel.json` (CSP e headers)
- `astro.config.mjs` quando muda sidebar, `site` ou o Sentry do build
- `.github/`
- Dependência nova no `package.json`

Texto, página `.mdx` e correção localizada seguem o mesmo PR, com o gate da CI e do Codex Review.
