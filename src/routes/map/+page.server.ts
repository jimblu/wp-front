import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}
	const res = await fetch('/api/schools');
	if (!res.ok) throw new Error('WP fetch failed');
	const schools = await res.json();
	return { schools };
};
