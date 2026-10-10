const SENSITIVE_KEY = /senha|password|passwd|secret|token|authorization|cookie/i;

const REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
	[/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, '[cnpj]'],
	[/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[cpf]'],
	[/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email]'],
	[/(?:\+?55\s?)?\(?[1-9]{2}\)?\s?(?:9\d{4}|\d{4})-?\d{4}/g, '[telefone]'],
	[/\b[A-Z]{3}\d[A-Z]\d{2}\b/gi, '[placa]'],
	[/\b[A-Z]{3}-?\d{4}\b/gi, '[placa]'],
];

const MAX_DEPTH = 8;

export function scrubText(value: string): string {
	let text = value;
	for (const [pattern, replacement] of REPLACEMENTS) {
		text = text.replace(pattern, replacement);
	}
	return text;
}

export function scrubValue(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
	if (typeof value === 'string') return scrubText(value);
	if (value == null || typeof value !== 'object') return value;
	if (depth >= MAX_DEPTH) return '[Truncated]';
	if (seen.has(value)) return '[Circular]';
	seen.add(value);

	if (Array.isArray(value)) {
		return value.map((item) => scrubValue(item, depth + 1, seen));
	}

	const output: Record<string, unknown> = {};
	for (const [key, item] of Object.entries(value)) {
		output[key] = SENSITIVE_KEY.test(key) ? '[redacted]' : scrubValue(item, depth + 1, seen);
	}
	return output;
}

type SentryEventLike = {
	message?: string;
	exception?: {
		values?: Array<{
			value?: string;
			stacktrace?: { frames?: Array<{ filename?: string }> };
		}>;
	};
};

function eventText(event: SentryEventLike): string[] {
	const values = event.exception?.values ?? [];
	return [event.message ?? '', ...values.map((value) => value.value ?? '')];
}

function isExtensionNoise(event: SentryEventLike): boolean {
	const noisy = /^(Script error\.?)$|ResizeObserver loop|chrome-extension:|moz-extension:|safari-extension:/i;
	if (eventText(event).some((text) => noisy.test(text))) return true;
	const frames = (event.exception?.values ?? []).flatMap((value) => value.stacktrace?.frames ?? []);
	return frames.some((frame) => /^(chrome|moz|safari)-extension:/.test(frame.filename ?? ''));
}

export function scrubSentryEvent<T>(event: T): T | null {
	if (!event || typeof event !== 'object') return event;
	if (isExtensionNoise(event as SentryEventLike)) return null;
	return scrubValue(event) as T;
}

export function scrubBreadcrumb<T extends { category?: string }>(breadcrumb: T): T | null {
	if (breadcrumb.category === 'console') return null;
	return scrubValue(breadcrumb) as T;
}
