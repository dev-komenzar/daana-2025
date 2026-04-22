import { http, HttpResponse } from 'msw'

import newsSample from '../fixtures/microcms/news.sample.json' with { type: 'json' }
import projectsSample from '../fixtures/microcms/projects.sample.json' with { type: 'json' }

const MICROCMS_BASE = 'https://samgha.microcms.io/api/v1'

export const microCmsHandlers = [http.get(`${MICROCMS_BASE}/news`, () => HttpResponse.json(newsSample)), http.get(`${MICROCMS_BASE}/projects`, () => HttpResponse.json(projectsSample))]
