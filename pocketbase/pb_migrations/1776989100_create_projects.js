/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const collection = new Collection({
			id: 'col_projects',
			name: 'projects',
			type: 'base',
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			fields: [
				{
					id: 'pr_originalId',
					name: 'original_id',
					type: 'text',
					max: 64,
				},
				{
					id: 'pr_title',
					name: 'title',
					type: 'text',
					required: true,
					min: 1,
					max: 255,
				},
				{
					id: 'pr_body',
					name: 'body',
					type: 'editor',
					convertURLs: false,
				},
				{
					id: 'pr_projectLink',
					name: 'projectLink',
					type: 'url',
				},
				{
					id: 'pr_type',
					name: 'type',
					type: 'select',
					maxSelect: 2,
					values: ['mono', 'hito'],
				},
				{
					id: 'pr_draft',
					name: 'draft',
					type: 'bool',
				},
				{
					id: 'pr_publishedAt',
					name: 'published_at',
					type: 'date',
				},
				{
					id: 'pr_revisedAt',
					name: 'revised_at',
					type: 'date',
				},
			],
			indexes: [
				"CREATE UNIQUE INDEX `idx_projects_original_id` ON `projects` (`original_id`) WHERE `original_id` != ''",
				'CREATE INDEX `idx_projects_published_at` ON `projects` (`published_at`)',
				'CREATE INDEX `idx_projects_draft` ON `projects` (`draft`)',
			],
		})

		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId('col_projects')
		app.delete(collection)
	},
)
