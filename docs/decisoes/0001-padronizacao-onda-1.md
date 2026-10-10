# 0001 — Padronização da onda 1

**Data:** 10/10/2026  
**Status:** aceita

## Contexto

O DevDex é um Astro na raiz, publicado na Vercel. Tinha `CLAUDE.md` e `WORKFLOW.md`, sem `AGENTS.md` e sem CI. A onda 1 padroniza docs, limpeza, CI e observabilidade sem mudar caminho de build nem Root Directory.

## Decisão

- `AGENTS.md` é a única lista de regras. `CLAUDE.md` contém só `@AGENTS.md`.
- `WORKFLOW.md` saiu da raiz e virou `docs/workflow.md`. Issues deste repo são GitHub Issues (`#n`), não Linear.
- Todo PR passa por Codex Review e só entra no `master` com review limpa e CI verde. Commit direto no `master`, mesmo de conteúdo, deixa de ser o fluxo.
- CI nova em `.github/workflows/ci.yml`: um job rápido, actions fixadas por SHA, gitleaks só nos commits do PR/push, osv e zizmor condicionais.
- Sentry com `@sentry/astro`, projeto `devdex`, DSN por `PUBLIC_SENTRY_DSN`, no-op sem ela. Source maps só com token.
- PostHog só como web analytics do projeto compartilhado (`https://us.i.posthog.com`): `cookieless_mode: 'always'`, `person_profiles: 'never'`, `register` com `app` e `environment` logo após o init, sem `identify`.
- `.vscode/` permanece. `extensions.json` recomenda a extensão oficial do Astro e `launch.json` abre o `astro dev`. Não há path de máquina nem segredo. É config compartilhada.

## Consequências

- Quem for publicar de verdade precisa criar o projeto Sentry `devdex` (se ainda não existir), ligar o modo cookieless no PostHog e preencher as variáveis na Vercel. A lista está em `docs/operacao.md`.
- A CSP passa a permitir conexão com o ingest do Sentry e com os dois hosts US do PostHog. `script-src` continua `'self'`.
- O aviso moderado do `postcss-selector-parser` fica documentado e ignorado no scanner até 2027-01-10.
- Artigos em `src/content/docs/claude-code/` continuam explicando Linear como opção para outros projetos. Não são o fluxo do DevDex.
