<script lang="ts">
import type { ProjectItem } from '$lib/projects'

import { getProjectsPrerender } from '$lib/projects/projects.remote'

const projectsPromise = getProjectsPrerender()

function groupProjectsByType(projects: ProjectItem[]) {
	const hitoProjects: ProjectItem[] = []
	const monoProjects: ProjectItem[] = []
	const otherProjects: ProjectItem[] = []

	for (const project of projects) {
		if (project.type?.includes('hito')) {
			hitoProjects.push(project)
		} else if (project.type?.includes('mono')) {
			monoProjects.push(project)
		} else {
			otherProjects.push(project)
		}
	}

	return { hitoProjects, monoProjects, otherProjects }
}
</script>

<h3>プロジェクトへのご寄付</h3>
<p>特定のプロジェクトへのご支援をお考えの方はこちらをご覧ください。</p>

{#await projectsPromise}
	<p class="loading">読み込み中...</p>
{:then projects}
	{@const { hitoProjects, monoProjects, otherProjects } = groupProjectsByType(projects)}

	{#if hitoProjects.length > 0}
		<div class="project-group">
			<h4>ひと（人）へのご寄付</h4>
			<ul class="project-list">
				{#each hitoProjects as project (project.id)}
					<li>
						<a
							href={project.projectLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							{project.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if monoProjects.length > 0}
		<div class="project-group">
			<h4>もの（物）へのご寄付</h4>
			<ul class="project-list">
				{#each monoProjects as project (project.id)}
					<li>
						<a
							href={project.projectLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							{project.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if otherProjects.length > 0}
		<div class="project-group">
			<h4>その他のご寄付</h4>
			<ul class="project-list">
				{#each otherProjects as project (project.id)}
					<li>
						<a
							href={project.projectLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							{project.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{:catch}
	<p class="error">プロジェクトの読み込みに失敗しました。</p>
{/await}

<style>
h3 {
	font-family: var(--font-body-bold);
	font-size: 24px;
	line-height: 1.6;
	margin-bottom: 24px;
}

p {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 30px;
	letter-spacing: 0.08em;
	color: #333;
}

.loading,
.error {
	padding: 40px 0;
}

.error {
	color: #c00;
}

p + .project-group {
	margin-top: 40px;
}

.project-group + .project-group {
	margin-top: 32px;
}

h4 {
	font-family: var(--font-body-bold);
	font-size: 18px;
	line-height: 1.6;
	margin-bottom: 16px;
	color: #333;
}

.project-list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.project-list li + li {
	margin-top: 12px;
}

.project-list a {
	display: inline-block;
	font-family: var(--font-body);
	font-size: 16px;
	line-height: 1.6;
	color: #0088ff;
	text-decoration: none;
	transition: opacity 0.2s;
}

.project-list a:hover {
	opacity: 0.7;
	text-decoration: underline;
}

@media screen and (width >= 768px) {
	h4 {
		font-size: 20px;
	}

	.project-list a {
		font-size: 18px;
	}
}
</style>
