import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	// Récupère le token JWT depuis le cookie HTTP-only
	const cookieHeader = event.request.headers.get('cookie') || '';
	const cookies = parse(cookieHeader);
	const token = cookies.jwt;

	if (token) {
		try {
			// Valide le token auprès de WordPress via l'endpoint JWT
			const res = await event.fetch(
				`${import.meta.env.VITE_WP_JSON_BASE}/jwt-auth/v1/token/validate`,
				{
					method: 'POST',
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			if (res.ok) {
				// Stocke les infos utilisateur pour les loaders
				event.locals.user = await res.json();
			}
		} catch (err) {
			console.error('[hooks] JWT validation error:', err);
		}
	}

	// Poursuit la chaîne de traitement des requêtes
	return resolve(event);
};
