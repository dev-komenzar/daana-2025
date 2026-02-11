<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/assets/footer/donation-button.png';
	import JbaLogo from '$lib/assets/jba-black.png';
	import EnhancedImage from '$lib/components/ui/enhanced-image.svelte';
	import HorizontalDivider from '$lib/components/ui/horizontal-divider.svelte';
</script>

<footer class="footer">
	<!-- SectionDonation -->
	<section id="donation" class="donation-section">
		<div class="donation-content">
			<p class="donation-text">
				「寄付」というアクションを
				<br />
				あなたの力が我々の動力です
			</p>
		</div>
		<a href={resolve('/donation')} class="donation-link">
			<EnhancedImage src={Button} alt="寄付ボタン" class="donation-button" />
		</a>
	</section>

	<!-- Footer Info -->
	<HorizontalDivider color="rgba(255, 255, 255, 0.2)" />
	<div class="footer-info">
		<div class="footer-main">
			<div class="organization">
				<div class="logo-row">
					<EnhancedImage src={JbaLogo} alt="日本仏教徒協会" class="jba-logo" />
				</div>

				<div class="address-list">
					<div class="address-item">
						<p class="org-label">一般社団法人  日本仏教徒協会</p>
						<p class="address">
							〒602-0052<br />
							京都市上京区上小川町120-3
						</p>
					</div>
				</div>
			</div>

			<div class="contact-row">
				<a href="mailto:info@houdouji.inc" class="contact-link">
					<svg class="mail-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
						<path d="M2 7L12 13L22 7" stroke="currentColor" stroke-width="1.5"/>
					</svg>
					<span class="contact-label">Contact us</span>
					<span class="contact-email">@Houdouji.inc</span>
					<svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
						<path d="M10 8L14 12L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</a>
				<a href={resolve('/llm.txt')} class="llm-link">llm.txt</a>
			</div>
		</div>
	</div>
</footer>

<style>
	/* Mobile First - Default styles for mobile */
	.footer {
		width: 100%;
		margin-top: 150px;
		color: #fff;
		background: var(--color-primary);
	}

	/* Donation Section */
	.donation-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;
		padding-bottom: 110px;
	}

	.donation-content {
		text-align: center;
	}

	.donation-text {
		margin-bottom: 60px;
		font-family: var(--font-heading-bold);
		font-size: 20px;
		line-height: 40px;
		letter-spacing: 0.06em;
	}

	.donation-link {
		display: block;
		width: 80%;
	}

	:global(.donation-button) {
		width: 100%;
		height: auto;
	}

	/* Footer Info */
	.footer-main {
		padding: 48px 24px;
	}

	.organization {
		display: flex;
		flex-direction: column;
	}

	.logo-row {
		width: 302px;
		max-width: 100%;
		height: 80px;
		margin-bottom: 24px;
	}

	:global(.jba-logo) {
		height: auto;
		filter: invert(1);
	}

	.address-list {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.address-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.org-label {
		font-family: var(--font-body);
		font-size: 14px;
	}

	.address {
		font-family: var(--font-body);
		font-size: 14px;
		line-height: 1.6;
	}

	/* Contact Row */
	.contact-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 32px;
	}

	.contact-link {
		display: flex;
		gap: 12px;
		align-items: center;
		font-family: var(--font-heading);
		font-size: 12px;
		color: #fff;
		text-decoration: none;
	}

	.contact-link:hover {
		opacity: 0.8;
	}

	.mail-icon,
	.arrow-icon {
		width: 24px;
		height: 24px;
	}

	.contact-label {
		font-weight: 500;
	}

	.contact-email {
		color: rgb(255 255 255 / 70%);
	}

	.llm-link {
		font-family: var(--font-heading);
		font-size: 12px;
		color: rgb(255 255 255 / 50%);
		text-decoration: none;
	}

	.llm-link:hover {
		color: rgb(255 255 255 / 80%);
	}

	/* Tablet and above */
	@media screen and (width >= 768px) {
		.footer {
			margin-top: 200px;
		}

		.donation-section {
			padding-top: 300px;
			padding-bottom: 220px;
		}

		.donation-text {
			font-size: 26px;
			line-height: 55px;
		}

		.donation-link {
			width: auto;
		}

		:global(.donation-button) {
			width: 480px;
		}

		.footer-main {
			padding: 96px 85px 95px;
		}

		.logo-row {
			margin-bottom: 40px;
		}

		.contact-row {
			margin-top: 48px;
		}

		.contact-link {
			font-size: 14px;
		}
	}
</style>
