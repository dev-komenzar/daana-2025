<script lang="ts">
import { floatUp } from '$lib/actions'
import Link from '$lib/components/ui/link.svelte'

import WorksCreation from './works-creation.svelte'
import WorksOutreach from './works-outreach.svelte'

const FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSeybsspD3fochhGeqD4mQvkGNrdDcYXxBxw893GTe9WRjS4tQ/viewform?usp=publish-editor'
</script>

<section id="works">
	<div class="container">
		<div class="wide-content">
			<h2
				class="text-large heading"
				use:floatUp
			>
				WORKS
			</h2>

			<h3 use:floatUp>「創造」領域</h3>
			<p
				class="summary"
				use:floatUp
			>
				いまに使える「仏教の価値」を創造する
			</p>
			<p
				class="works-body"
				use:floatUp
			>
				<strong>当協会は、仏教哲学の探究と実践を通じ、現代社会に即した「仏教の価値」を創造しています。</strong>
			</p>
			<div class="works-table-wrapper">
				<table class="works-table">
					<tbody>
						<tr
							class="works-body"
							use:floatUp
						>
							<td><strong>「実験寺院」の運営</strong>：</td>
							<td>「社会的意義を果たす仏教の再導入」をテーマに、寺院の新たな在り方を検証する実験の場を運営しています。</td>
						</tr>
						<tr
							class="works-body"
							use:floatUp
						>
							<td><strong>「Philosophy Collectives Network」の研究</strong>：</td>
							<td>仏教哲学に基づく組織論を構築し、現代の組織運営に活かすための実践的研究を展開しています。</td>
						</tr>
						<tr
							class="works-body"
							use:floatUp
						>
							<td><strong>「即仏大学」の運営</strong>：</td>
							<td>実験寺院グループが提唱する「即の仏教（時代と状況に即した仏教）」を体系的に学ぶための教育プラットフォームです。</td>
						</tr>
						<tr
							class="works-body"
							use:floatUp
						>
							<td><strong>「DaNAs for Good」の開催</strong>：</td>
							<td>「即の仏教」を概念で終わらせず、体感として落とし込むためのリトリート（合宿）企画を運営しています。</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p
				class="works-body"
				use:floatUp
			>
				これらの活動を通じて「仏教の社会実装」を多角的に検証し、その知見を社会へ還元しています。
			</p>
		</div>

		<div class="full-content">
			<WorksCreation />
		</div>
	</div>

	<div class="container">
		<div class="wide-content">
			<h3 use:floatUp>「実装」領域</h3>
			<p
				class="summary"
				use:floatUp
			>
				社会に広く「仏教の価値」を実装する
			</p>
			<p
				class="works-body"
				use:floatUp
			>
				今、あらゆる分野で「仏教哲学」という知識体系の社会実装が求められています。
			</p>
			<p
				class="works-body"
				use:floatUp
			>
				「経済成長こそが善をもたらす」という神話が崩壊しつつある現代、仏教はあらゆる領域に指針を与える「実践的な智慧」として活用されるべきと考えます。
			</p>
			<p
				class="works-body"
				use:floatUp
			>
				当協会は、企業研修や経営者向けの「問答」によるコーチング、顧問契約、行政・学術機関との連携など、多様な領域で公益活動を行っています。
			</p>
			<!-- 例外スペーサー -->
			<div class="space"></div>
			<div use:floatUp>
				<Link
					href={FORM_LINK}
					textContent="CONTACT US"
					isExternal
				/>
			</div>
		</div>
	</div>
	<div class="container-bg-colored">
		<div class="full-content">
			<WorksOutreach />
		</div>
	</div>
</section>

<style>
.container {
	margin-top: 10rem;
}

.heading {
	font-family: var(--font-heading-bold);
	text-align: left;
}

h3 {
	padding-top: 57px;
	font-family: var(--font-body-bold);
	font-size: 30px;
	line-height: normal;
	letter-spacing: 0.06em;
}

.summary {
	font-family: var(--font-body-bold);
	font-size: 15px;
	line-height: normal;
	letter-spacing: 0.06em;
}

.works-body {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 24px;
	letter-spacing: 0.06em;
}

.works-body > strong {
	font-family: var(--font-body-bold);
}

.summary + .works-body {
	padding-top: 32px;
}

.works-table-wrapper {
	margin-block: 1rem;
	overflow-x: auto;
}

.works-table {
	border-collapse: collapse;
	border: none;
}

.works-table tr,
.works-table td {
	padding: 0;
	line-height: 1.5;
	vertical-align: top;
	border: none;
}

.works-table td:first-child {
	width: 200px;
	padding-left: 1em;
	text-indent: -1em;
}

.works-table td:last-child {
	min-width: 200px;
}

.works-table tr:not(:last-child) td {
	padding-bottom: 0.5rem;
}

div.space {
	height: 37px;
}

@media screen and (width >= 768px) {
	.container {
		margin-top: 300px;
	}
}
</style>
