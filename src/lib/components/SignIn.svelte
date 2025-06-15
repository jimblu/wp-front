<script lang="ts">
	import '../../style.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export function open() {
		dialog.showModal();
	}

	let dialog: HTMLDialogElement;
	let username = '',
		email = '',
		password = '';

	$: isFormValid =
		username.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;

	async function submit() {
		const res = await fetch('/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password })
		});
		const json = await res.json();
		if (!res.ok) {
			alert(json.message);
		} else {
			dialog.close();
		}
	}
</script>

<dialog bind:this={dialog} id="dialog_sign_in" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<form
			class="form flex items-center space-x-4"
			novalidate
			on:submit|preventDefault={() => {
				if (!isFormValid) return;
				submit();
			}}
		>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Email</legend>
				<input
					type="text"
					class="input validator"
					placeholder="prof@ex.com"
					bind:value={email}
					required
				/>
				<div class="validator-hint">Enter valid email</div>
			</fieldset>
			<div class="log-container">
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
					<legend class="fieldset-legend">Passwoord</legend>
					<input
						type="text"
						class="input validator"
						placeholder="***********"
						bind:value={password}
						required
					/>
					<div class="validator-hint">Enter valid password</div>
				</fieldset>
			</div>
			<button class="btn btn-sign mb-1" type="submit">Sign in</button>
		</form>
	</div>
</dialog>

<style>
	:root:has(:is(.modal-open, .modal:target, .modal-toggle:checked + .modal, .modal[open])) {
		scrollbar-gutter: auto !important;
	}
	form {
		display: flex;
		flex-direction: column;
	}
	.log-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		gap: 10px;
		margin-right: 0;
	}
	fieldset {
		margin-right: 0;
	}
	fieldset,
	fieldset > input {
		width: 100%;
	}
	.btn-sign {
		width: 100%;
	}
	@media (max-width: 374px) {
		.log-container {
			flex-direction: column;
			gap: 0;
		}
	}
</style>
