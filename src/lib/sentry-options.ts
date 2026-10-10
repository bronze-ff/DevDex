import { scrubBreadcrumb, scrubSentryEvent } from './privacy-scrub';

/**
 * Opções de runtime do Sentry. O SDK 11 trocou `sendDefaultPii` por
 * `dataCollection`; os dois ficam desligados. Sem DSN, o caller não chama init.
 */
export function createSentryOptions(dsn: string) {
	const release = __DEVDEX_RELEASE__;
	return {
		dsn,
		sendDefaultPii: false,
		environment: __DEVDEX_SENTRY_ENVIRONMENT__,
		...(release ? { release } : {}),
		sampleRate: 1,
		tracesSampleRate: 0.1,
		dataCollection: {
			userInfo: false,
			cookies: false,
			httpHeaders: false,
			httpBodies: [],
			urlQueryParams: false,
		},
		ignoreErrors: [
			'ResizeObserver loop limit exceeded',
			'ResizeObserver loop completed with undelivered notifications.',
			/^Script error\.?$/,
			/chrome-extension:\/\//,
			/moz-extension:\/\//,
		],
		beforeSend: scrubSentryEvent,
		beforeBreadcrumb: scrubBreadcrumb,
	};
}
