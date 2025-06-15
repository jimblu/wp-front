<script lang="ts">
	// jaune => #f8e774
	// vert => #5caf96
	// vert clair => #bdd9bc
	// vert foncé => #244c49
	import '../style.css';
	import { onMount } from 'svelte';
	import SignIn from '$lib/components/SignIn.svelte';
	import gsap from 'gsap';
	import { DrawSVGPlugin } from 'gsap/dist/DrawSVGPlugin';
	import { goto } from '$app/navigation';

	let svgContainer: HTMLDivElement;
	let dialogLogin: HTMLDialogElement;
	let dialogNew: HTMLDialogElement;

	let username = '',
		password = '';

	$: isFormValid = username.trim().length > 0 && password.trim().length > 0;

	async function submit() {
		if (!isFormValid) return;
		const res = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ username, password })
		});
		if (res.ok) {
			goto('/map');
		} else {
			const e = await res.json();
			alert(e.code);
		}
	}

	onMount(() => {
		gsap.registerPlugin(DrawSVGPlugin);
		fetch('/capeco-header.svg')
			.then((r) => r.text())
			.then((str) => {
				svgContainer.innerHTML = str;
				const paths = gsap.utils.toArray('#cap-svg svg path');
				const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } });
				tl.set(paths, { drawSVG: '0%' });

				tl.to(paths, {
					duration: 2,
					drawSVG: '100%',
					stagger: {
						each: 0.0005,
						from: 'random'
					}
				});

				tl.to(
					'.cap-png',
					{
						duration: 5,
						opacity: 1,
						ease: 'power1.out'
					},
					'-=1.1'
				).call(
					() => {
						// console.log('Déclenché juste avant la fin');
						dialogLogin?.showModal();
					},
					undefined,
					4
				);
			});
	});
</script>

<dialog bind:this={dialogLogin} id="my_modal_1" class="modal">
	<div class="modal-box">
		<form class="form-login" novalidate on:submit|preventDefault={submit}>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Username</legend>
				<input
					type="text"
					class="input validator"
					placeholder="Profdu38"
					bind:value={username}
					required
				/>
				<div class="validator-hint">Enter valid username</div>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Password</legend>
				<input
					type="password"
					class="input validator"
					placeholder="*********"
					bind:value={password}
					required
				/>
				<div class="validator-hint">Enter valid password</div>
			</fieldset>
			<button class="btn btn-log mb-1" type="submit">Log in</button>
		</form>
		<button class="new btn btn-link" on:click={() => dialogNew?.open()}>New ?</button>
	</div>
</dialog>

<SignIn bind:this={dialogNew} />

<div class="anim_block">
	<div bind:this={svgContainer} id="cap-svg"></div>
	<img alt="cap" class="cap-png" src="/capeco-header.jpg" />
</div>

<style>
	#my_modal_1 > .modal-box {
		display: flex;
		flex-direction: column;
		align-items: end;
	}
	.form-login {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: 10px;
	}
	.fieldset {
		width: 100%;
	}
	.new {
		height: auto;
		padding: 0;
	}
	@media (max-width: 455px) {
		.form-login {
			flex-direction: column;
			gap: 0;
		}
		.btn-log {
			width: 100%;
		}
	}
	:root:has(:is(.modal-open, .modal:target, .modal-toggle:checked + .modal, .modal[open])) {
		scrollbar-gutter: auto !important;
	}
	:global(body) {
		margin: 0;
		height: 100vh;
	}
	.anim_block {
		position: absolute;
		width: 100%;
		height: 100%;

		overflow: hidden;
	}
	#cap-svg,
	.cap-png {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	#cap-svg {
		/* max-width: 1440px;
		width: 100%; */

		width: 100%;
		min-width: 1200px;
		height: auto;
	}
	.cap-png {
		opacity: 0.1;

		width: 100%;
		min-width: 1200px;
		height: auto;
	}
</style>
