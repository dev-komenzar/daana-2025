<script lang="ts">
	import Staff01 from '$lib/assets/staff-01.png';
	import Staff02 from '$lib/assets/staff-02.png';
	import MemberCard from '$lib/components/ui/member-card.svelte';
	import Modal from '$lib/components/ui/modal.svelte';


	type Member = {
		description: string;
		imageUrl?: string;
		name: string;
		position: string;
		variant: "primary" | "secondary";
	};

	const members: Member[] = [
		{
			description: "協会の代表。仏教の現代的な解釈と実践を追求しています。",
			imageUrl: Staff01,
			name: "山田 太郎",
			position: "代表理事",
			variant: "primary",
		},
		{
			description: "イベント企画やコミュニティ運営を担当しています。",
			imageUrl: Staff02,
			name: "鈴木 花子",
			position: "理事",
			variant: "secondary"
		},
		{
			description: "イベント企画やコミュニティ運営を担当しています。",
			name: "田中 健太",
			position: "理事",
			variant: "primary",
		},
		{
			description: '毎日野菜を作っています。',
			name: "佐藤 洋子",
			position: "理事",
			variant: "secondary",
		}
	];

	let modalState = $state<boolean[]>([false, false, false, false]);
</script>

<div class="members-grid">
	{#each members as member, index (member.name)}
		<button
			class='modal-button'
			onclick={() => {
				modalState[index] = true
			}}>
			<MemberCard
				label={member.name}
				position={member.position}
				src={member.imageUrl}
				variant={member.variant}
			/>
		</button>
		<Modal bind:open={modalState[index]}>
			<p>{member.description}</p>
		</Modal>
	{/each}
</div>

<style>
	.members-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		justify-items: center;
		margin-top: 1.5rem;
	}

	@media (width >= 768px) {
		.members-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.modal-button {
		width: 100%;
		aspect-ratio: 1 / 1;
	}
</style>
