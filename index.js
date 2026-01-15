import { generateCommonHead, getCategoryHistory, createShareRecord } from './utils.js';
import { generateFestivalPage } from './festival.js';
import { generateBirthdayPage } from './birthday.js';
import { generatePrankPage } from './prank.js';
import { generateConfessionPage } from './confession.js';
import { generateLotteryPage } from './lottery.js'; // 新增：导入抽奖模板

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. 主页路由（仅展示分类入口，新增抽奖入口）
    if (url.pathname === '/') {
      return new Response(generateIndexPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 2. 独立分类路由 - 节日生成页面
    if (url.pathname === '/festival') {
      return new Response(generateCategoryIndependentPage('festival', '节日', 'festival'), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 3. 独立分类路由 - 生日生成页面
    if (url.pathname === '/birthday') {
      return new Response(generateCategoryIndependentPage('birthday', '生日', 'birthday'), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 4. 独立分类路由 - 整蛊生成页面
    if (url.pathname === '/prank') {
      return new Response(generateCategoryIndependentPage('prank', '整蛊', 'prank'), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 5. 独立分类路由 - 表白生成页面
    if (url.pathname === '/confession') {
      return new Response(generateCategoryIndependentPage('confession', '表白', 'confession'), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 新增：6. 独立分类路由 - 抽奖生成页面（和其他分类格式一致）
    if (url.pathname === '/lottery') {
      return new Response(generateCategoryIndependentPage('lottery', '抽奖', 'lottery'), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 7. 分享链接路由（新增抽奖分支，保持原有逻辑）
    if (url.pathname.startsWith('/share/')) {
      const shareId = url.pathname.split('/')[2];
      if (!shareId) return new Response('无效链接', { status: 404 });
      
      const record = await env.TIME_KV.get(`share:${shareId}`);
      if (!record) return new Response('链接已失效', { status: 404 });
      
      const data = JSON.parse(record);
      let pageHtml = '';
      switch (data.category) {
        case 'festival':
          pageHtml = generateFestivalPage(data);
          break;
        case 'birthday':
          pageHtml = generateBirthdayPage(data);
          break;
        case 'prank':
          pageHtml = generatePrankPage(data);
          break;
        case 'confession':
          pageHtml = generateConfessionPage(data);
          break;
        case 'lottery': // 新增：抽奖分类的分享页面渲染
          pageHtml = generateLotteryPage(data);
          break;
        default:
          return new Response('无效分类', { status: 404 });
      }
      return new Response(pageHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 8. API - 获取分类历史记录（核心功能不变，兼容抽奖分类）
    if (url.pathname === '/api/get-history' && request.method === 'GET') {
      const category = url.searchParams.get('category');
      if (!category) return new Response(JSON.stringify({ code: -1, msg: '缺少分类参数' }), { headers: { 'Content-Type': 'application/json' } });
      
      const historyList = await getCategoryHistory(env, category);
      return new Response(JSON.stringify({ code: 0, data: historyList }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 9. API - 生成分享链接（新增抽奖参数校验，保持原有逻辑）
    if (url.pathname === '/api/generate-share' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { category, template, content, previewData } = body;
        
        // 通用参数校验
        if (!category || !template || !content || !previewData) {
          return new Response(JSON.stringify({ code: -1, msg: '参数不全，请检查必填项' }), { headers: { 'Content-Type': 'application/json' } });
        }

        // 分类专属参数校验
        if (category === 'confession') {
          if (!previewData.name || !previewData.content) {
            return new Response(JSON.stringify({ code: -1, msg: '表白姓名和内容不能为空' }), { headers: { 'Content-Type': 'application/json' } });
          }
        } else if (category === 'festival') {
          if (!previewData.date) {
            return new Response(JSON.stringify({ code: -1, msg: '节日日期不能为空' }), { headers: { 'Content-Type': 'application/json' } });
          }
        } else if (category === 'birthday') {
          if (!previewData.date) {
            return new Response(JSON.stringify({ code: -1, msg: '生日日期不能为空' }), { headers: { 'Content-Type': 'application/json' } });
          }
        } else if (category === 'lottery') { // 新增：抽奖参数校验
          if (!previewData.title || !previewData.prizes || !previewData.time || !previewData.drawCount) {
            return new Response(JSON.stringify({ code: -1, msg: '抽奖标题、奖品、时间、次数不能为空' }), { headers: { 'Content-Type': 'application/json' } });
          }
        }
        
        // 生成分享记录（复用原有KV存储逻辑，无需修改）
        const { shareUrl, shareId } = await createShareRecord(env, request, category, template, content, previewData);
        
        return new Response(JSON.stringify({ 
          code: 0, 
          msg: '生成成功', 
          data: { shareUrl, shareId } 
        }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ code: -1, msg: '生成失败：' + e.message }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 10. API - 删除单条历史记录（核心功能不变，兼容抽奖分类）
    if (url.pathname === '/api/delete-single-history' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { category, id, shareId } = body;
        if (!category || !id || !shareId) {
          return new Response(JSON.stringify({ code: -1, msg: '参数不全，删除失败' }), { headers: { 'Content-Type': 'application/json' } });
        }
        await Promise.all([
          env.TIME_KV.delete(`share:${shareId}`),
          env.TIME_KV.delete(id)
        ]);
        return new Response(JSON.stringify({ code: 0, msg: '删除成功' }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ code: -1, msg: '删除失败：' + e.message }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 11. API - 一键删除分类所有记录（核心功能不变，兼容抽奖分类）
    if (url.pathname === '/api/delete-all-history' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { category } = body;
        if (!category) return new Response(JSON.stringify({ code: -1, msg: '缺少分类参数，删除失败' }), { headers: { 'Content-Type': 'application/json' } });
        
        const historyKeys = await env.TIME_KV.list({ prefix: `history:${category}:` });
        const deletePromises = [];
        for (const key of historyKeys.keys) {
          try {
            const record = JSON.parse(await env.TIME_KV.get(key.name));
            if (record.shareId) deletePromises.push(env.TIME_KV.delete(`share:${record.shareId}`));
          } catch (e) {
            console.error('解析历史记录失败:', key.name, e);
          }
          deletePromises.push(env.TIME_KV.delete(key.name));
        }
        await Promise.all(deletePromises);
        return new Response(JSON.stringify({ code: 0, msg: '全部删除成功' }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ code: -1, msg: '删除失败：' + e.message }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 12. 404 路由
    return new Response('页面不存在', { status: 404 });
  },
};

// 生成主页（新增抽奖分类入口，保持原有风格一致）
function generateIndexPage() {
  return generateCommonHead() + `
  <title>@一条无聊的桀</title>
<body class="bg-gray-50 min-h-screen font-sans text-gray-800 scroll-smooth">
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-center text-primary tracking-tight">
        专属模板生成平台
      </h1>
      <p class="text-gray-500 text-center mt-2 text-lg">节日 · 生日 · 整蛊 · 表白 · 抽奖 | 一键生成可分享链接，轻松传递心意</p>
    </div>
  </header>

  <main class="container mx-auto px-4 py-16 max-w-4xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      <!-- 节日分类入口 - 原有 -->
      <a href="/festival" class="block bg-festival/10 rounded-2xl p-8 text-center hover:bg-festival/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-calendar-days text-5xl text-festival mb-6"></i>
        <h2 class="text-xl font-bold text-festival">节日生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（经典）| 模板2（原木）| 模板3（炫酷）</p>
      </a>

      <!-- 生日分类入口 - 原有 -->
      <a href="/birthday" class="block bg-birthday/10 rounded-2xl p-8 text-center hover:bg-birthday/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-cake-candles text-5xl text-birthday mb-6"></i>
        <h2 class="text-xl font-bold text-birthday">生日生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（经典）| 模板2（科技）</p>
      </a>

      <!-- 整蛊分类入口 - 原有 -->
      <a href="/prank" class="block bg-prank/10 rounded-2xl p-8 text-center hover:bg-prank/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-face-grin-tongue text-5xl text-prank mb-6"></i>
        <h2 class="text-xl font-bold text-prank">整蛊生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（可爱）| 模板2（高级）</p>
      </a>

      <!-- 表白分类入口 - 原有 -->
      <a href="/confession" class="block bg-confession/10 rounded-2xl p-8 text-center hover:bg-confession/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-heart text-5xl text-confession mb-6"></i>
        <h2 class="text-xl font-bold text-confession">表白生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（可爱）| 模板2（简约）</p>
      </a>

      <!-- 新增：抽奖分类入口（风格和其他分类保持一致） -->
      <a href="/lottery" class="block bg-lottery/10 rounded-2xl p-8 text-center hover:bg-lottery/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-ticket-alt text-5xl text-lottery mb-6"></i>
        <h2 class="text-xl font-bold text-lottery">抽奖生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（喜庆）| 模板2（科技）</p>
      </a>
    </div>
  </main>

  <footer class="bg-white shadow-sm mt-16 py-8">
    <div class="container mx-auto px-4 text-center text-gray-500">
      <p class="text-lg">基于 Cloudflare Workers + KV 构建 | 模板可无限拓展</p>
    </div>
  </footer>

  <style>
    :root {
      --primary: #0F172A;
      --festival: #16A34A;
      --birthday: #F97316;
      --prank: #EF4444;
      --confession: #8B5CF6;
      --lottery: #38BDF8; /* 新增：抽奖分类主色 */
    }
    .bg-festival\\/10 { background-color: rgba(22, 163, 74, 0.1); }
    .bg-festival\\/20 { background-color: rgba(22, 163, 74, 0.2); }
    .bg-festival\\/30 { background-color: rgba(22, 163, 74, 0.3); }
    .text-festival { color: var(--festival); }
    .bg-birthday\\/10 { background-color: rgba(249, 115, 22, 0.1); }
    .bg-birthday\\/20 { background-color: rgba(249, 115, 22, 0.2); }
    .bg-birthday\\/30 { background-color: rgba(249, 115, 22, 0.3); }
    .text-birthday { color: var(--birthday); }
    .bg-prank\\/10 { background-color: rgba(239, 68, 68, 0.1); }
    .bg-prank\\/20 { background-color: rgba(239, 68, 68, 0.2); }
    .bg-prank\\/30 { background-color: rgba(239, 68, 68, 0.3); }
    .text-prank { color: var(--prank); }
    .bg-confession\\/10 { background-color: rgba(139, 92, 246, 0.1); }
    .bg-confession\\/20 { background-color: rgba(139, 92, 246, 0.2); }
    .bg-confession\\/30 { background-color: rgba(139, 92, 246, 0.3); }
    .text-confession { color: var(--confession); }
    /* 新增：抽奖分类样式 */
    .bg-lottery\\/10 { background-color: rgba(56, 189, 248, 0.1); }
    .bg-lottery\\/20 { background-color: rgba(56, 189, 248, 0.2); }
    .bg-lottery\\/30 { background-color: rgba(56, 189, 248, 0.3); }
    .text-lottery { color: var(--lottery); }
    .scroll-smooth { scroll-behavior: smooth; }
  </style>
</body>
</html>
  `;
}

// 生成分类独立页面（新增抽奖表单，保持原有交互逻辑一致）
function generateCategoryIndependentPage(category, title, colorKey) {
  // 定义每个分类的模板下拉选项（新增抽奖模板选项）
  const templateOptions = {
    festival: `
      <option value="1">模板1（经典）</option>
      <option value="2">模板2（原木）</option>
      <option value="3">模板3（炫酷）</option>
    `,
    birthday: `
      <option value="1">模板1（经典）</option>
      <option value="2">模板2（科技）</option>
    `,
    prank: `
      <option value="1">模板1（可爱）</option>
      <option value="2">模板2（高级）</option>
    `,
    confession: `
      <option value="1">模板1（可爱）</option>
      <option value="2">模板2（简约）</option>
    `,
    lottery: ` // 新增：抽奖模板选项
      <option value="1">模板1（经典喜庆）</option>
      <option value="2">模板2（科技简约）</option>
    `
  };

  // 复用原有表单逻辑，新增抽奖表单（保持样式和交互一致）
  let formHtml = '';
  switch (category) {
    case 'festival':
      formHtml = `
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">节日名称 <span class="text-red-500 text-xs">（默认春节）</span></label>
          <input type="text" id="festival-name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：春节、中秋节">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">节日日期 <span class="text-red-500 text-xs">（必填）</span></label>
          <input type="date" id="festival-date" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" required>
          <p id="festival-date-error" class="text-red-500 text-xs mt-1 hidden">请选择节日日期</p>
        </div>
      `;
      break;
    case 'birthday':
      formHtml = `
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">姓名 <span class="text-red-500 text-xs">（默认朋友）</span></label>
          <input type="text" id="birthday-name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：小明">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">生日日期 <span class="text-red-500 text-xs">（必填）</span></label>
          <input type="date" id="birthday-date" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" required>
          <p id="birthday-date-error" class="text-red-500 text-xs mt-1 hidden">请选择生日日期</p>
        </div>
      `;
      break;
    case 'confession':
      formHtml = `
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">对方姓名 <span class="text-red-500">*</span></label>
          <input type="text" id="confession-name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：小红" required>
          <p id="confession-name-error" class="text-red-500 text-xs mt-1 hidden">请输入对方姓名</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">表白内容 <span class="text-red-500">*</span></label>
          <textarea id="confession-content" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" rows="4" placeholder="输入你的表白内容" required></textarea>
          <p id="confession-content-error" class="text-red-500 text-xs mt-1 hidden">请输入表白内容</p>
        </div>
      `;
      break;
    case 'prank':
      formHtml = '<p class="text-gray-700 mb-4">整蛊模板无需额外参数，直接生成即可～</p>';
      break;
    case 'lottery': // 新增：抽奖表单（和其他分类样式一致，带必填校验）
      formHtml = `
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">抽奖标题 <span class="text-red-500">*</span></label>
          <input type="text" id="lottery-title" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：中秋活动抽奖、生日派对抽奖" required>
          <p id="lottery-title-error" class="text-red-500 text-xs mt-1 hidden">请输入抽奖标题</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">奖品列表 <span class="text-red-500">*</span></label>
          <input type="text" id="lottery-prizes" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="多个奖品用英文逗号分隔，例如：一等奖手机,二等奖耳机" required>
          <p id="lottery-prizes-error" class="text-red-500 text-xs mt-1 hidden">请输入奖品列表</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">抽奖时间 <span class="text-red-500">*</span></label>
          <input type="datetime-local" id="lottery-time" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" required>
          <p id="lottery-time-error" class="text-red-500 text-xs mt-1 hidden">请选择抽奖时间</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">每人抽奖次数 <span class="text-red-500">*</span></label>
          <input type="number" id="lottery-count" min="1" value="1" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：1" required>
          <p id="lottery-count-error" class="text-red-500 text-xs mt-1 hidden">请输入有效抽奖次数</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">参与用户名称 <span class="text-red-500 text-xs">（可选）</span></label>
          <input type="text" id="lottery-name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：公司员工、粉丝群成员">
        </div>
      `;
      break;
  }

  // 独立页面完整HTML结构（保持原有交互，兼容抽奖分类）
  return generateCommonHead() + `
<body class="bg-gray-50 min-h-screen font-sans text-gray-800 scroll-smooth">
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/" class="text-primary font-bold text-xl">专属模板生成平台</a>
      <!-- 返回主页按钮，方便切换 -->
      <a href="/" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-sm">
        <i class="fa-solid fa-arrow-left mr-1"></i>返回主页
      </a>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 分类标题 -->
    <div class="text-center mb-8">
      <h1 class="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-${colorKey}">${title}生成工具</h1>
      <p class="text-gray-500 mt-2">选择模板，一键生成可分享专属链接</p>
    </div>

    <!-- 核心生成面板（保留所有原有功能，兼容抽奖分类） -->
    <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
      <div class="mb-6">
        <label class="block text-gray-700 mb-2">选择模板</label>
        <select class="template-select w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" data-category="${category}">
          ${templateOptions[category]}
        </select>
      </div>
      ${formHtml}

      <div class="flex flex-col sm:flex-row gap-4">
        <button onclick="generateShare('${category}')" class="bg-${colorKey} text-white px-6 py-3 rounded-lg hover:bg-${colorKey}/90 transition-all shadow hover:shadow-${colorKey}/30 font-medium w-full sm:w-auto">
          <i class="fa-solid fa-link mr-2"></i>生成链接
        </button>
        <button onclick="deleteAllHistory('${category}')" class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium w-full sm:w-auto">
          <i class="fa-solid fa-trash-can mr-2"></i>清空历史
        </button>
      </div>

      <!-- 分享链接展示区域（保留一键复制功能，兼容抽奖分类） -->
      <div id="${category}-share-area" class="mt-6 hidden">
        <div class="border border-${colorKey}/30 rounded-lg p-4 bg-${colorKey}/5">
          <h3 class="text-sm text-gray-700 mb-2">生成结果（可直接复制）</h3>
          <div class="flex gap-2">
            <input type="text" id="${category}-share-link" class="flex-1 px-4 py-2 border rounded-lg bg-white text-sm break-all" readonly>
            <button onclick="copyShareUrl('${category}-share-link')" class="bg-${colorKey}/80 text-white px-4 py-2 rounded-lg hover:bg-${colorKey} transition-all whitespace-nowrap font-medium">
              <i class="fa-solid fa-copy mr-1"></i>复制链接
            </button>
          </div>
        </div>
      </div>

      <!-- 生成历史（保留刷新按钮，删除弹窗提示，兼容抽奖分类） -->
      <div class="mt-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">生成历史</h3>
          <button onclick="refreshHistory('${category}')" id="${category}-refresh-btn" class="bg-${colorKey}/10 text-${colorKey} px-3 py-1 rounded-lg hover:bg-${colorKey}/20 transition-all text-sm flex items-center">
            <i class="fa-solid fa-refresh mr-1"></i>刷新历史
          </button>
        </div>
        <div id="${category}-history-list" class="max-h-60 overflow-y-auto">
          <!-- 历史记录由JS加载 -->
        </div>
      </div>
    </div>
  </main>

  <footer class="bg-white shadow-sm mt-16 py-8">
    <div class="container mx-auto px-4 text-center text-gray-500">
      <p class="text-lg">基于 Cloudflare Workers + KV 构建 | 模板可无限拓展</p>
    </div>
  </footer>

  <script>
    // 加载历史记录（核心功能不变，复用为刷新功能的基础，兼容抽奖分类）
    async function loadHistory(category) {
      try {
        const res = await fetch(\`/api/get-history?category=\${category}\`);
        const data = await res.json();
        if (data.code === 0) {
          const listEl = document.getElementById(\`\${category}-history-list\`);
          if (data.data.length === 0) {
            listEl.innerHTML = '<div class="text-center py-4 text-gray-500">暂无生成记录</div>';
            return;
          }
          listEl.innerHTML = data.data.map(item => \`
            <div class="flex justify-between items-center p-3 border-b border-gray-200">
              <div class="max-w-[70%]">
                <p class="text-gray-700 text-sm">\${item.createTimeText}</p>
                <a href="\${item.shareUrl}" target="_blank" class="text-primary hover:underline text-sm break-all">\${item.shareUrl}</a>
              </div>
              <button onclick="deleteSingleHistory('\${category}', '\${item.id}', '\${item.shareId}')" class="text-red-500 hover:text-red-700 p-2">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          \`).join('');
        } else {
          alert('加载历史失败：' + data.msg);
        }
      } catch (e) {
        console.error('加载历史失败:', e);
        alert('加载历史记录失败，请稍后重试');
      }
    }

    // 刷新历史记录功能（删除刷新完成弹窗，保留加载反馈，兼容抽奖分类）
    async function refreshHistory(category) {
      const refreshBtn = document.getElementById(\`\${category}-refresh-btn\`);
      const originalText = refreshBtn.innerHTML;
      
      // 刷新中状态：禁用按钮 + 旋转图标 + 文字提示
      refreshBtn.innerHTML = '<i class="fa-solid fa-refresh fa-spin mr-1"></i>刷新中...';
      refreshBtn.disabled = true;
      refreshBtn.classList.remove('hover:bg-${colorKey}/20');
      refreshBtn.classList.add('bg-gray-100', 'cursor-not-allowed', 'opacity-70');
      
      // 重新加载历史记录
      await loadHistory(category);
      
      // 恢复按钮状态（删除弹窗提示）
      setTimeout(() => {
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('bg-gray-100', 'cursor-not-allowed', 'opacity-70');
        refreshBtn.classList.add('hover:bg-${colorKey}/20');
      }, 800);
    }

    // 删除单条历史（核心功能不变，兼容抽奖分类）
    async function deleteSingleHistory(category, id, shareId) {
      if (!confirm('确定删除这条记录吗？删除后链接将失效～')) return;
      try {
        const res = await fetch('/api/delete-single-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, id, shareId })
        });
        const data = await res.json();
        alert(data.msg);
        loadHistory(category);
      } catch (e) {
        console.error('删除单条记录失败:', e);
        alert('删除失败，请稍后重试');
      }
    }

    // 一键删除所有（核心功能不变，兼容抽奖分类）
    async function deleteAllHistory(category) {
      if (!confirm('确定删除该分类所有记录吗？所有对应链接都将失效～')) return;
      try {
        const res = await fetch('/api/delete-all-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category })
        });
        const data = await res.json();
        alert(data.msg);
        loadHistory(category);
      } catch (e) {
        console.error('删除所有记录失败:', e);
        alert('删除失败，请稍后重试');
      }
    }

    // 一键复制链接（核心功能不变，兼容抽奖分类）
    async function copyShareUrl(inputId) {
      const input = document.getElementById(inputId);
      if (!input.value) return alert('暂无可复制的链接～');
      try {
        await navigator.clipboard.writeText(input.value);
        const copyBtn = input.nextElementSibling;
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>已复制';
        copyBtn.classList.add('bg-green-600');
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('bg-green-600');
        }, 1500);
      } catch (err) {
        input.select();
        document.execCommand('copy');
        alert('已选中链接，可手动复制～');
      }
    }

    // 表单校验函数（新增抽奖表单校验，保持原有逻辑一致）
    function validateForm(category) {
      let isValid = true;
      
      // 清空所有错误提示
      document.querySelectorAll('[id$="-error"]').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
      });

      // 分类专属校验
      if (category === 'festival') {
        const date = document.getElementById('festival-date').value;
        if (!date) {
          isValid = false;
          const errorEl = document.getElementById('festival-date-error');
          errorEl.textContent = '请选择节日日期';
          errorEl.classList.remove('hidden');
        }
      } else if (category === 'birthday') {
        const date = document.getElementById('birthday-date').value;
        if (!date) {
          isValid = false;
          const errorEl = document.getElementById('birthday-date-error');
          errorEl.textContent = '请选择生日日期';
          errorEl.classList.remove('hidden');
        }
      } else if (category === 'confession') {
        const name = document.getElementById('confession-name').value.trim();
        const content = document.getElementById('confession-content').value.trim();
        
        if (!name) {
          isValid = false;
          const errorEl = document.getElementById('confession-name-error');
          errorEl.textContent = '请输入对方姓名';
          errorEl.classList.remove('hidden');
        }
        
        if (!content) {
          isValid = false;
          const errorEl = document.getElementById('confession-content-error');
          errorEl.textContent = '请输入表白内容';
          errorEl.classList.remove('hidden');
        }
      } else if (category === 'lottery') { // 新增：抽奖表单校验
        const title = document.getElementById('lottery-title').value.trim();
        const prizes = document.getElementById('lottery-prizes').value.trim();
        const time = document.getElementById('lottery-time').value;
        const drawCount = document.getElementById('lottery-count').value;
        
        if (!title) {
          isValid = false;
          const errorEl = document.getElementById('lottery-title-error');
          errorEl.textContent = '请输入抽奖标题';
          errorEl.classList.remove('hidden');
        }
        
        if (!prizes) {
          isValid = false;
          const errorEl = document.getElementById('lottery-prizes-error');
          errorEl.textContent = '请输入奖品列表';
          errorEl.classList.remove('hidden');
        }
        
        if (!time) {
          isValid = false;
          const errorEl = document.getElementById('lottery-time-error');
          errorEl.textContent = '请选择抽奖时间';
          errorEl.classList.remove('hidden');
        }
        
        if (!drawCount || drawCount < 1) {
          isValid = false;
          const errorEl = document.getElementById('lottery-count-error');
          errorEl.textContent = '请输入大于等于1的抽奖次数';
          errorEl.classList.remove('hidden');
        }
      }

      return isValid;
    }

    // 生成分享链接（优化校验+交互，新增抽奖数据收集，保持原有逻辑一致）
    async function generateShare(category) {
      // 先做表单校验
      if (!validateForm(category)) {
        return;
      }

      const generateBtn = document.querySelector(\`button[onclick="generateShare('\${category}')"]\`);
      const originalText = generateBtn.innerHTML;
      
      // 禁用按钮并显示加载状态
      generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>生成中...';
      generateBtn.disabled = true;
      generateBtn.classList.add('opacity-70', 'cursor-not-allowed');

      try {
        let previewData = {};
        if (category === 'festival') {
          previewData = {
            name: document.getElementById('festival-name').value || '春节',
            date: document.getElementById('festival-date').value
          };
        } else if (category === 'birthday') {
          previewData = {
            name: document.getElementById('birthday-name').value || '朋友',
            date: document.getElementById('birthday-date').value
          };
        } else if (category === 'prank') {
          previewData = { content: '整蛊内容' };
        } else if (category === 'confession') {
          previewData = {
            name: document.getElementById('confession-name').value.trim(),
            content: document.getElementById('confession-content').value.trim()
          };
        } else if (category === 'lottery') { // 新增：抽奖数据收集（和其他分类格式一致）
          previewData = {
            title: document.getElementById('lottery-title').value.trim(),
            prizes: document.getElementById('lottery-prizes').value.trim(),
            time: document.getElementById('lottery-time').value,
            drawCount: document.getElementById('lottery-count').value,
            name: document.getElementById('lottery-name').value.trim() || '幸运用户'
          };
        }

        const template = document.querySelector(\`.template-select[data-category="\${category}"]\`).value;
        const res = await fetch('/api/generate-share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            template,
            content: JSON.stringify(previewData),
            previewData
          })
        });
        const data = await res.json();
        
        if (data.code === 0) {
          const linkInput = document.getElementById(\`\${category}-share-link\`);
          const linkArea = document.getElementById(\`\${category}-share-area\`);
          linkInput.value = data.data.shareUrl;
          linkArea.classList.remove('hidden');
          
          // 打开新标签页跳转链接
          window.open(data.data.shareUrl, '_blank');
          
          // 重新加载历史记录
          loadHistory(category);
        } else {
          alert(data.msg);
        }
      } catch (e) {
        console.error('生成分享链接失败:', e);
        alert('生成链接失败，请稍后重试');
      } finally {
        // 恢复按钮状态
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
        generateBtn.classList.remove('opacity-70', 'cursor-not-allowed');
      }
    }

    // 页面加载完成后加载历史记录（核心功能不变，新增抽奖表单实时校验）
    window.onload = () => {
      loadHistory('${category}');
      
      // 给必填项添加实时校验
      document.querySelectorAll('input[required], textarea[required]').forEach(el => {
        el.addEventListener('blur', () => {
          validateForm('${category}');
        });
        el.addEventListener('input', () => {
          const errorEl = document.getElementById(\`\${el.id}-error\`);
          if (errorEl && el.value.trim()) {
            errorEl.classList.add('hidden');
          }
        });
      });
    };
  </script>

  <style>
    :root {
      --primary: #0F172A;
      --festival: #16A34A;
      --birthday: #F97316;
      --prank: #EF4444;
      --confession: #8B5CF6;
      --lottery: #38BDF8; /* 新增：抽奖分类主色变量 */
    }
    .bg-festival { background-color: var(--festival); }
    .text-festival { color: var(--festival); }
    .bg-birthday { background-color: var(--birthday); }
    .text-birthday { color: var(--birthday); }
    .bg-prank { background-color: var(--prank); }
    .text-prank { color: var(--prank); }
    .bg-confession { background-color: var(--confession); }
    .text-confession { color: var(--confession); }
    .bg-lottery { background-color: var(--lottery); } /* 新增：抽奖背景色 */
    .text-lottery { color: var(--lottery); } /* 新增：抽奖文字色 */
    .scroll-smooth { scroll-behavior: smooth; }
    /* 旋转图标动画 */
    .fa-spin {
      animation: fa-spin 1s linear infinite;
    }
    @keyframes fa-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    /* 禁用按钮样式 */
    button:disabled {
      pointer-events: none;
    }
  </style>
</body>
</html>
  `;
}
