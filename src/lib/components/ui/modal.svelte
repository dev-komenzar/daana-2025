<script lang="ts">
	let { children, open = $bindable(false) } = $props();
	let dialog: HTMLDialogElement;

	$effect(() => {
		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});

	const preventEsc = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			event.preventDefault();
		}
	};
</script>

<dialog 
	bind:this={dialog} 
	class="modal-overlay"
	onclick={
		(event) => {
			if (event.target === dialog) {
				open = false;
			}
		}
	}
	onkeydown={preventEsc}
>
	<div class="modal-content" >
		{@render children()  }
		<button onclick={() => (open = false)} class="modal-close-button">
			Close
		</button>
	</div>
</dialog>

<style>
	dialog {
		padding: 0;
		border: var(--color-secondary) 1px solid;
		border-radius: 8px
	}

	.modal-content {
		padding: 16px;
	}
</style>