import { SITE_FULL_URL } from '$lib/constants'
import { getNewsForSitemap } from '$lib/news/app'

import type { RequestHandler } from './$types'

export const prerender = true

const staticRoutes = [
	{ changefreq: 'weekly', path: '/', priority: '1.0' },
	{ changefreq: 'daily', path: '/news', priority: '0.8' },
	{ changefreq: 'monthly', path: '/donation', priority: '0.8' },
	{ changefreq: 'monthly', path: '/passion', priority: '0.7' },
	{ changefreq: 'monthly', path: '/vision', priority: '0.7' },
	{ changefreq: 'monthly', path: '/action', priority: '0.7' },
	{ changefreq: 'monthly', path: '/temple', priority: '0.7' },
	{ changefreq: 'yearly', path: '/interview-ryugen', priority: '0.6' },
	{ changefreq: 'yearly', path: '/interview-kuramoto', priority: '0.6' },
]

export const GET: RequestHandler = async () => {
	const newsItems = await getNewsForSitemap()
	const xml = generateSitemapXml(staticRoutes, newsItems)

	return new Response(xml, {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml',
		},
	})
}

function generateSitemapXml(staticRoutes: Array<{ changefreq: string; path: string; priority: string; }>, newsItems: Array<{ id: string; publishedAt?: string }>): string {
	const staticUrls = staticRoutes
		.map(
			route => `  <url>
    <loc>${SITE_FULL_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
		)
		.join('\n')

	const newsUrls = newsItems
		.map(
			item => `  <url>
    <loc>${SITE_FULL_URL}/news/${item.id}</loc>${item.publishedAt ? `\n    <lastmod>${item.publishedAt.split('T')[0]}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`,
		)
		.join('\n')

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${newsUrls}
</urlset>`
}
