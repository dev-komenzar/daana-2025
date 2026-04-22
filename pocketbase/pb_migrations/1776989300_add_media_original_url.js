/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId('col_media')
		collection.schema.addField(
			new SchemaField({
				id: 'md_originalUrl',
				name: 'original_url',
				type: 'text',
				required: false,
				unique: false,
				system: false,
				options: { min: null, max: 512, pattern: '' },
			}),
		)
		collection.indexes.push(
			"CREATE UNIQUE INDEX `idx_media_original_url` ON `media` (`original_url`) WHERE `original_url` != ''",
		)
		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId('col_media')
		collection.schema.removeField('md_originalUrl')
		collection.indexes = collection.indexes.filter((idx) => !idx.includes('idx_media_original_url'))
		return dao.saveCollection(collection)
	},
)
