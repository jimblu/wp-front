<script>
	import { onNavigate } from '$app/navigation';
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://maps.googleapis.com" />

	<link
		rel="preload"
		as="script"
		href="https://maps.googleapis.com/maps/api/js?key={import.meta.env
			.VITE_GMAPS_KEY}&libraries=marker&loading=async"
	/>
	<script
		src="https://maps.googleapis.com/maps/api/js?key={import.meta.env
			.VITE_GMAPS_KEY}&libraries=marker&loading=async"
		async
		defer
		onload={() => window.dispatchEvent(new Event('maps-loaded'))}
	></script>
</svelte:head>

<main>
	<slot />
</main>

<style>
	main {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	/* ==== ANIMATION TRANSITION  ==== */

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation:
			210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}

	/* ==== END ANIMATION TRANSITION  ==== */

	/* ==== INFOWINDOW MAPS  ==== */

	:global(.gm-infowindow) {
		font-family: 'Helvetica Neue', Arial, sans-serif;
		padding-right: 0.6rem;
		padding-bottom: 0.6rem;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
	}

	:global(.gm-school) {
		font-size: 0.95rem;
		font-weight: 500;
		color: #374151;
	}

	:global(.gm-city) {
		margin: 0.25rem 0 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: #6b7280;
	}

	/* ==== END INFOWINDOW MAPS  ==== */
</style>
