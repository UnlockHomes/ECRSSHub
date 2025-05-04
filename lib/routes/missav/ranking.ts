import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import cheerio from 'cheerio';
import config from './namespace';

const parse = async (url: string) => {
  const html = await ofetch(url, { headers: { 'User-Agent': config.ua } });
  const $ = cheerio.load(html);
  return $('.video-card').map((_, el) => {
    const el$ = $(el);
    return {
      title: el$.find('.video-title').text().trim(),
      link: config.url + el$.find('a').attr('href'),
      description: `<img src="${el$.find('img').attr('src')}"><br>${el$.find('.video-meta').text().trim()}`,
    };
  }).get();
};

export default [
  {
    endpoint: '/missav/ranking/weekly',
    async handler(ctx) {
      const url = `${config.url}/dm514/new?sort=weekly_views`;
      ctx.state.data = {
        title: 'MissAV 周排行',
        link: url,
        item: await parse(url),
      };
    },
  },
  {
    endpoint: '/missav/ranking/monthly',
    async handler(ctx) {
      const url = `${config.url}/dm514/new?sort=monthly_views`;
      ctx.state.data = {
        title: 'MissAV 月排行',
        link: url,
        item: await parse(url),
      };
    },
  },
] as Route[];
