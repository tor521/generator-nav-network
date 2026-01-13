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

// 生成主页导航页面（无下滑Tab布局+配色优化）
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

  <main class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 核心优化：Tab头部 - 无需下滑，点击切换分类 -->
    <div class="bg-white rounded-2xl shadow-sm p-1 mb-6">
      <div class="flex flex-wrap justify-center gap-2" id="tab-header">
        <button onclick="switchTab('festival', this)" class="tab-btn active bg-festival text-white px-6 py-3 rounded-xl transition-all font-medium">
          <i class="fa-solid fa-calendar-days mr-2"></i>节日
        </button>
        <button onclick="switchTab('birthday', this)" class="tab-btn bg-gray-100 text-gray-700 px-6 py-3 rounded-xl transition-all font-medium">
          <i class="fa-solid fa-cake-candles mr-2"></i>生日
        </button>
        <button onclick="switchTab('prank', this)" class="tab-btn bg-gray-100 text-gray-700 px-6 py-3 rounded-xl transition-all font-medium">
          <i class="fa-solid fa-face-grin-tongue mr-2"></i>整蛊
        </button>
        <button onclick="switchTab('confession', this)" class="tab-btn bg-gray-100 text-gray-700 px-6 py-3 rounded-xl transition-all font-medium">
          <i class="fa-solid fa-heart mr-2"></i>表白
        </button>
      </div>
    </div>

    <!-- 核心优化：Tab内容区 - 对应分类生成面板，默认显示节日 -->
    <div id="tab-content" class="min-h-[400px]">
      <!-- 节日面板（默认显示） -->
      <div id="festival-tab" class="tab-panel active">
        ${generateCategoryPanel('festival', '节日', 'festival')}
      </div>
      <!-- 生日面板（默认隐藏） -->
      <div id="birthday-tab" class="tab-panel hidden">
        ${generateCategoryPanel('birthday', '生日', 'birthday')}
      </div>
      <!-- 整蛊面板（默认隐藏） -->
      <div id="prank-tab" class="tab-panel hidden">
        ${generateCategoryPanel('prank', '整蛊', 'prank')}
      </div>
      <!-- 表白面板（默认隐藏） -->
      <div id="confession-tab" class="tab-panel hidden">
        ${generateCategoryPanel('confession', '表白', 'confession')}
      </div>
    </div>
  </main>

  <!-- 返回顶部按钮（保留，兼容后续拓展） -->
  <button id="backToTop" class="fixed bottom-8 right-8 bg-primary text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center opacity-0 invisible transition-all hover:bg-primary/90">
    <i class="fa-solid fa-arrow-up"></i>
  </button>

  <footer class="bg-white shadow-sm mt-16 py-8">
    <div class="container mx-auto px-4 text-center text-gray-500">
      <p class="text-lg">基于 Cloudflare Workers + KV 构建 | 模板可无限拓展</p>
    </div>
  </footer>

  <script>
    // 返回顶部按钮逻辑
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

    // 核心优化：Tab切换逻辑（无需下滑，直接切换面板）
    function switchTab(category, btnEl) {
      // 1. 切换Tab按钮样式
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-festival', 'bg-birthday', 'bg-prank', 'bg-confession', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
      });
      btnEl.classList.add('active', `bg-${category}`, 'text-white');
      btnEl.classList.remove('bg-gray-100', 'text-gray-700');

      // 2. 切换Tab内容面板
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.add('hidden');
        panel.classList.remove('active');
      });
      const targetPanel = document.getElementById(`${category}-tab`);
      targetPanel.classList.remove('hidden');
      targetPanel.classList.add('active');

      // 3. 加载对应分类历史记录（确保切换后历史记录同步）
      loadHistory(category);
    }

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

    // 一键复制链接功能
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

    // 生成分享链接（核心功能保留，配色优化）
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
        // 填充链接到页面展示区域
        const linkInput = document.getElementById(\`\${category}-share-link\`);
        const linkArea = document.getElementById(\`\${category}-share-area\`);
        linkInput.value = data.data.shareUrl;
        linkArea.classList.remove('hidden'); // 显示链接区域
        
        // 提示生成成功
        alert(\`生成成功！链接已展示在页面，可直接复制～\`);
        loadHistory(category);
      } else {
        alert(data.msg);
      }
    }

    // 初始化加载默认分类（节日）历史记录
    window.onload = () => {
      loadHistory('festival');
    };
  </script>
  <style>
    :root {
      /* 核心优化：更换配色 - 更醒目、更高辨识度 */
      --primary: #0F172A; /* 主标题深灰蓝，更稳重 */
      --festival: #16A34A; /* 节日：清新森绿（替代原浅绿） */
      --birthday: #F97316; /* 生日：暖橙红（替代原浅黄） */
      --prank: #EF4444; /* 整蛊：活力红（替代原粉红） */
      --confession: #8B5CF6; /* 表白：梦幻紫（保留优化，更饱和） */
    }

    /* 分类配色映射 */
    .bg-festival { background-color: var(--festival); }
    .text-festival { color: var(--festival); }
    .bg-birthday { background-color: var(--birthday); }
    .text-birthday { color: var(--birthday); }
    .bg-prank { background-color: var(--prank); }
    .text-prank { color: var(--prank); }
    .bg-confession { background-color: var(--confession); }
    .text-confession { color: var(--confession); }

    /* Tab样式 */
    .tab-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .tab-btn.active {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .tab-panel {
      transition: opacity 0.3s ease-in-out;
    }
    .tab-panel.hidden {
      display: none;
      opacity: 0;
    }
    .tab-panel.active {
      display: block;
      opacity: 1;
    }

    /* 平滑滚动 */
    .scroll-smooth {
      scroll-behavior: smooth;
    }
  </style>
</body>
</html>
  `;
}

// 生成分类操作面板（配色优化：生成按钮&字体更换）
function generateCategoryPanel(category, title, colorKey) {
  let formHtml = '';
  // 表单保留必填提示，仅优化配色
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

      <!-- 核心优化：更换生成分享链接按钮配色（更醒目） -->
      <button onclick="generateShare('${category}')" class="bg-${colorKey} text-white px-6 py-3 rounded-lg hover:bg-${colorKey}/90 transition-all shadow hover:shadow-${colorKey}/30 font-medium">
        <i class="fa-solid fa-link mr-2"></i>生成分享链接
      </button>
      <button onclick="deleteAllHistory('${category}')" class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all ml-4 font-medium">
        <i class="fa-solid fa-trash-can mr-2"></i>清空历史
      </button>

      <!-- 分享链接展示区域（保留核心功能） -->
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

      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">生成历史</h3>
        <div id="${category}-history-list" class="max-h-60 overflow-y-auto">
          <!-- 历史记录由JS加载 -->
        </div>
      </div>
    </div>
  `;
}
