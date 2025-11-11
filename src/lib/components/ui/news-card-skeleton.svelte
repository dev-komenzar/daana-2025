<div class="news-card-skeleton">
	<div class="skeleton-thumbnail"></div>
	<div class="skeleton-content">
		<div class="skeleton-date"></div>
		<div class="skeleton-title"></div>
		<div class="skeleton-title-second"></div>
	</div>
</div>

<style>
	.news-card-skeleton {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		pointer-events: none;
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
	}

	.skeleton-thumbnail {
		width: 100%;
		height: 200px;
		background: linear-gradient(
			90deg,
			#f0f0f0 0%,
			#e0e0e0 20%,
			#f0f0f0 40%,
			#f0f0f0 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite linear;
	}

	.skeleton-content {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 20px;
	}

	.skeleton-date {
		width: 100px;
		height: 14px;
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

	.skeleton-title {
		width: 100%;
		height: 20px;
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

	.skeleton-title-second {
		width: 80%;
		height: 20px;
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

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}

		100% {
			background-position: -200% 0;
		}
	}

	@media (width >= 768px) {
		.skeleton-thumbnail {
			height: 220px;
		}
	}
</style>
