import { generateCommonHead, getCategoryHistory, createShareRecord } from './utils.js';
import { generateFestivalPage } from './festival.js';
import { generateBirthdayPage } from './birthday.js';
import { generatePrankPage } from './prank.js';
import { generateConfessionPage } from './confession.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. 主页路由（展示分类入口，无生成面板）
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

    // 6. 分享链接路由（分发到对应分类模板，核心功能不变）
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
        default:
          return new Response('无效分类', { status: 404 });
      }
      return new Response(pageHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 7. API - 获取分类历史记录（核心功能不变）
    if (url.pathname === '/api/get-history' && request.method === 'GET') {
      const category = url.searchParams.get('category');
      if (!category) return new Response(JSON.stringify({ code: -1, msg: '缺少分类参数' }), { headers: { 'Content-Type': 'application/json' } });
      
      const historyList = await getCategoryHistory(env, category);
      return new Response(JSON.stringify({ code: 0, data: historyList }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 8. API - 生成分享链接（核心功能不变）
    if (url.pathname === '/api/generate-share' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { category, template, content, previewData } = body;
        
        // 表白分类参数校验
        if (category === 'confession' && (!previewData.name || !previewData.content)) {
          return new Response(JSON.stringify({ code: -1, msg: '表白姓名和内容不能为空' }), { headers: { 'Content-Type': 'application/json' } });
        }
        // 通用参数校验
        if (!category || !template || !content || !previewData) {
          return new Response(JSON.stringify({ code: -1, msg: '参数不全' }), { headers: { 'Content-Type': 'application/json' } });
        }
        
        // 生成分享记录
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

    // 9. API - 删除单条历史记录（核心功能不变）
    if (url.pathname === '/api/delete-single-history' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { category, id, shareId } = body;
        if (!category || !id || !shareId) {
          return new Response(JSON.stringify({ code: -1, msg: '参数不全' }), { headers: { 'Content-Type': 'application/json' } });
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

    // 10. API - 一键删除分类所有记录（核心功能不变）
    if (url.pathname === '/api/delete-all-history' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { category } = body;
        if (!category) return new Response(JSON.stringify({ code: -1, msg: '缺少分类参数' }), { headers: { 'Content-Type': 'application/json' } });
        
        const historyKeys = await env.TIME_KV.list({ prefix: `history:${category}:` });
        const deletePromises = [];
        for (const key of historyKeys.keys) {
          const record = JSON.parse(await env.TIME_KV.get(key.name));
          if (record.shareId) deletePromises.push(env.TIME_KV.delete(`share:${record.shareId}`));
          deletePromises.push(env.TIME_KV.delete(key.name));
        }
        await Promise.all(deletePromises);
        return new Response(JSON.stringify({ code: 0, msg: '全部删除成功' }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ code: -1, msg: '删除失败' }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 11. 404 路由
    return new Response('页面不存在', { status: 404 });
  },
};

// 生成主页（仅展示分类入口，跳转至独立页面）
function generateIndexPage() {
  return generateCommonHead() + `
<body class="bg-gray-50 min-h-screen font-sans text-gray-800 scroll-smooth">
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-center text-primary tracking-tight">
        专属模板生成平台
      </h1>
      <p class="text-gray-500 text-center mt-2 text-lg">节日 · 生日 · 整蛊 · 表白 | 一键生成可分享链接，轻松传递心意</p>
    </div>
  </header>

  <main class="container mx-auto px-4 py-16 max-w-4xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- 节日分类入口 - 跳转至 /festival 独立页面 -->
      <a href="/festival" class="block bg-festival/10 rounded-2xl p-8 text-center hover:bg-festival/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-calendar-days text-5xl text-festival mb-6"></i>
        <h2 class="text-xl font-bold text-festival">节日生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（经典）| 模板2（国风）</p>
        <div class="mt-6 inline-block bg-festival/20 text-festival px-4 py-2 rounded-lg text-sm hover:bg-festival/30 transition-all">
          进入生成 →
        </div>
      </a>

      <!-- 生日分类入口 - 跳转至 /birthday 独立页面 -->
      <a href="/birthday" class="block bg-birthday/10 rounded-2xl p-8 text-center hover:bg-birthday/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-cake-candles text-5xl text-birthday mb-6"></i>
        <h2 class="text-xl font-bold text-birthday">生日生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（经典）| 模板2（极简）</p>
        <div class="mt-6 inline-block bg-birthday/20 text-birthday px-4 py-2 rounded-lg text-sm hover:bg-birthday/30 transition-all">
          进入生成 →
        </div>
      </a>

      <!-- 整蛊分类入口 - 跳转至 /prank 独立页面 -->
      <a href="/prank" class="block bg-prank/10 rounded-2xl p-8 text-center hover:bg-prank/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-face-grin-tongue text-5xl text-prank mb-6"></i>
        <h2 class="text-xl font-bold text-prank">整蛊生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（经典）| 模板2（轻奢）</p>
        <div class="mt-6 inline-block bg-prank/20 text-prank px-4 py-2 rounded-lg text-sm hover:bg-prank/30 transition-all">
          进入生成 →
        </div>
      </a>

      <!-- 表白分类入口 - 跳转至 /confession 独立页面 -->
      <a href="/confession" class="block bg-confession/10 rounded-2xl p-8 text-center hover:bg-confession/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-heart text-5xl text-confession mb-6"></i>
        <h2 class="text-xl font-bold text-confession">表白生成网</h2>
        <p class="mt-4 text-gray-600 text-sm">模板1（高级）| 模板2（卡通）</p>
        <div class="mt-6 inline-block bg-confession/20 text-confession px-4 py-2 rounded-lg text-sm hover:bg-confession/30 transition-all">
          进入生成 →
        </div>
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
    .scroll-smooth { scroll-behavior: smooth; }
  </style>
</body>
</html>
  `;
}

// 生成分类独立页面（完整保留所有生成功能，新增返回主页按钮）
function generateCategoryIndependentPage(category, title, colorKey) {
  // 复用原有表单逻辑，保持功能一致
  let formHtml = '';
  switch (category) {
    case 'festival':
      formHtml = `
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">节日名称 <span class="text-red-500 text-xs">（选填，默认春节）</span></label>
          <input type="text" id="festival-name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：春节、中秋节">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">节日日期 <span class="text-red-500 text-xs">（选填）</span></label>
          <input type="date" id="festival-date" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}">
        </div>
      `;
      break;
    case 'birthday':
      formHtml = `
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">姓名 <span class="text-red-500 text-xs">（选填，默认朋友）</span></label>
          <input type="text" id="birthday-name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：小明">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">生日日期 <span class="text-red-500 text-xs">（选填）</span></label>
          <input type="date" id="birthday-date" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}">
        </div>
      `;
      break;
    case 'confession':
      formHtml = `
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">对方姓名 <span class="text-red-500">*</span></label>
          <input type="text" id="confession-name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" placeholder="例如：小红" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">表白内容 <span class="text-red-500">*</span></label>
          <textarea id="confession-content" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" rows="4" placeholder="输入你的表白内容" required></textarea>
        </div>
      `;
      break;
    case 'prank':
      formHtml = '<p class="text-gray-700 mb-4">整蛊模板无需额外参数，直接生成即可～</p>';
      break;
  }

  // 独立页面完整HTML结构
  return generateCommonHead() + `
<body class="bg-gray-50 min-h-screen font-sans text-gray-800 scroll-smooth">
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/" class="text-primary font-bold text-xl">专属模板生成平台</a>
      <!-- 新增：返回主页按钮，方便切换 -->
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

    <!-- 核心生成面板（保留所有原有功能） -->
    <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
      <div class="mb-6">
        <label class="block text-gray-700 mb-2">选择模板</label>
        <select class="template-select w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" data-category="${category}">
          <option value="1">模板1（经典版）</option>
          <option value="2">模板2（拓展版）</option>
        </select>
      </div>
      ${formHtml}

      <!-- 生成分享链接按钮（保留优化后配色） -->
      <button onclick="generateShare('${category}')" class="bg-${colorKey} text-white px-6 py-3 rounded-lg hover:bg-${colorKey}/90 transition-all shadow hover:shadow-${colorKey}/30 font-medium">
        <i class="fa-solid fa-link mr-2"></i>生成分享链接
      </button>
      <button onclick="deleteAllHistory('${category}')" class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all ml-4 font-medium">
        <i class="fa-solid fa-trash-can mr-2"></i>清空历史
      </button>

      <!-- 分享链接展示区域（保留一键复制功能） -->
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

      <!-- 生成历史（保留增删功能） -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">生成历史</h3>
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
    // 加载历史记录（核心功能不变）
    async function loadHistory(category) {
      const res = await fetch(\`/api/get-history?category=\${category}\`);
      const data = await res.json();
      if (data.code === 0) {
        const listEl = document.getElementById(\`\${category}-history-list\`);
        listEl.innerHTML = data.data.map(item => \`
          <div class="flex justify-between items-center p-3 border-b border-gray-200">
            <div>
              <p class="text-gray-700 text-sm">\${item.createTimeText}</p>
              <a href="\${item.shareUrl}" target="_blank" class="text-primary hover:underline text-sm break-all">\${item.shareUrl}</a>
            </div>
            <button onclick="deleteSingleHistory('\${category}', '\${item.id}', '\${item.shareId}')" class="text-red-500 hover:text-red-700 p-2">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        \`).join('');
      }
    }

    // 删除单条历史（核心功能不变）
    async function deleteSingleHistory(category, id, shareId) {
      if (!confirm('确定删除这条记录吗？删除后链接将失效～')) return;
      const res = await fetch('/api/delete-single-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, id, shareId })
      });
      const data = await res.json();
      alert(data.msg);
      loadHistory(category);
    }

    // 一键删除所有（核心功能不变）
    async function deleteAllHistory(category) {
      if (!confirm('确定删除该分类所有记录吗？所有对应链接都将失效～')) return;
      const res = await fetch('/api/delete-all-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      alert(data.msg);
      loadHistory(category);
    }

    // 一键复制链接（核心功能不变）
    async function copyShareUrl(inputId) {
      const input = document.getElementById(inputId);
      if (!input.value) return alert('暂无可复制的链接～');
      try {
        await navigator.clipboard.writeText(input.value);
        const copyBtn = input.nextElementSibling;
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>已复制';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 1500);
      } catch (err) {
        input.select();
        document.execCommand('copy');
        alert('已选中链接，可手动复制～');
      }
    }

    // 生成分享链接（核心功能不变）
    async function generateShare(category) {
      const generateBtn = document.querySelector(\`button[onclick="generateShare('\${category}')"]\`);
      const originalText = generateBtn.innerHTML;
      generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>生成中...';
      generateBtn.disabled = true;

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
          name: document.getElementById('confession-name').value,
          content: document.getElementById('confession-content').value
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
      
      generateBtn.innerHTML = originalText;
      generateBtn.disabled = false;

      if (data.code === 0) {
        const linkInput = document.getElementById(\`\${category}-share-link\`);
        const linkArea = document.getElementById(\`\${category}-share-area\`);
        linkInput.value = data.data.shareUrl;
        linkArea.classList.remove('hidden');
        alert(\`生成成功！链接已展示在页面，可直接复制～\`);
        loadHistory(category);
      } else {
        alert(data.msg);
      }
    }

    // 页面加载完成后加载历史记录（核心功能不变）
    window.onload = () => {
      loadHistory('${category}');
    };
  </script>

  <style>
    :root {
      --primary: #0F172A;
      --festival: #16A34A;
      --birthday: #F97316;
      --prank: #EF4444;
      --confession: #8B5CF6;
    }
    .bg-festival { background-color: var(--festival); }
    .text-festival { color: var(--festival); }
    .bg-birthday { background-color: var(--birthday); }
    .text-birthday { color: var(--birthday); }
    .bg-prank { background-color: var(--prank); }
    .text-prank { color: var(--prank); }
    .bg-confession { background-color: var(--confession); }
    .text-confession { color: var(--confession); }
    .scroll-smooth { scroll-behavior: smooth; }
  </style>
</body>
</html>
  `;
}
