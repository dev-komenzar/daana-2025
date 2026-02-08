<section class="interview-page">
	<h1>インタビュー</h1>
	<p class="preparing">準備中</p>
</section>

<style>
	.interview-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		padding: 48px 24px;
		text-align: center;
	}

	h1 {
		margin-bottom: 24px;
		font-family: 'Noto Sans JP Medium', sans-serif;
		font-size: 24px;
	}

	.preparing {
		font-family: 'Noto Sans JP Light', sans-serif;
		font-size: 16px;
		color: #666;
	}

	@media screen and (width >= 768px) {
		.interview-page {
			padding: 80px 48px;
		}

		h1 {
			font-size: 32px;
		}

		.preparing {
			font-size: 18px;
		}
	}
</style>
