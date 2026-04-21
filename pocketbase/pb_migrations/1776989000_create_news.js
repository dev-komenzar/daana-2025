/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: 'col_news',
			name: 'news',
			type: 'base',
			system: false,
			schema: [
				{
					id: 'nw_originalId',
					name: 'original_id',
					type: 'text',
					required: false,
					unique: false,
					system: false,
					options: { min: null, max: 64, pattern: '' },
				},
				{
					id: 'nw_title',
					name: 'title',
					type: 'text',
					required: true,
					unique: false,
					system: false,
					options: { min: 1, max: 255, pattern: '' },
				},
				{
					id: 'nw_content',
					name: 'content',
					type: 'editor',
					required: false,
					unique: false,
					system: false,
					options: { convertUrls: false },
				},
				{
					id: 'nw_thumbnail',
					name: 'thumbnail',
					type: 'relation',
					required: false,
					unique: false,
					system: false,
					options: {
						collectionId: 'col_media',
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null,
					},
				},
				{
					id: 'nw_pinned',
					name: 'pinned',
					type: 'bool',
					required: false,
					unique: false,
					system: false,
					options: {},
				},
				{
					id: 'nw_draft',
					name: 'draft',
					type: 'bool',
					required: false,
					unique: false,
					system: false,
					options: {},
				},
				{
					id: 'nw_publishedAt',
					name: 'published_at',
					type: 'date',
					required: false,
					unique: false,
					system: false,
					options: { min: '', max: '' },
				},
				{
					id: 'nw_revisedAt',
					name: 'revised_at',
					type: 'date',
					required: false,
					unique: false,
					system: false,
					options: { min: '', max: '' },
				},
			],
			indexes: [
				'CREATE UNIQUE INDEX `idx_news_original_id` ON `news` (`original_id`) WHERE `original_id` != \'\'',
				'CREATE INDEX `idx_news_published_at` ON `news` (`published_at`)',
				'CREATE INDEX `idx_news_draft` ON `news` (`draft`)',
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
		const collection = dao.findCollectionByNameOrId('col_news')
		return dao.deleteCollection(collection)
	},
)
