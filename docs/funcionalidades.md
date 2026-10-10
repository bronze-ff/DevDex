# Funcionalidades

DevDex é um site de documentação em português para consulta rápida. Não há conta, formulário de contato nem área logada. Tudo abaixo é página estática, com busca no browser (Pagefind) e alguns scripts locais.

## Home (`/`)

Splash com atalhos para Máquina Nova e Claude Code, e cards para as seções. O componente `TermPlay` anima um terminal de exemplo (não executa comando).

## Máquina Nova (`/setup/`)

- Visão geral com checklist no browser (o estado fica no `localStorage` deste computador, chave `ddx-check:`) e o gerador de `setup.ps1`.
- O gerador (`SetupGenerator`) marca ferramentas winget (Git, Node, Python, uv, VS Code, Terminal, Nushell, Starship, Zoxide, GitHub CLI, PowerShell 7, Docker, PowerToys) e copia o script. O script não roda no site.
- `/setup/runtimes/` — Node, Python e gerenciadores.
- `/setup/git-config/` — Git e SSH.
- `/setup/codex/` — Codex CLI no WSL.
- `/setup/vscode/` — settings e extensões. O JSON em `public/vscode-settings.json` é arquivo para baixar, não config deste repositório.

## Terminal (`/terminal/`)

Visão geral e `/terminal/nushell/` (Nushell, Starship, Zoxide no Windows).

## Claude Code (`/claude-code/`)

Comandos, pasta `.claude`, setup de projeto novo, prompt, skills, MCP, cowork, rotinas, dicas e melhores práticas. São guias. Eles descrevem `CLAUDE.md` e fluxos de outros projetos; o fluxo deste repositório está em `AGENTS.md` e `docs/workflow.md`.

## Agentes e loops (`/agentes/`)

Loops, agentes autônomos e Hermes Agent.

## Git (`/git/`)

Visão geral, comandos e fluxos.

## Docker (`/docker/`)

Visão geral, instalação e comandos.

## Sites salvos (`/sites/`)

Links externos em cards, abertos em nova aba (`noopener noreferrer`).

## Em toda página de artigo

- Título com botão "Copiar artigo" (`PageTitle`), que copia o texto do markdown. Em troca de página o Starlight usa view transitions; o botão se religa em `astro:page-load`.
- Busca (Pagefind), "editar esta página" no GitHub (`master`) e data de atualização.
- Sidebar fixa em `astro.config.mjs`.
- Tema escuro índigo, fonte Departure Mono nos títulos e Inter / JetBrains Mono via Google Fonts.
