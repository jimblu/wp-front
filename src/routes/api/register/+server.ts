import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const { username, email, password } = await request.json();

	const res = await fetch(`${import.meta.env.VITE_WP_JSON_BASE}/custom/v1/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email, password })
	});
	const data = await res.json();

	return new Response(JSON.stringify(data), {
		status: res.status,
		headers: { 'Content-Type': 'application/json' }
	});
};
