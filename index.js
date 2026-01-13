import { generateCommonHead, getCategoryHistory, createShareRecord } from './utils.js';
import { generateFestivalPage } from './festival.js';
import { generateBirthdayPage } from './birthday.js';
import { generatePrankPage } from './prank.js';
import { generateConfessionPage } from './confession.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. 主页导航路由
    if (url.pathname === '/') {
      return new Response(generateIndexPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 2. 分享链接路由（分发到对应分类模板）
    if (url.pathname.startsWith('/share/')) {
      const shareId = url.pathname.split('/')[2];
      if (!shareId) return new Response('无效链接', { status: 404 });
      
      const record = await env.TIME_KV.get(`share:${shareId}`);
      if (!record) return new Response('链接已失效', { status: 404 });
      
      const data = JSON.parse(record);
      let pageHtml = '';
      // 根据分类分发到对应文件的渲染函数
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

    // 3. API - 获取分类历史记录
    if (url.pathname === '/api/get-history' && request.method === 'GET') {
      const category = url.searchParams.get('category');
      if (!category) return new Response(JSON.stringify({ code: -1, msg: '缺少分类参数' }), { headers: { 'Content-Type': 'application/json' } });
      
      const historyList = await getCategoryHistory(env, category);
      return new Response(JSON.stringify({ code: 0, data: historyList }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 4. API - 生成分享链接
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

    // 5. API - 删除单条历史记录
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

    // 6. API - 一键删除分类所有记录
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

    // 7. 404 路由
    return new Response('页面不存在', { status: 404 });
  },
};

// 生成主页导航页面（优化人性化+链接可见性）
function generateIndexPage() {
  return generateCommonHead() + `
<body class="bg-gray-50 min-h-screen font-sans text-gray-800 scroll-smooth">
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-6">
      <!-- 优化：更接地气的标题+描述，增强引导性 -->
      <h1 class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-center text-primary tracking-tight">
        专属模板生成平台
      </h1>
      <p class="text-gray-500 text-center mt-2 text-lg">节日 · 生日 · 整蛊 · 表白 | 一键生成可分享链接，轻松传递心意</p>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 节日生成入口（优化：增强交互反馈） -->
      <a href="#festival" class="block bg-festival/10 rounded-2xl p-6 text-center hover:bg-festival/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-calendar-days text-4xl text-festival mb-4"></i>
        <h2 class="text-xl font-bold text-festival">节日生成网</h2>
        <p class="mt-2 text-gray-600 text-sm">模板1（经典）| 模板2（国风）</p>
      </a>

      <!-- 生日生成入口（优化：增强交互反馈） -->
      <a href="#birthday" class="block bg-birthday/10 rounded-2xl p-6 text-center hover:bg-birthday/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-cake-candles text-4xl text-birthday mb-4"></i>
        <h2 class="text-xl font-bold text-birthday">生日生成网</h2>
        <p class="mt-2 text-gray-600 text-sm">模板1（经典）| 模板2（极简）</p>
      </a>

      <!-- 整蛊生成入口（优化：增强交互反馈） -->
      <a href="#prank" class="block bg-prank/10 rounded-2xl p-6 text-center hover:bg-prank/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-face-grin-tongue text-4xl text-prank mb-4"></i>
        <h2 class="text-xl font-bold text-prank">整蛊生成网</h2>
        <p class="mt-2 text-gray-600 text-sm">模板1（经典）| 模板2（轻奢）</p>
      </a>

      <!-- 表白生成入口（优化：增强交互反馈） -->
      <a href="#confession" class="block bg-confession/10 rounded-2xl p-6 text-center hover:bg-confession/20 transition-all hover:shadow-md hover:scale-[1.02]">
        <i class="fa-solid fa-heart text-4xl text-confession mb-4"></i>
        <h2 class="text-xl font-bold text-confession">表白生成网</h2>
        <p class="mt-2 text-gray-600 text-sm">模板1（高级）| 模板2（卡通）</p>
      </a>
    </div>

    <!-- 各分类操作区域 -->
    <div class="mt-16" id="festival">
      ${generateCategoryPanel('festival', '节日', 'festival')}
    </div>
    <div class="mt-16" id="birthday">
      ${generateCategoryPanel('birthday', '生日', 'birthday')}
    </div>
    <div class="mt-16" id="prank">
      ${generateCategoryPanel('prank', '整蛊', 'prank')}
    </div>
    <div class="mt-16" id="confession">
      ${generateCategoryPanel('confession', '表白', 'confession')}
    </div>
  </main>

  <!-- 优化：新增返回顶部按钮，方便长页面操作 -->
  <button id="backToTop" class="fixed bottom-8 right-8 bg-primary text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center opacity-0 invisible transition-all hover:bg-primary/90">
    <i class="fa-solid fa-arrow-up"></i>
  </button>

  <footer class="bg-white shadow-sm mt-16 py-8">
    <div class="container mx-auto px-4 text-center text-gray-500">
      <p class="text-lg">基于 Cloudflare Workers + KV 构建 | 模板可无限拓展</p>
    </div>
  </footer>

  <script>
    // 优化：返回顶部按钮逻辑
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible');
        backToTopBtn.classList.remove('opacity-100', 'visible');
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 加载历史记录
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

    // 删除单条历史
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

    // 一键删除所有
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

    // 优化：一键复制链接功能
    async function copyShareUrl(inputId) {
      const input = document.getElementById(inputId);
      if (!input.value) return alert('暂无可复制的链接～');
      try {
        await navigator.clipboard.writeText(input.value);
        // 复制成功反馈
        const copyBtn = input.nextElementSibling;
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>已复制';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 1500);
      } catch (err) {
        // 兼容不支持剪贴板的浏览器
        input.select();
        document.execCommand('copy');
        alert('已选中链接，可手动复制～');
      }
    }

    // 生成分享链接（核心优化：解决链接看不见问题，新增页面展示+复制）
    async function generateShare(category) {
      // 禁用生成按钮，防止重复点击
      const generateBtn = document.querySelector(\`button[onclick="generateShare('\${category}')"]\`);
      const originalText = generateBtn.innerHTML;
      generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>生成中...';
      generateBtn.disabled = true;

      // 根据分类获取参数
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
      
      // 恢复按钮状态
      generateBtn.innerHTML = originalText;
      generateBtn.disabled = false;

      if (data.code === 0) {
        // 核心优化：将链接填充到页面展示区域，让用户清晰看见
        const linkInput = document.getElementById(\`\${category}-share-link\`);
        const linkArea = document.getElementById(\`\${category}-share-area\`);
        linkInput.value = data.data.shareUrl;
        linkArea.classList.remove('hidden'); // 显示链接区域
        
        // 提示生成成功，同时保留用户感知
        alert(\`生成成功！链接已展示在页面，可直接复制～\`);
        loadHistory(category);
      } else {
        alert(data.msg);
      }
    }

    // 初始化加载所有分类历史（优化：更全面的初始化）
    window.onload = () => {
      loadHistory('festival');
      loadHistory('birthday');
      loadHistory('prank');
      loadHistory('confession');
    };
  </script>
  <style>
    :root {
      --primary: #165DFF;
      --festival: #10B981;
      --birthday: #F59E0B;
      --prank: #F43F5E;
      --confession: #8B5CF6;
    }
    .bg-festival\\/10 { background-color: rgba(16, 185, 129, 0.1); }
    .bg-festival\\/20 { background-color: rgba(16, 185, 129, 0.2); }
    .text-festival { color: var(--festival); }
    .bg-birthday\\/10 { background-color: rgba(245, 158, 11, 0.1); }
    .bg-birthday\\/20 { background-color: rgba(245, 158, 11, 0.2); }
    .text-birthday { color: var(--birthday); }
    .bg-prank\\/10 { background-color: rgba(244, 63, 94, 0.1); }
    .bg-prank\\/20 { background-color: rgba(244, 63, 94, 0.2); }
    .text-prank { color: var(--prank); }
    .bg-confession\\/10 { background-color: rgba(139, 92, 246, 0.1); }
    .bg-confession\\/20 { background-color: rgba(139, 92, 246, 0.2); }
    .text-confession { color: var(--confession); }
    /* 优化：平滑滚动 */
    .scroll-smooth {
      scroll-behavior: smooth;
    }
  </style>
</body>
</html>
  `;
}

// 生成分类操作面板（核心优化：新增分享链接展示区域+一键复制）
function generateCategoryPanel(category, title, colorKey) {
  let formHtml = '';
  // 根据分类生成不同的表单（优化：增加必填提示）
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

  return `
    <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
      <h2 class="text-2xl font-bold text-${colorKey} mb-6">${title}生成工具</h2>
      <div class="mb-6">
        <label class="block text-gray-700 mb-2">选择模板</label>
        <select class="template-select w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${colorKey}/50 focus:border-${colorKey}" data-category="${category}">
          <option value="1">模板1（经典版）</option>
          <option value="2">模板2（拓展版）</option>
        </select>
      </div>
      ${formHtml}
      <button onclick="generateShare('${category}')" class="bg-${colorKey} text-white px-6 py-3 rounded-lg hover:bg-${colorKey}/90 transition-all shadow hover:shadow-${colorKey}/20">
        <i class="fa-solid fa-link mr-2"></i>生成分享链接
      </button>
      <button onclick="deleteAllHistory('${category}')" class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all ml-4">
        <i class="fa-solid fa-trash-can mr-2"></i>清空历史
      </button>

      <!-- 核心优化：新增分享链接展示区域（默认隐藏，生成成功后显示） -->
      <div id="${category}-share-area" class="mt-6 hidden">
        <div class="border border-${colorKey}/30 rounded-lg p-4 bg-${colorKey}/5">
          <h3 class="text-sm text-gray-700 mb-2">生成结果（可直接复制）</h3>
          <div class="flex gap-2">
            <input type="text" id="${category}-share-link" class="flex-1 px-4 py-2 border rounded-lg bg-white text-sm break-all" readonly>
            <button onclick="copyShareUrl('${category}-share-link')" class="bg-${colorKey}/80 text-white px-4 py-2 rounded-lg hover:bg-${colorKey} transition-all whitespace-nowrap">
              <i class="fa-solid fa-copy mr-1"></i>复制链接
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">生成历史</h3>
        <div id="${category}-history-list" class="max-h-60 overflow-y-auto">
          <!-- 历史记录由JS加载 -->
        </div>
      </div>
    </div>
  `;
}
