// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async ({ fetch }) => {
// 	const url = `${import.meta.env.VITE_WP_API_BASE}/project&_embed`;
// 	const res = await fetch(url);

// 	if (!res.ok) {
// 		console.error('❌ WP REST API error', res.status, await res.text());
// 		return { projects: [] };
// 	}

// 	const projects = await res.json();
// 	return { projects };
// };
