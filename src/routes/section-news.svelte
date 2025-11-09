<script lang="ts">
	import { getNewsRemote } from "$lib/news.remote";

	const query = getNewsRemote({
		fields: ["id", "title", "publishedAt"],
		limit: 3,
		offset: 0,
	});
</script>

<section id="news" class="container">
	<div class="wide-content">
		<div>
			<h2 class="text-large font-gothic-bold">News</h2>
			<p>Check it UP!</p>
			<svelte:boundary>
				{#if query.error}
					<p>記事が見つかりませんでした。</p>
				{:else if query.loading}
					<p>Loading...</p>
				{:else}
					{#each query.current as post (post.id)}
						<h3>{post.title}</h3>
					{/each}
				{/if}
			</svelte:boundary>
		</div>
	</div>
</section>
