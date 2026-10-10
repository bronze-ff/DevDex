# DevDex — base pessoal de conhecimento técnico

Status: público · Stack: Astro 7 + Starlight · Dono: Filippe · Site: [dev-dex-one.vercel.app](https://dev-dex-one.vercel.app)

Índice de referências (comandos, setup e práticas) para consulta no dia a dia. Site estático, sem login.

## Como rodar (dev)

Na raiz, no PowerShell, com Node 22 (`>=22.12.0`, ver `.nvmrc`):

```powershell
npm install
npm run dev
```

Abre em `http://localhost:4321`.

Antes de abrir um PR:

```powershell
npm run verify
```

`verify` roda o typecheck (`astro check`) e o build de produção. Não há suíte de testes.

## Como publicar

O deploy é automático na Vercel a partir do `master`. Variáveis, rollback e observabilidade: [docs/operacao.md](docs/operacao.md).

## Estrutura

| Pasta | O que é |
|---|---|
| `src/content/docs/` | Páginas do site (`.mdx`) |
| `src/components/` | Overrides do Starlight e componentes da página |
| `public/` | Favicon, fonte e script do browser |
| `docs/` | Documentação do repositório (não aparece no site) |
| `astro.config.mjs` | Sidebar, Starlight e Sentry no build |

## Documentação

- [O que o site faz](docs/funcionalidades.md)
- [Arquitetura](docs/arquitetura.md)
- [Operação e variáveis](docs/operacao.md)
- [Fluxo de Git e PR](docs/workflow.md)
- [Decisões](docs/decisoes/0001-padronizacao-onda-1.md)

## Seções do site

| Seção | O que tem |
|---|---|
| Máquina Nova | Runtimes, Git/SSH, Codex CLI, VS Code e um gerador de script `winget` |
| Terminal | Nushell, Starship e Zoxide |
| Claude Code | Comandos, pasta `.claude`, MCP, skills, cowork e rotinas |
| Agentes & Loops | Loop engineering, agentes autônomos e Hermes |
| Git | Comandos e fluxos |
| Docker | Instalação e comandos |
| Sites Salvos | Links curados |

## License

Uso pessoal.
