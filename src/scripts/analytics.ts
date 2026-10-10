import type { PostHog } from 'posthog-js';

let started = false;

function trackPageviews(posthog: PostHog) {
	let lastUrl = '';
	const capture = () => {
		const url = `${location.pathname}${location.search}`;
		if (url === lastUrl) return;
		lastUrl = url;
		posthog.capture('$pageview');
	};

	capture();
	document.addEventListener('astro:page-load', capture);
}

/** Web analytics cookieless. Sem chave, não carrega o SDK e não chama identify. */
export function startAnalytics(): void {
	if (started) return;
	const key = import.meta.env.PUBLIC_POSTHOG_KEY;
	if (!key) return;
	started = true;

	void import('posthog-js').then(({ default: posthog }) => {
		const host = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
		posthog.init(key, {
			api_host: host,
			cookieless_mode: 'always',
			person_profiles: 'never',
			capture_pageview: false,
			capture_pageleave: true,
			autocapture: false,
			disable_session_recording: true,
			disable_surveys: true,
			disable_external_dependency_loading: true,
			advanced_disable_feature_flags: true,
			mask_all_text: true,
			mask_all_element_attributes: true,
		});
		posthog.register({
			app: 'devdex',
			environment: __DEVDEX_ENVIRONMENT__,
		});
		trackPageviews(posthog);
	});
}
