import type { RequestHandler } from './$types';
import { serialize } from 'cookie';

export const POST: RequestHandler = async ({ request, fetch }) => {
	try {
		const { username, password } = await request.json();
		const base = import.meta.env.VITE_WP_JSON_BASE;
		if (!base) {
			throw new Error('VITE_WP_JSON_BASE is not defined in env');
		}

		const res = await fetch(`${base}/jwt-auth/v1/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		const json = await res.json();
		if (!res.ok) {
			return new Response(JSON.stringify(json), {
				status: res.status,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		const cookie = serialize('jwt', json.token, {
			path: '/',
			httpOnly: true,
			secure: import.meta.env.PROD,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24
		});
		return new Response(null, {
			status: 200,
			headers: { 'Set-Cookie': cookie }
		});
	} catch (err: any) {
		// log côté serveur
		console.error('[api/login] error:', err);
		// renvoie le message au client
		return new Response(JSON.stringify({ message: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
