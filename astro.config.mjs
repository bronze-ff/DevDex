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
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bronze-ff/DevDex' },
      ],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      pagefind: true,
      sidebar: [
        {
          label: 'Claude Code',
          collapsed: true,
          autogenerate: { directory: 'claude-code' },
        },
        {
          label: 'Git',
          collapsed: true,
          autogenerate: { directory: 'git' },
        },
        {
          label: 'Terminal',
          collapsed: true,
          autogenerate: { directory: 'terminal' },
        },
        {
          label: 'Python',
          collapsed: true,
          autogenerate: { directory: 'python' },
        },
        {
          label: 'JavaScript',
          collapsed: true,
          autogenerate: { directory: 'javascript' },
        },
        {
          label: 'Docker',
          collapsed: true,
          autogenerate: { directory: 'docker' },
        },
        {
          label: 'Sites Salvos',
          collapsed: true,
          autogenerate: { directory: 'sites' },
        },
        {
          label: 'Setup',
          collapsed: true,
          autogenerate: { directory: 'setup' },
        },
      ],
    }),
  ],
});
