# Operação

## Deploy

A Vercel faz o build no push do `master` e em cada PR (preview). O framework detectado é Astro, output `dist/`, Root Directory na raiz. Este repositório não tem outro workflow de deploy.

Rollback: no painel da Vercel, promote do deployment anterior. Não há migration para desfazer.

## Variáveis

Nenhuma é obrigatória para o site abrir. Sem elas, Sentry e PostHog ficam desligados.

| Variável | Onde | Para quê |
|---|---|---|
| `PUBLIC_SENTRY_DSN` | Vercel, Production e Preview | DSN do projeto Sentry `devdex`. Entra no bundle. |
| `SENTRY_ORG` | Vercel, Production e Preview (build) | Slug da organização, para source maps. Não vai para o browser. |
| `SENTRY_PROJECT` | Vercel, opcional | Default no código: `devdex`. |
| `SENTRY_AUTH_TOKEN` | Vercel, Production e Preview (build) | Token de organização do Sentry. Sem ele o build não tenta upload e não falha. |
| `PUBLIC_POSTHOG_KEY` | Vercel, Production e Preview | Chave do projeto único compartilhado. Entra no bundle. |
| `PUBLIC_POSTHOG_HOST` | Vercel, Production e Preview | `https://us.i.posthog.com`. |

Não coloque essas variáveis em secret do GitHub Actions. A CI só roda `npm run verify` e não publica. O artefato que vai ao ar é o build da Vercel.

`environment` no PostHog: `production` no deploy de produção, `preview` no preview, `development` no `astro dev`. A tag do Sentry correspondente é `producao`, `homologacao` e `dev`.

## PostHog

Projeto único, região US. No init: `cookieless_mode: 'always'` e `person_profiles: 'never'`. Não há `identify`.

No projeto, **Cookieless server hash mode** precisa estar ligado (Project Settings → Web analytics). Sem isso o PostHog descarta o evento.

O que é enviado: `$pageview` e `$pageleave`, mais as propriedades `app=devdex` e `environment`. Autocapture, session recording, surveys e feature flags estão desligados. Texto e atributos ficam mascarados se algum evento de UI escapar.

A CSP em `vercel.json` libera `connect-src` para `https://us.i.posthog.com` e `https://us-assets.i.posthog.com`. O SDK não injeta script externo (`disable_external_dependency_loading`).

## Sentry

Projeto `devdex`, SDK `@sentry/astro`. Erro de extensão e `ResizeObserver` são descartados. Campos `senha`, `token`, `authorization` e `cookie`, e textos com cara de CPF, CNPJ, telefone, e-mail ou placa, saem mascarados. Corpo, header, cookie e query string não são coletados. IP e usuário padrão ficam desligados (`sendDefaultPii: false` e `dataCollection.userInfo: false`).

Source maps: o plugin só autentica se `SENTRY_AUTH_TOKEN` e `SENTRY_ORG` existem. Aí ele cria a release com o SHA, envia os maps e apaga `dist/**/*.map` depois do upload. Sem o token, o build avisa e termina.

No painel do projeto: Data Scrubber ligado, Scrub IP addresses ligado, e as mesmas regras de CPF/CNPJ/telefone/e-mail/placa no Advanced Data Scrubbing. Erro não é lugar de dado pessoal. Retenção é a do plano.

Alerta sugerido (não está neste PR): issue nova em `producao` com pelo menos 5 eventos em 1 h, ou fatal, abre GitHub Issue neste repositório com labels `bug` e `sentry`. O botão manual "Create GitHub issue" funciona em qualquer plano.

## Logs

Não há log de aplicação. Build e 404 da plataforma ficam na Vercel. Erro de browser, quando o DSN existe, fica no Sentry. Não há log de acesso HTTP no repositório.

## CI

`.github/workflows/ci.yml` roda em PR e no push do `master`. Um job `fast`: gitleaks só no intervalo de commits do PR ou do push, `npm ci` com cache, `npm run verify`. Osv-scanner só se o lockfile mudou. Zizmor só se `.github/` mudou. Concurrency cancela o run antigo do mesmo PR e não cancela o push do `master`.

O job `risk` (label e auto-merge) só existe se a variável de repositório `AUTO_MERGE` for `true`. Ela não está definida. Este PR não liga auto-merge.

## Dependência com aviso

`postcss-selector-parser` 6.x chega via `postcss-nested` do Starlight (GHSA-rj75-hqrm-r3gf, moderado, só no build). A correção é a linha 7, que quebra o range `^6` do `postcss-nested` 6.2.0. Está ignorada em `osv-scanner.toml` até 2027-01-10, à espera de um Starlight que já traga o parser corrigido. Não é dado de visitante.

## Labels

Os templates usam `bug` e `enhancement`, que já existem no repositório. Labels `feature`, `chore`, `seguranca`, `sentry` e `prioridade:*` ainda não foram criadas.
