import { VIEWER_PAGES, CONVERT_PAGES, SITE_URL } from './pages-tools.mjs';
import { CORE_PAGES } from './pages-core.mjs';

export { SITE_URL };
export const PAGES = [...CORE_PAGES, ...VIEWER_PAGES, ...CONVERT_PAGES];
