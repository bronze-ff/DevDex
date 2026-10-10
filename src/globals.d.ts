/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SENTRY_DSN?: string;
	readonly PUBLIC_POSTHOG_KEY?: string;
	readonly PUBLIC_POSTHOG_HOST?: string;
}

declare const __DEVDEX_ENVIRONMENT__: 'production' | 'preview' | 'development';
declare const __DEVDEX_SENTRY_ENVIRONMENT__: 'producao' | 'homologacao' | 'dev';
declare const __DEVDEX_RELEASE__: string;
