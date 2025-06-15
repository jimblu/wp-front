<script lang="ts">
	import Maps from '$lib/components/Maps.svelte';
	import '../../style.css';

	export let data: { schools: any[] };
	const { schools } = data;
</script>

<main>
	<Maps {schools} />
</main>

<style>
</style>
