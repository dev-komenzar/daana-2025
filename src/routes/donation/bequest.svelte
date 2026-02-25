<script lang="ts">
import Bequest from '$lib/assets/donation/bequest-c.jpg'
import Inquiry from '$lib/assets/donation/inquiry.png'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'

const FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSf0uGXb31O_6tEKFbGLrcqyE6cODMMKL1clXQarhLaV0Yel9w/viewform?usp=dialog'
</script>

<h3>遺贈寄付など</h3>

<div class="wrapper">
	<div class="image-wrapper">
		<EnhancedImage
			src={Bequest}
			alt="遺贈寄付"
		/>
	</div>
	<div class="description">
		<p>使用されていない土地建物や、ご遺産などをお託しくださいませんか？</p>
		<p>皆様から託された力は「仏教哲学に基づくひとづくり」の中に、永遠に力を発揮します。</p>

		<a
			class="inquiry"
			href={FORM_LINK}
			target="_blank"
			rel="noopener noreferrer"
		>
			<EnhancedImage
				src={Inquiry}
				alt="お問合せ"
			/>
		</a>
	</div>
</div>

<style>
h3 {
	font-family: var(--font-heading-bold);
	font-size: 24px;
	line-height: 30px;
	letter-spacing: 0.08em;
}
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	column-gap: 45px;
	width: 100%;
	padding: 40px 4%;
}

.image-wrapper {
	width: 100%;
	height: auto;
}

.description {
	width: 100%;
	text-align: left;

	font-family: var(--font-body);
	font-size: 14px;
	line-height: 30px;
	letter-spacing: 0.08em;
}

.image-wrapper + .description {
	margin-top: 44px;
}

.inquiry {
	display: block;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4));
}

p + .inquiry {
	margin-top: 44px;
}

@media screen and (width >= 1024px) {
	.wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		column-gap: 45px;
		width: 100%;
		padding: 40px 45px;
	}

	.image-wrapper {
		width: 306px;
		height: 197px;
	}

	.description {
		width: 40%;
	}

	.image-wrapper + .description {
		margin-top: 0;
	}
}
</style>
