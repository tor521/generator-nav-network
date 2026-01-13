/**
 * 绑定 TIME_KV 命名空间（Cloudflare 控制台中绑定，ID：64e305e814164aac9b0a8a961f00bc85）
 * 变量名必须为 TIME_KV
 */
// 简化：直接引入扁平化文件，无需子目录路径
import { generateHomeHTML } from './home.js';
import { generateFestivalContent, generateFestivalSharePage } from './festival.js';
import { generateBirthdayContent, generateBirthdaySharePage } from './birthday.js';
import { generatePrankContent, generatePrankSharePage } from './prank.js';
import { generateConfessionContent, generateConfessionSharePage } from './confession.js';
import { 
  generateCategoryContent, // 来自合并后的utils.js
  generateShareIdAndSave,
  deleteSingleHistory,
  deleteAllHistory,
  getHistoryList
} from './utils.js';

// 以下代码完全不变，与原index.js功能一致
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. 分享链接路由 - 分发到各分类模板
    if (url.pathname.startsWith('/share/')) {
      const shareId = url.pathname.split('/')[2];
      if (!shareId) return new Response('无效链接', { status: 404 });
      
      const record = await env.TIME_KV.get(`share:${shareId}`);
      if (!record) return new Response('链接已失效', { status: 404 });
      
      const data = JSON.parse(record);
      let sharePageHtml = '';
      switch (data.category) {
        case 'festival':
          sharePageHtml = generateFestivalSharePage(data);
          break;
        case 'birthday':
          sharePageHtml = generateBirthdaySharePage(data);
          break;
        case 'prank':
          sharePageHtml = generatePrankSharePage(data);
          break;
        case 'confession':
          sharePageHtml = generateConfessionSharePage(data);
          break;
        default:
          return new Response('无效分类', { status: 404 });
      }
      return new Response(sharePageHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 2. API 路由：获取分类历史记录
    if (url.pathname === '/api/get-history' && request.method === 'GET') {
      const category = url.searchParams.get('category');
      if (!category) return new Response(JSON.stringify({ code: -1, msg: '缺少分类参数' }), { headers: { 'Content-Type': 'application/json' } });
      
      const historyList = await getHistoryList(env.TIME_KV, category);
      return new Response(JSON.stringify({ code: 0, data: historyList }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 3. API 路由：生成分享链接
    if (url.pathname === '/api/generate-share' && request.method === 'POST') {
      try {
        const result = await generateShareIdAndSave(env.TIME_KV, request, url);
        return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ code: -1, msg: '生成失败：' + e.message }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 4. API 路由：删除单条历史记录
    if (url.pathname === '/api/delete-single-history' && request.method === 'POST') {
      try {
        const result = await deleteSingleHistory(env.TIME_KV, request);
        return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ code: -1, msg: '删除失败：' + e.message }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 5. API 路由：一键删除分类所有记录
    if (url.pathname === '/api/delete-all-history' && request.method === 'POST') {
      try {
        const result = await deleteAllHistory(env.TIME_KV, request);
        return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ code: -1, msg: '删除失败' }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 6. 返回主页面
    return new Response(generateHomeHTML({
      festivalContent: generateFestivalContent(),
      birthdayContent: generateBirthdayContent(),
      prankContent: generatePrankContent(),
      confessionContent: generateConfessionContent()
    }), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  },
};