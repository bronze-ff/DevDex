import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scrubValue } from './privacy-scrub.ts';

const CPF = '390.533.447-05';
const EMAIL = 'pessoa@example.com';

function nested(levels: number, leaf: unknown): unknown {
	let current = leaf;
	for (let i = 0; i < levels; i += 1) current = { child: current };
	return current;
}

function leafAt(value: unknown, levels: number): unknown {
	let current = value;
	for (let i = 0; i < levels; i += 1) {
		assert.equal(typeof current, 'object');
		assert.ok(current);
		current = (current as { child: unknown }).child;
	}
	return current;
}

test('profundidade no limite vira placeholder e não devolve o objeto', () => {
	const secret = { note: `cpf ${CPF}`, token: 'sekret-token', email: EMAIL };
	const output = nested(8, secret);

	assert.equal(leafAt(scrubValue(output), 8), '[Truncated]');

	const serialized = JSON.stringify(scrubValue(output));
	assert.equal(serialized.includes(CPF), false);
	assert.equal(serialized.includes(EMAIL), false);
	assert.equal(serialized.includes('sekret-token'), false);
});

test('um nível antes do limite ainda sanitiza texto e chave sensível', () => {
	const secret = { note: `cpf ${CPF}`, token: 'sekret-token' };
	const scrubbed = leafAt(scrubValue(nested(7, secret)), 7) as { note: string; token: string };

	assert.equal(scrubbed.note, 'cpf [cpf]');
	assert.equal(scrubbed.token, '[redacted]');
});

test('ciclo e referência repetida viram placeholder', () => {
	const cycle: Record<string, unknown> = { note: `mail ${EMAIL}` };
	cycle.self = cycle;

	const scrubbedCycle = scrubValue(cycle) as { note: string; self: string };
	assert.equal(scrubbedCycle.self, '[Circular]');
	assert.equal(scrubbedCycle.note, 'mail [email]');

	const shared = { note: `cpf ${CPF}`, token: 'sekret-token' };
	const scrubbedShared = scrubValue({ a: shared, b: shared }) as {
		a: { note: string; token: string };
		b: string;
	};
	assert.equal(scrubbedShared.a.note, 'cpf [cpf]');
	assert.equal(scrubbedShared.a.token, '[redacted]');
	assert.equal(scrubbedShared.b, '[Circular]');

	const serialized = JSON.stringify({ scrubbedCycle, scrubbedShared });
	assert.equal(serialized.includes(CPF), false);
	assert.equal(serialized.includes(EMAIL), false);
	assert.equal(serialized.includes('sekret-token'), false);
});
