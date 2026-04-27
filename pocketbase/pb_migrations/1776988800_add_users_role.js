/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const users = app.findCollectionByNameOrId('users')

		users.fields.add(
			new SelectField({
				id: 'usr_role',
				name: 'role',
				required: false,
				maxSelect: 1,
				values: ['editor', 'viewer'],
			}),
		)

		app.save(users)
	},
	(app) => {
		const users = app.findCollectionByNameOrId('users')
		users.fields.removeById('usr_role')
		app.save(users)
	},
)
