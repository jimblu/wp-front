import type { RequestHandler } from './$types';
import { parse } from 'cookie';

const WP_BASE = import.meta.env.VITE_WP_API_BASE;

/**
 * Helper to extract JWT from cookie header
 */
function getToken(request: Request): string | null {
	const cookieHeader = request.headers.get('cookie') || '';
	const cookies = parse(cookieHeader);
	return cookies.jwt || null;
}

// GET /api/schools - Fetch schools, requires authentication
export const GET: RequestHandler = async ({ request, fetch }) => {
	const token = getToken(request);
	if (!token) {
		return new Response(JSON.stringify({ message: 'Not authenticated' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const res = await fetch(`${WP_BASE}/school?_embed`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const data = await res.json();

	return new Response(JSON.stringify(data), {
		status: res.status,
		headers: { 'Content-Type': 'application/json' }
	});
};

// POST /api/schools - Create a new school post in WordPress, requires authentication
export const POST: RequestHandler = async ({ request, fetch }) => {
	const token = getToken(request);
	if (!token) {
		return new Response(JSON.stringify({ message: 'Not authenticated' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { teacher, city, school, lat, lng } = await request.json();

	const res = await fetch(`${WP_BASE}/school`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			title: `Collège ${school}`,
			status: 'publish',
			fields: { teacher, city, school, lat, lng }
		})
	});

	// On parse toujours la réponse comme JSON
	const data = await res.json();

	if (!res.ok) {
		console.error('🔄 Response from WP:', res.status, data);
		return new Response(JSON.stringify(data), {
			status: res.status,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// On renvoie l'objet créé pour que le client puisse l'utiliser
	return new Response(JSON.stringify(data), {
		status: 201,
		headers: { 'Content-Type': 'application/json' }
	});
};
