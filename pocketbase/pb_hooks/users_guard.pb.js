/// <reference path="../pb_data/types.d.ts" />
onRecordUpdateRequest((e) => {
	if (e.hasSuperuserAuth()) {
		e.next()
		return
	}

	const original = e.record.original()
	const newRole = e.record.getString('role')
	const originalRole = original.getString('role')

	if (newRole !== originalRole) {
		throw new BadRequestError('role field cannot be modified by non-admin users')
	}

	e.next()
}, 'users')
