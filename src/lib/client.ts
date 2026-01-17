import { MICROCMS_API_KEY } from '$env/static/private';
import ky from 'ky';

const CONTENTS_API_URL = 'https://samgha.microcms.io/api/v1/';

export const isApiConfigured = Boolean(MICROCMS_API_KEY && MICROCMS_API_KEY.trim() !== '');

const headers = {
	Accept: 'application/json',
	Charset: 'utf8',
	'Content-type': 'application/json',
	'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
};

export const api = ky.create({
	headers,
	prefixUrl: CONTENTS_API_URL,
}).extend({
	hooks: {
		beforeRequest: [
			request => {
				if (!request.headers.has('X-MICROCMS-API-KEY')) {
					throw new Error('X-MICROCMS-API-KEY is required');
				}
			},
		],
	},
});
