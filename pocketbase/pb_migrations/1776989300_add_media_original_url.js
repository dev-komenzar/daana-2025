/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId('col_media')

		collection.fields.add(
			new TextField({
				id: 'md_originalUrl',
				name: 'original_url',
				max: 512,
			}),
		)

		collection.addIndex(
			'idx_media_original_url',
			true,
			'`original_url`',
			"`original_url` != ''",
		)

		app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId('col_media')
		collection.fields.removeById('md_originalUrl')
		collection.removeIndex('idx_media_original_url')
		app.save(collection)
	},
)
