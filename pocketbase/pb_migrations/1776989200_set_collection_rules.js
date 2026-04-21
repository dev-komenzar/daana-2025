/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)

		const published = '(draft = false && published_at != "" && published_at <= @now)'
		const editorOnly = '@request.auth.role = "editor"'
		const publicOrEditor = `${published} || ${editorOnly}`

		// news
		const news = dao.findCollectionByNameOrId('news')
		news.listRule = publicOrEditor
		news.viewRule = publicOrEditor
		news.createRule = editorOnly
		news.updateRule = editorOnly
		news.deleteRule = editorOnly
		dao.saveCollection(news)

		// projects
		const projects = dao.findCollectionByNameOrId('projects')
		projects.listRule = publicOrEditor
		projects.viewRule = publicOrEditor
		projects.createRule = editorOnly
		projects.updateRule = editorOnly
		projects.deleteRule = editorOnly
		dao.saveCollection(projects)

		// media: list/view public, write = editor only
		const media = dao.findCollectionByNameOrId('media')
		media.listRule = ''
		media.viewRule = ''
		media.createRule = editorOnly
		media.updateRule = editorOnly
		media.deleteRule = editorOnly
		dao.saveCollection(media)

		// users: list/view 認証済み, update 自分のみ, create/delete superuser (null)
		const users = dao.findCollectionByNameOrId('users')
		users.listRule = '@request.auth.id != ""'
		users.viewRule = '@request.auth.id != ""'
		users.updateRule = 'id = @request.auth.id'
		users.createRule = null
		users.deleteRule = null
		dao.saveCollection(users)

		return null
	},
	(db) => {
		const dao = new Dao(db)

		for (const name of ['news', 'projects', 'media']) {
			const c = dao.findCollectionByNameOrId(name)
			c.listRule = null
			c.viewRule = null
			c.createRule = null
			c.updateRule = null
			c.deleteRule = null
			dao.saveCollection(c)
		}

		// restore users default rules (self-manage)
		const users = dao.findCollectionByNameOrId('users')
		users.listRule = 'id = @request.auth.id'
		users.viewRule = 'id = @request.auth.id'
		users.createRule = ''
		users.updateRule = 'id = @request.auth.id'
		users.deleteRule = 'id = @request.auth.id'
		dao.saveCollection(users)

		return null
	},
)
