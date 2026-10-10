import * as Sentry from '@sentry/astro';
import { createSentryOptions } from './src/lib/sentry-options';

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
	Sentry.init(createSentryOptions(dsn));
}
