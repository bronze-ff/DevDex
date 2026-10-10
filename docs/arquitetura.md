# Arquitetura

Site estático. O Astro pré-renderiza cada rota no build. A Vercel publica a pasta `dist/`. Não há servidor de aplicação, banco nem autenticação.

```text
browser
  │  HTML + JS do Starlight (busca Pagefind, tema, view transitions)
  │  devdex.js (checklist local e gerador de script)
  │  posthog-js, só se PUBLIC_POSTHOG_KEY existir no build
  │  @sentry/astro, só se PUBLIC_SENTRY_DSN existir no build
  ▼
Vercel (arquivos estáticos + headers de vercel.json)
  │
  ├── us.i.posthog.com          pageview / pageleave, sem cookie e sem identify
  └── *.ingest.sentry.io        erro, se o DSN estiver configurado
```

## Pastas

```text
src/content/docs/     conteúdo MDX (coleções docs + i18n do Starlight)
src/content/i18n/     pt-BR
src/components/       PageTitle, Head, SetupGenerator, TermPlay
src/styles/custom.css tema
src/scripts/          PostHog
src/lib/              scrub do Sentry e opções de init
public/               assets estáticos
astro.config.mjs      Astro, Starlight, plugin de source maps do Sentry
vercel.json           CSP e demais headers
```

A sidebar não é gerada pela pasta: a lista está em `astro.config.mjs`. Um `.mdx` novo sem item na sidebar continua acessível pela URL, mas não aparece no menu.

## Build

`astro build` gera HTML e o índice do Pagefind. Links externos passam por `rehype-external-links` (`target=_blank`, `noopener noreferrer`).

O `astro.config.mjs` lê o ambiente na hora do build e injeta três constantes no client:

| Constante | Valores |
|---|---|
| `__DEVDEX_ENVIRONMENT__` | `production`, `preview` ou `development` (vem de `VERCEL_ENV`) |
| `__DEVDEX_SENTRY_ENVIRONMENT__` | `producao`, `homologacao` ou `dev` |
| `__DEVDEX_RELEASE__` | `VERCEL_GIT_COMMIT_SHA` ou `GITHUB_SHA`, ou vazio |

`PUBLIC_*` o Vite coloca no bundle. Por isso a chave do PostHog e o DSN precisam existir na Vercel no momento do build, não só em runtime.

## Observabilidade no client

`src/components/Head.astro` carrega `startAnalytics()`. Sem `PUBLIC_POSTHOG_KEY`, a função retorna e o `posthog-js` não é importado. Com a chave, o init é cookieless (`cookieless_mode: 'always'`, `person_profiles: 'never'`). O `register` vem logo em seguida, com `app: 'devdex'` e o ambiente, e só então o `$pageview`. Troca de página (view transition) dispara outro pageview, sem duplicar a mesma URL.

O Sentry só chama `Sentry.init` quando `PUBLIC_SENTRY_DSN` está preenchido. O plugin do Astro também fica `enabled: false` sem o DSN, então o CI e o `npm run dev` não dependem da conta. Replay não é registrado. `tracesSampleRate` é `0.1`. `beforeSend` e `beforeBreadcrumb` passam por `src/lib/privacy-scrub.ts`.

## O que não entra no desenho

- Root Directory da Vercel: raiz do repositório. Não há `web/` nem `api/`.
- Sem adapter de SSR. O middleware de request do Sentry não se aplica (site estático).
- Checklist e "copiar artigo" não saem do browser.
