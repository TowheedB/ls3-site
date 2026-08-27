import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getNews } from '../../lib/lab';

export async function GET(context: APIContext) {
  const news = await getNews();
  return rss({
    title: 'LS3 — Laboratory for Systems, Software and Semantics',
    description: 'News from LS3 at the University of Toronto Faculty of Information.',
    site: context.site ?? 'https://ls3lab.example',
    items: news.map((n) => ({
      title: n.data.title,
      description: n.data.summary,
      pubDate: n.data.date,
      link: n.data.external ?? `/news/`,
    })),
    customData: '<language>en-ca</language>',
  });
}
