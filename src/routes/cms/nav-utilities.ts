export function shouldShowNav(pathname: string, role: null | string | undefined): boolean {
	if (pathname === '/cms/login') return false
	return role === 'editor'
}
