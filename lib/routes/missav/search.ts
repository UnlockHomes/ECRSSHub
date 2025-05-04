import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import cheerio from 'cheerio';
import config from './namespace';

const route: Route = {
  endpoint: '/missav/search/:query',
  async handler(ctx) {
    const q = encodeURIComponent(ctx.params.query);
    const url = `${config.url}/cn/search/${q}`;
    const html = await ofetch(url, { headers: { 'User-Agent': config.ua } });
    const $ = cheerio.load(html);
    const items = $('.video-card').map((_, el) => {
      const el$ = $(el);
      return {
        title: el$.find('.video-title').text().trim(),
        link: config.url + el$.find('a').attr('href'),
        description: `<img src="${el$.find('img').attr('src')}"><br>${el$.find('.video-meta').text().trim()}`,
      };
    }).get();
    ctx.state.data = {
      title: `MissAV Search: ${ctx.params.query}`,
      link: url,
      item: items,
    };
  },
};

export default route;
