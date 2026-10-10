import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import { unified } from '@astrojs/markdown-remark';
import sentry from '@sentry/astro';
import { loadEnv } from 'vite';

const fileEnv = loadEnv(
  process.env.NODE_ENV === 'production' ? 'production' : 'development',
  process.cwd(),
  '',
);
const env = (name) => process.env[name] || fileEnv[name] || '';

const sentryAuthToken = env('SENTRY_AUTH_TOKEN');
const sentryOrg = env('SENTRY_ORG');
const sentryProject = env('SENTRY_PROJECT') || 'devdex';
const uploadSourceMaps = Boolean(sentryAuthToken && sentryOrg);
const vercelEnv = env('VERCEL_ENV');
const appEnvironment =
  vercelEnv === 'production' || vercelEnv === 'preview' || vercelEnv === 'development'
    ? vercelEnv
    : process.env.NODE_ENV === 'production'
      ? 'production'
      : 'development';
const sentryEnvironment =
  appEnvironment === 'production' ? 'producao' : appEnvironment === 'preview' ? 'homologacao' : 'dev';
const release = env('VERCEL_GIT_COMMIT_SHA') || env('GITHUB_SHA');

export default defineConfig({
  site: 'https://dev-dex-one.vercel.app',
  vite: {
    define: {
      __DEVDEX_ENVIRONMENT__: JSON.stringify(appEnvironment),
      __DEVDEX_SENTRY_ENVIRONMENT__: JSON.stringify(sentryEnvironment),
      __DEVDEX_RELEASE__: JSON.stringify(release),
    },
  },
  markdown: {
    processor: unified({
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
  },
  integrations: [
    sentry({
      enabled: Boolean(env('PUBLIC_SENTRY_DSN')),
      telemetry: false,
      ...(uploadSourceMaps
        ? { org: sentryOrg, project: sentryProject, authToken: sentryAuthToken }
        : {
            errorHandler(error) {
              console.warn(`[sentry] source maps não enviados: ${error.message}`);
            },
          }),
      sourcemaps: {
        disable: !uploadSourceMaps,
        ...(uploadSourceMaps ? { filesToDeleteAfterUpload: ['./dist/**/*.map'] } : {}),
      },
      release: {
        create: uploadSourceMaps,
        finalize: uploadSourceMaps,
        setCommits: uploadSourceMaps ? { auto: true } : false,
        inject: Boolean(release),
        ...(release ? { name: release } : {}),
      },
    }),
    starlight({
      title: 'DevDex',
      description: 'Base pessoal de conhecimento técnico',
      locales: {
        root: { label: 'Português', lang: 'pt-BR' },
      },
      customCss: ['./src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bronze-ff/DevDex' },
      ],
      components: {
        PageTitle: './src/components/PageTitle.astro',
        Head: './src/components/Head.astro',
      },
      pagefind: true,
      editLink: { baseUrl: 'https://github.com/bronze-ff/DevDex/edit/master/' },
      lastUpdated: true,
      head: [
        { tag: 'script', attrs: { src: '/scripts/devdex.js', defer: true } },
      ],
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
