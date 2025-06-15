import { parse } from 'cookie';

const JSON_BASE = import.meta.env.VITE_WP_JSON_BASE; // ex. http://localhost:8000/wp-json
const API_BASE = import.meta.env.VITE_WP_API_BASE; // ex. http://localhost:8000/wp-json/wp/v2

function getToken(request?: Request | { headers: Headers }): string | null {
	const header = request ? (request as any).headers.get('cookie') || '' : document.cookie;
	const cookies = parse(header);
	return cookies.jwt || null;
}

export async function getSchools(fetch: typeof window.fetch) {
	const token = getToken();
	const res = await fetch(`${JSON_BASE}/school?_embed`, {
		headers: { Authorization: `Bearer ${token}` },
		credentials: 'include'
	});
	return res.json();
}

export async function postSchools(data: {
	teacher: string;
	city: string;
	school: string;
	lat?: number;
	lng?: number;
}) {
	const token = getToken();
	const res = await fetch('/api/schools', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		credentials: 'include',
		body: JSON.stringify(data)
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}
