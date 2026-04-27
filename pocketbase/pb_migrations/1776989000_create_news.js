/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const collection = new Collection({
			id: 'col_news',
			name: 'news',
			type: 'base',
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			fields: [
				{
					id: 'nw_originalId',
					name: 'original_id',
					type: 'text',
					max: 64,
				},
				{
					id: 'nw_title',
					name: 'title',
					type: 'text',
					required: true,
					min: 1,
					max: 255,
				},
				{
					id: 'nw_content',
					name: 'content',
					type: 'editor',
					convertURLs: false,
				},
				{
					id: 'nw_thumbnail',
					name: 'thumbnail',
					type: 'relation',
					collectionId: 'col_media',
					cascadeDelete: false,
					maxSelect: 1,
				},
				{
					id: 'nw_pinned',
					name: 'pinned',
					type: 'bool',
				},
				{
					id: 'nw_draft',
					name: 'draft',
					type: 'bool',
				},
				{
					id: 'nw_publishedAt',
					name: 'published_at',
					type: 'date',
				},
				{
					id: 'nw_revisedAt',
					name: 'revised_at',
					type: 'date',
				},
			],
			indexes: [
				"CREATE UNIQUE INDEX `idx_news_original_id` ON `news` (`original_id`) WHERE `original_id` != ''",
				'CREATE INDEX `idx_news_published_at` ON `news` (`published_at`)',
				'CREATE INDEX `idx_news_draft` ON `news` (`draft`)',
			],
		})

		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId('col_news')
		app.delete(collection)
	},
)
