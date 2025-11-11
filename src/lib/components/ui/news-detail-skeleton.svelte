<article class="container">
	<div class="content">
		<header class="article-header">
			<div class="skeleton skeleton-date"></div>
			<div class="skeleton skeleton-title"></div>
			<div class="skeleton skeleton-title-second"></div>
		</header>

		<div class="thumbnail">
			<div class="skeleton skeleton-thumbnail"></div>
		</div>

		<div class="article-content">
			<div class="skeleton skeleton-paragraph"></div>
			<div class="skeleton skeleton-paragraph"></div>
			<div class="skeleton skeleton-paragraph-short"></div>
			<div class="skeleton skeleton-paragraph"></div>
			<div class="skeleton skeleton-paragraph"></div>
			<div class="skeleton skeleton-paragraph-short"></div>
		</div>
	</div>
</article>

<style>
	.content {
		padding: 2rem 1rem;
	}

	.article-header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		margin-bottom: 2rem;
		text-align: center;
	}

	.thumbnail {
		margin: 2rem 0;
		overflow: hidden;
		border-radius: 8px;
	}

	.article-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 2rem 0;
	}

	.skeleton {
		background: linear-gradient(
			90deg,
			#f0f0f0 0%,
			#e0e0e0 20%,
			#f0f0f0 40%,
			#f0f0f0 100%
		);
		background-size: 200% 100%;
		border-radius: 4px;
		animation: shimmer 1.5s infinite linear;
	}

	.skeleton-date {
		width: 150px;
		height: 14px;
	}

	.skeleton-title {
		width: 80%;
		height: 28px;
	}

	.skeleton-title-second {
		width: 60%;
		height: 28px;
	}

	.skeleton-thumbnail {
		width: 100%;
		height: 300px;
		border-radius: 8px;
	}

	.skeleton-paragraph {
		width: 100%;
		height: 16px;
	}

	.skeleton-paragraph-short {
		width: 70%;
		height: 16px;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}

		100% {
			background-position: -200% 0;
		}
	}

	@media (width >= 768px) {
		.content {
			padding: 3rem 2rem;
		}

		.skeleton-title {
			height: 36px;
		}

		.skeleton-title-second {
			height: 36px;
		}

		.skeleton-date {
			height: 16px;
		}

		.skeleton-thumbnail {
			height: 400px;
		}

		.skeleton-paragraph {
			height: 18px;
		}

		.skeleton-paragraph-short {
			height: 18px;
		}
	}
</style>
