/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const published = '(draft = false && published_at != "" && published_at <= @now)'
		const editorOnly = '@request.auth.role = "editor"'
		const publicOrEditor = `${published} || ${editorOnly}`

		// news / projects: 公開 or editor のみ閲覧、書き込みは editor のみ
		for (const name of ['news', 'projects']) {
			const c = app.findCollectionByNameOrId(name)
			c.listRule = publicOrEditor
			c.viewRule = publicOrEditor
			c.createRule = editorOnly
			c.updateRule = editorOnly
			c.deleteRule = editorOnly
			app.save(c)
		}

		// media: list/view 公開、書き込みは editor のみ
		const media = app.findCollectionByNameOrId('media')
		media.listRule = ''
		media.viewRule = ''
		media.createRule = editorOnly
		media.updateRule = editorOnly
		media.deleteRule = editorOnly
		app.save(media)

		// users: list/view は認証済み、update は本人のみ、create/delete は superuser
		const users = app.findCollectionByNameOrId('users')
		users.listRule = '@request.auth.id != ""'
		users.viewRule = '@request.auth.id != ""'
		users.updateRule = 'id = @request.auth.id'
		users.createRule = null
		users.deleteRule = null
		app.save(users)
	},
	(app) => {
		for (const name of ['news', 'projects', 'media']) {
			const c = app.findCollectionByNameOrId(name)
			c.listRule = null
			c.viewRule = null
			c.createRule = null
			c.updateRule = null
			c.deleteRule = null
			app.save(c)
		}

		const users = app.findCollectionByNameOrId('users')
		users.listRule = 'id = @request.auth.id'
		users.viewRule = 'id = @request.auth.id'
		users.createRule = ''
		users.updateRule = 'id = @request.auth.id'
		users.deleteRule = 'id = @request.auth.id'
		app.save(users)
	},
)
