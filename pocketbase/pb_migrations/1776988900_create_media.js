/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const usersCol = app.findCollectionByNameOrId('users')

		const collection = new Collection({
			id: 'col_media',
			name: 'media',
			type: 'base',
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			fields: [
				{
					id: 'md_file',
					name: 'file',
					type: 'file',
					required: true,
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
				{
					id: 'md_alt',
					name: 'alt',
					type: 'text',
					required: true,
					max: 255,
				},
				{
					id: 'md_caption',
					name: 'caption',
					type: 'text',
				},
				{
					id: 'md_width',
					name: 'width',
					type: 'number',
					min: 0,
					onlyInt: true,
				},
				{
					id: 'md_height',
					name: 'height',
					type: 'number',
					min: 0,
					onlyInt: true,
				},
				{
					id: 'md_mime',
					name: 'mime',
					type: 'text',
					max: 127,
				},
				{
					id: 'md_uploadedBy',
					name: 'uploadedBy',
					type: 'relation',
					collectionId: usersCol.id,
					cascadeDelete: false,
					maxSelect: 1,
				},
			],
		})

		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId('col_media')
		app.delete(collection)
	},
)
