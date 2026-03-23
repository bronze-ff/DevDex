# DevDex

Base pessoal de conhecimento técnico — comandos, dicas e melhores práticas num só lugar.

**[dev-dex-one.vercel.app](https://dev-dex-one.vercel.app)**

## Sobre

DevDex é um site estático que funciona como índice de referências técnicas organizado por tecnologia. Feito para consulta rápida no dia a dia de desenvolvimento.

## Seções

| Seção | O que tem |
|---|---|
| **Claude Code** | CLAUDE.md, pasta `.claude`, comandos, MCP, prompt de setup, dicas e melhores práticas |
| **Git** | Comandos essenciais e fluxos de trabalho |
| **Python** | Referências e snippets |
| **Docker** | Imagens, containers e compose |
| **JavaScript** | ES2024+, async, módulos |
| **Terminal** | Shell, atalhos e produtividade |
| **Sites Salvos** | Links e ferramentas úteis curados por categoria |
| **Setup** | Plugins, skills e CLIs para configurar máquina nova |

## Stack

- [Astro](https://astro.build) — framework de sites estáticos
- [Starlight](https://starlight.astro.build) — tema de documentação do Astro
- [rehype-external-links](https://github.com/rehypejs/rehype-external-links) — links externos abrem em nova aba com `noopener noreferrer`
- [Vercel](https://vercel.com) — deploy e hosting

## Estrutura

```
src/
├── content/docs/       # conteúdo em .mdx, uma pasta por seção
│   ├── claude-code/
│   ├── git/
│   ├── python/
│   ├── docker/
│   ├── javascript/
│   ├── terminal/
│   ├── sites/
│   ├── setup/
│   └── index.mdx       # homepage
├── components/          # overrides de componentes Starlight
astro.config.mjs         # sidebar, plugins e configuração geral
```

Para adicionar conteúdo: criar arquivo `.mdx` na pasta da seção correspondente. O sidebar é gerado automaticamente.

## Como rodar

```bash
npm install       # instala dependências
npm run dev       # servidor local em localhost:4321
npm run build     # build de produção (pasta dist/)
npm run preview   # preview do build local
```

## License

Uso pessoal.
