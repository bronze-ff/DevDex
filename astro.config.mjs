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
          autogenerate: { directory: 'setup' },
        },
        {
          label: '⌨️ Terminal',
          collapsed: true,
          autogenerate: { directory: 'terminal' },
        },
        {
          label: '🤖 Claude Code',
          collapsed: true,
          autogenerate: { directory: 'claude-code' },
        },
        {
          label: '🧠 Agentes & Loops',
          collapsed: true,
          autogenerate: { directory: 'agentes' },
        },
        {
          label: '🌿 Git',
          collapsed: true,
          autogenerate: { directory: 'git' },
        },
        {
          label: '🐳 Docker',
          collapsed: true,
          autogenerate: { directory: 'docker' },
        },
        {
          label: '🔖 Sites Salvos',
          collapsed: true,
          autogenerate: { directory: 'sites' },
        },
      ],
    }),
  ],
});
