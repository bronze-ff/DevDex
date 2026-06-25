import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://dev-dex-one.vercel.app',
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  integrations: [
    starlight({
      title: 'DevDex',
      description: 'Base pessoal de conhecimento técnico',
      defaultLocale: 'pt-BR',
      customCss: ['./src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bronze-ff/DevDex' },
      ],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      pagefind: true,
      editLink: { baseUrl: 'https://github.com/bronze-ff/DevDex/edit/master/' },
      lastUpdated: true,
      sidebar: [
        {
          label: '🖥️ Máquina Nova',
          collapsed: false,
          items: [
            { label: 'Visão geral', link: '/setup/' },
            { label: 'Runtimes & gerenciadores', link: '/setup/runtimes/' },
            { label: 'Git: config & SSH', link: '/setup/git-config/' },
            { label: 'Codex CLI (WSL + Node)', link: '/setup/codex/' },
            { label: 'VS Code: settings & extensões', link: '/setup/vscode/' },
          ],
        },
        {
          label: '⌨️ Terminal',
          collapsed: true,
          items: [
            { label: 'Visão geral', link: '/terminal/' },
            { label: 'Nushell + Starship + Zoxide', link: '/terminal/nushell/' },
          ],
        },
        {
          label: '🤖 Claude Code',
          collapsed: true,
          items: [
            { label: 'Visão geral', link: '/claude-code/' },
            { label: 'Comandos', link: '/claude-code/comandos/' },
            { label: 'A pasta .claude', link: '/claude-code/pasta-claude/' },
            { label: 'Setup de novo projeto', link: '/claude-code/setup-novo-projeto/' },
            { label: 'Prompt — novo projeto', link: '/claude-code/prompt-novo-projeto/' },
            { label: 'Criar skills', link: '/claude-code/criar-skills/' },
            { label: 'MCP', link: '/claude-code/mcp/' },
            { label: 'Modo Cowork', link: '/claude-code/cowork/' },
            { label: 'Rotinas & automação', link: '/claude-code/rotinas/' },
            { label: 'Dicas', link: '/claude-code/dicas/' },
            { label: 'Melhores práticas', link: '/claude-code/melhores-praticas/' },
          ],
        },
        {
          label: '🧠 Agentes & Loops',
          collapsed: true,
          items: [
            { label: 'Visão geral', link: '/agentes/' },
            { label: 'Loops & Loop Engineering', link: '/agentes/loops/' },
            { label: 'Agentes autônomos', link: '/agentes/autonomos/' },
            { label: 'Hermes Agent', link: '/agentes/hermes/' },
          ],
        },
        {
          label: '🌿 Git',
          collapsed: true,
          items: [
            { label: 'Visão geral', link: '/git/' },
            { label: 'Comandos', link: '/git/comandos/' },
            { label: 'Fluxos', link: '/git/fluxos/' },
          ],
        },
        {
          label: '🐳 Docker',
          collapsed: true,
          items: [
            { label: 'Visão geral', link: '/docker/' },
            { label: 'Instalação', link: '/docker/install/' },
            { label: 'Comandos', link: '/docker/comandos/' },
          ],
        },
        { label: '🔖 Sites Salvos', link: '/sites/' },
      ],
    }),
  ],
});
