import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = ['p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's', 'code', 'mark', 'sub', 'sup', 'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'span', 'div']

const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'colspan', 'rowspan', 'scope', 'style', 'class', 'id']

export function sanitizeHtml(raw: string): string {
	return DOMPurify.sanitize(raw, {
		ALLOWED_ATTR,
		ALLOWED_TAGS,
	})
}
