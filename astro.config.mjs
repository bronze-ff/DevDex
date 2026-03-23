import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'DevDex',
      description: 'Base pessoal de conhecimento técnico',
      defaultLocale: 'pt-BR',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/seu-usuario/devdex' },
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
      ],
    }),
  ],
});
