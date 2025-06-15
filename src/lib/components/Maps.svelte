<script lang="ts">
	import '../../style.css';
	import { onMount } from 'svelte';
	import { loadGoogleMaps, initializeMap, postSchools, addSchool } from '$lib';

	export let schools: {
		acf: { teacher: string; city: string; school: string };
	}[] = [];

	let map: google.maps.Map;
	let mapContainer!: HTMLDivElement;
	let form: HTMLFormElement;

	let teacher = '';
	let school = '';
	let city = '';

	$: isFormValid = teacher.trim().length > 0 && city.trim().length > 0 && school.trim().length > 0;

	onMount(async () => {
		await loadGoogleMaps();
		map = initializeMap(mapContainer);
		for (const s of schools) {
			const { school, teacher, city } = s.acf;
			if (school != null && city != null && city) {
				await addSchool(map, school, city, teacher);
			}
		}
	});
</script>

<!-- Carte -->
<div bind:this={mapContainer} class="map"></div>
<img class="cap-header-png" alt="capeco-logo" src="/capeco-img.svg" />

<!-- Formulaire -->
<form
	bind:this={form}
	class="form flex items-center space-x-4"
	novalidate
	on:submit|preventDefault={() => {
		if (!isFormValid) return;
		postSchools({ teacher, city, school });
		addSchool(map, school, city, teacher);
		form.reset();
	}}
>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Teacher</legend>
		<input
			type="text"
			class="input validator"
			placeholder="M. Julien Coulon"
			bind:value={teacher}
			required
		/>
		<div class="validator-hint">Enter valid teacher name</div>
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">City</legend>
		<input type="text" class="input validator" placeholder="Créteil" bind:value={city} required />
		<div class="validator-hint">Enter valid city name</div>
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">School</legend>
		<input
			type="text"
			class="input validator"
			placeholder="Albert Schweitzer"
			bind:value={school}
			required
		/>
		<div class="validator-hint">Enter valid school name</div>
	</fieldset>
	<button class="btn mb-1" type="submit">Add</button>
</form>

<style>
	:root:has(:is(.modal-open, .modal:target, .modal-toggle:checked + .modal, .modal[open])) {
		scrollbar-gutter: auto !important;
	}
	form {
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 10px;
	}
	.map {
		position: absolute;
		width: 100%;
		height: 100vh;
		margin-bottom: 1rem;
	}
	form input {
		padding: 0.5rem;
		margin-right: 0.5rem;
	}
	form button {
		padding: 0.5rem 1rem;
	}

	@media (max-width: 720px) {
		form {
			display: flex;
			flex-direction: column;
		}
	}

	/* Conteneur de l’InfoWindow */
	:global(.gm-infowindow) {
		font-family: 'Helvetica Neue', Arial, sans-serif;
		/* background: #fff; */
		/* padding: 0.6rem 0.8rem; */
		padding-right: 0.6rem;
		padding-bottom: 0.6rem;
		/* border-radius: 8px; */
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
		/* max-width: 240px; */
	}

	:global(.gm-school) {
		/* margin: 0.25rem 0 0; */
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
	.cap-header-png {
		position: absolute;
		top: 0;
		left: 0;
		width: 300px;
	}
</style>
