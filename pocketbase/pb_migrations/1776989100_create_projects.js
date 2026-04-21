/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: 'col_projects',
			name: 'projects',
			type: 'base',
			system: false,
			schema: [
				{
					id: 'pr_originalId',
					name: 'original_id',
					type: 'text',
					required: false,
					unique: false,
					system: false,
					options: { min: null, max: 64, pattern: '' },
				},
				{
					id: 'pr_title',
					name: 'title',
					type: 'text',
					required: true,
					unique: false,
					system: false,
					options: { min: 1, max: 255, pattern: '' },
				},
				{
					id: 'pr_body',
					name: 'body',
					type: 'editor',
					required: false,
					unique: false,
					system: false,
					options: { convertUrls: false },
				},
				{
					id: 'pr_projectLink',
					name: 'projectLink',
					type: 'url',
					required: false,
					unique: false,
					system: false,
					options: { exceptDomains: null, onlyDomains: null },
				},
				{
					id: 'pr_type',
					name: 'type',
					type: 'select',
					required: false,
					unique: false,
					system: false,
					options: { maxSelect: 2, values: ['mono', 'hito'] },
				},
				{
					id: 'pr_draft',
					name: 'draft',
					type: 'bool',
					required: false,
					unique: false,
					system: false,
					options: {},
				},
				{
					id: 'pr_publishedAt',
					name: 'published_at',
					type: 'date',
					required: false,
					unique: false,
					system: false,
					options: { min: '', max: '' },
				},
				{
					id: 'pr_revisedAt',
					name: 'revised_at',
					type: 'date',
					required: false,
					unique: false,
					system: false,
					options: { min: '', max: '' },
				},
			],
			indexes: [
				'CREATE UNIQUE INDEX `idx_projects_original_id` ON `projects` (`original_id`) WHERE `original_id` != \'\'',
				'CREATE INDEX `idx_projects_published_at` ON `projects` (`published_at`)',
				'CREATE INDEX `idx_projects_draft` ON `projects` (`draft`)',
			],
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			options: {},
		})

		return Dao(db).saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId('col_projects')
		return dao.deleteCollection(collection)
	},
)
