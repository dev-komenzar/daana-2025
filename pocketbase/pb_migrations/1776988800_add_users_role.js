/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId('users')

		collection.schema.addField(
			new SchemaField({
				id: 'usr_role',
				name: 'role',
				type: 'select',
				required: false,
				unique: false,
				system: false,
				options: {
					maxSelect: 1,
					values: ['editor', 'viewer'],
				},
			}),
		)

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId('users')
		collection.schema.removeField('usr_role')
		return dao.saveCollection(collection)
	},
)
