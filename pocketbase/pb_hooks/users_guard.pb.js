/// <reference path="../pb_data/types.d.ts" />
onRecordBeforeUpdateRequest((e) => {
	const admin = e.httpContext.get('admin')
	if (admin) {
		return
	}

	const originalRole = e.record.originalCopy().getString('role')
	const newRole = e.record.getString('role')

	if (newRole !== originalRole) {
		throw new BadRequestError(
			'role field cannot be modified by non-admin users',
		)
	}
}, 'users')
