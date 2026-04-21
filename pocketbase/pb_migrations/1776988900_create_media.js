/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: 'col_media',
			name: 'media',
			type: 'base',
			system: false,
			schema: [
				{
					id: 'md_file',
					name: 'file',
					type: 'file',
					required: true,
					unique: false,
					system: false,
					options: {
						maxSelect: 1,
						maxSize: 10485760,
						mimeTypes: [
							'image/jpeg',
							'image/png',
							'image/webp',
							'image/avif',
							'image/gif',
							'image/svg+xml',
						],
						thumbs: ['160x160f', '480x0', '960x0'],
						protected: false,
					},
				},
				{
					id: 'md_alt',
					name: 'alt',
					type: 'text',
					required: true,
					unique: false,
					system: false,
					options: { min: null, max: 255, pattern: '' },
				},
				{
					id: 'md_caption',
					name: 'caption',
					type: 'text',
					required: false,
					unique: false,
					system: false,
					options: { min: null, max: null, pattern: '' },
				},
				{
					id: 'md_width',
					name: 'width',
					type: 'number',
					required: false,
					unique: false,
					system: false,
					options: { min: 0, max: null, noDecimal: true },
				},
				{
					id: 'md_height',
					name: 'height',
					type: 'number',
					required: false,
					unique: false,
					system: false,
					options: { min: 0, max: null, noDecimal: true },
				},
				{
					id: 'md_mime',
					name: 'mime',
					type: 'text',
					required: false,
					unique: false,
					system: false,
					options: { min: null, max: 127, pattern: '' },
				},
				{
					id: 'md_uploadedBy',
					name: 'uploadedBy',
					type: 'relation',
					required: false,
					unique: false,
					system: false,
					options: {
						collectionId: '_pb_users_auth_',
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null,
					},
				},
			],
			indexes: [],
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
		const collection = dao.findCollectionByNameOrId('col_media')
		return dao.deleteCollection(collection)
	},
)
