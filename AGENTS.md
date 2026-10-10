# AGENTS.md

Regras para Codex, Cursor e outros agentes neste repositório. O `CLAUDE.md` só aponta para cá.

## Como trabalhar aqui

DevDex é um site estático público (Astro + Starlight) na raiz do repositório. O deploy é a Vercel, no projeto que publica `https://dev-dex-one.vercel.app`. Não há API, banco nem login.

Antes de abrir ou atualizar um PR, rode `npm run verify` (typecheck, teste do scrub e build de produção) e deixe verde. O mesmo comando é o job `fast` da CI.

Issues ficam no GitHub Issues deste repositório (`bronze-ff/DevDex`). Não use Linear nem IDs `FIL-xxx`. No corpo do PR, `Fixes #n` fecha a issue no merge.

Todo PR passa por Codex Review. Só entra no `master` com review limpa (sem P0/P1 aberto) e CI verde. Não comente `@codex review`: o review automático já cobre o PR.

## Comandos

Node `>=22.12.0` (`.nvmrc`). No PowerShell, a partir da raiz:

```powershell
npm install
npm run dev       # http://localhost:4321
npm run check     # astro check
npm run verify    # obrigatório antes do PR: astro check + astro build
npm run build
npm run preview
```

Não há ESLint. `verify` é typecheck, o teste do scrub (`node --test` em `src/lib/privacy-scrub.test.ts`) e build. Não invente outro runner.

## Estrutura e onde mexer

| Caminho | O que é |
|---|---|
| `src/content/docs/` | Conteúdo em `.mdx`. Cada pasta é uma seção. A sidebar está explícita em `astro.config.mjs` (não é autogenerate). |
| `src/components/` | Overrides do Starlight (`PageTitle`, `Head`) e peças da página (`SetupGenerator`, `TermPlay`). |
| `src/scripts/analytics.ts` | PostHog cookieless. Só web analytics. |
| `src/lib/privacy-scrub.ts` | Scrub de CPF, CNPJ, telefone, e-mail, placa e campos sensíveis no Sentry. |
| `sentry.client.config.ts`, `sentry.server.config.ts` | Init do Sentry. Sem `PUBLIC_SENTRY_DSN`, não chama `init`. |
| `public/` | Favicon, fonte Departure Mono, `scripts/devdex.js` (checklists e gerador). |
| `astro.config.mjs` | Site, sidebar, Starlight, Sentry (build) e ambiente injetado no client. |
| `vercel.json` | Headers de segurança, inclusive CSP. |
| `docs/` | Docs do repositório (não são páginas do site). |

Páginas novas: arquivo `.mdx` na pasta da seção e o item correspondente em `sidebar` no `astro.config.mjs`.

## Não faça

- Commitar `.env`, `.env.*` (exceto `.env.example`), `.mcp.json`, DSN, chave do PostHog ou `SENTRY_AUTH_TOKEN`.
- Hardcodar DSN ou chave. Sem a env var, o SDK correspondente fica no-op.
- Chamar `posthog.identify`, `alias` ou `setPersonProperties`. O site não identifica ninguém.
- Ligar Session Replay, autocapture ou gravar corpo de request no Sentry.
- Renomear pastas de código ou mudar o Root Directory da Vercel. O app fica na raiz.
- Force push no `master`.
- Mexer em `vercel.json`, `astro.config.mjs` (sidebar/site) ou `.github/` sem a issue pedir. São risco alto.
- Reescrever histórico ou apagar o conteúdo publicado em `src/content/docs/` para "limpar" menções a Linear em guias de outros projetos. O fluxo deste repo é que muda; os artigos ensinam o assunto.

## Git e issues

Branch a partir do `master` atualizado: `feat/`, `fix/` ou `chore/` + descrição curta. Conventional Commits (`feat`, `fix`, `refactor`, `docs`, `chore`).

Commit direto no `master` não é o caminho. Conteúdo, docs e código entram por PR.

Detalhe de `gh`, worktree e merge: `docs/workflow.md`.

## Code Review Rules

- Segredo, DSN ou chave no git ou em arquivo que não seja `.env.example` com valor vazio — P0.
- `sendDefaultPii: true`, ou `dataCollection.userInfo` / `cookies` / `httpHeaders` / `httpBodies` ligados — P0. O SDK 11 usa `dataCollection`; `sendDefaultPii` permanece `false`.
- PostHog sem `cookieless_mode: 'always'` e `person_profiles: 'never'`, ou qualquer `identify` / `alias` — P0.
- `tracesSampleRate` acima de `0.1`, ou Session Replay ligado — P0.
- Remover `beforeSend` / `beforeBreadcrumb` ou o scrub de CPF, CNPJ, telefone, e-mail, placa e campos `senha|token|authorization|cookie` — P0.
- `connect-src` ou `script-src` aberto além dos hosts do PostHog US e do ingest do Sentry — P1.
- Mudar `site`, output do Astro ou o fato de o deploy ser a raiz — P1.
- PR sem `npm run verify` verde — P1.

## Observabilidade

Sentry: projeto `devdex`, SDK `@sentry/astro`. DSN só em `PUBLIC_SENTRY_DSN`. Ambiente da tag: `producao`, `homologacao` ou `dev`. Release = SHA do commit quando a Vercel ou o Actions expõem. `sampleRate` 1, `tracesSampleRate` 0.1, replay desligado. Source maps só sobem se `SENTRY_AUTH_TOKEN` e `SENTRY_ORG` existirem no build; sem eles o build segue. Não logar dado pessoal.

PostHog: projeto único compartilhado, host `https://us.i.posthog.com` via `PUBLIC_POSTHOG_HOST` (a chave é `PUBLIC_POSTHOG_KEY`). Init com `cookieless_mode: 'always'` e `person_profiles: 'never'`. Logo após o init, `posthog.register({ app: 'devdex', environment })` com `production`, `preview` ou `development`. Só pageview e pageleave. O modo cookieless precisa estar ligado no projeto PostHog, senão o evento é descartado.
