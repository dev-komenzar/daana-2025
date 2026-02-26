<script lang="ts">
import type { ProjectItem } from '$lib/projects'

let { projects }: { projects: ProjectItem[] } = $props()

function groupProjectsByType(projectsList: ProjectItem[]) {
	const hitoProjects: ProjectItem[] = []
	const monoProjects: ProjectItem[] = []
	const otherProjects: ProjectItem[] = []

	for (const project of projectsList) {
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

const grouped = $derived(groupProjectsByType(projects))
</script>

<h3>プロジェクトへのご寄付</h3>
<p>特定のプロジェクトへのご支援をお考えの方はこちらをご覧ください。</p>

{#if grouped.hitoProjects.length > 0}
	<div class="project-group">
		<h4>ひと（人）へのご寄付</h4>
		<ul class="project-list">
			{#each grouped.hitoProjects as project (project.id)}
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

{#if grouped.monoProjects.length > 0}
	<div class="project-group">
		<h4>もの（物）へのご寄付</h4>
		<ul class="project-list">
			{#each grouped.monoProjects as project (project.id)}
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

{#if grouped.otherProjects.length > 0}
	<div class="project-group">
		<h4>その他のご寄付</h4>
		<ul class="project-list">
			{#each grouped.otherProjects as project (project.id)}
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
