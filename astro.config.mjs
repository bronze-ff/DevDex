import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
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
      sidebar: [
        { label: 'Claude Code', autogenerate: { directory: 'claude-code' } },
        { label: 'Git', autogenerate: { directory: 'git' } },
        { label: 'Python', autogenerate: { directory: 'python' } },
        { label: 'Docker', autogenerate: { directory: 'docker' } },
        { label: 'JavaScript', autogenerate: { directory: 'javascript' } },
        { label: 'Terminal', autogenerate: { directory: 'terminal' } },
        { label: 'Sites Salvos', autogenerate: { directory: 'sites' } },
        { label: 'Setup', autogenerate: { directory: 'setup' } },
      ],
    }),
  ],
});
