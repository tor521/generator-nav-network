import { generateCategoryContent } from '../utils.js';

/**
 * 生成主页HTML（导航页）
 * @param {object} contentMap 各分类内容映射
 * @returns {string} 主页HTML
 */
export function generateHomeHTML(contentMap) {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@一条无聊的桀 - 专属定制模板平台</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#165DFF',
            festival: '#10B981',
            birthday: '#F59E0B',
            prank: '#F43F5E',
            confession: '#8B5CF6'
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 min-h-screen font-sans text-gray-800">
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-center text-primary tracking-tight">
        专属定制模板平台
      </h1>
      <p class="text-gray-500 text-center mt-2 text-lg">节日 · 生日 · 整蛊 · 表白 | 一键生成直达链接</p>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="flex flex-wrap justify-center gap-2 md:gap-6 mb-10">
      <button class="tab-btn px-6 py-3 rounded-t-lg transition-all text-lg border-b-3 border-primary text-primary font-bold" data-category="festival">
        <i class="fa-solid fa-calendar-days mr-2"></i>节日
      </button>
      <button class="tab-btn px-6 py-3 rounded-t-lg transition-all text-lg border-b-3 border-transparent hover:bg-gray-100" data-category="birthday">
        <i class="fa-solid fa-cake-candles mr-2"></i>生日
      </button>
      <button class="tab-btn px-6 py-3 rounded-t-lg transition-all text-lg border-b-3 border-transparent hover:bg-gray-100" data-category="prank">
        <i class="fa-solid fa-face-grin-tongue mr-2"></i>整蛊
      </button>
      <button class="tab-btn px-6 py-3 rounded-t-lg transition-all text-lg border-b-3 border-transparent hover:bg-gray-100" data-category="confession">
        <i class="fa-solid fa-heart mr-2"></i>表白
      </button>
    </div>

    <div class="category-content" id="festival-content">
      ${contentMap.festivalContent}
    </div>
    <div class="category-content hidden" id="birthday-content">
      ${contentMap.birthdayContent}
    </div>
    <div class="category-content hidden" id="prank-content">
      ${contentMap.prankContent}
    </div>
    <div class="category-content hidden" id="confession-container">
      ${contentMap.confessionContent}
    </div>
  </main>

  <footer class="bg-white shadow-sm mt-16 py-8">
    <div class="container mx-auto px-4 text-center text-gray-500">
      <p class="text-lg">基于 Cloudflare Workers + TIME_KV 构建 | 模板可无限拓展</p>
    </div>
  </footer>

  <script>
    let currentCategory = 'festival';

    // 标签切换（原有逻辑）
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('border-primary', 'text-primary', 'font-bold');
          b.classList.add('border-transparent', 'hover:bg-gray-100');
        });
        document.querySelectorAll('.category-content').forEach(c => c.classList.add('hidden'));
        btn.classList.remove('border-transparent', 'hover:bg-gray-100');
        btn.classList.add('border-primary', 'text-primary', 'font-bold');
        currentCategory = btn.dataset.category;
        const containerId = currentCategory === 'confession' ? 'confession-container' : \`\${currentCategory}-content\`;
        document.getElementById(containerId).classList.remove('hidden');
        loadHistory(currentCategory);
      });
    });

    // 生成链接按钮逻辑（原有逻辑）
    document.querySelectorAll('.generate-share-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        try {
          const category = this.dataset.category;
          const template = document.querySelector(\`.template-select[data-category="\${category}"]\`).value;
          
          let previewData = {};
          let content = '';
          if (category === 'festival') {
            previewData.name = document.getElementById('festival-name').value || '春节';
            previewData.date = document.getElementById('festival-date').value;
            content = \`\${previewData.name}倒计时\`;
          } else if (category === 'birthday') {
            previewData.name = document.getElementById('birthday-name').value || '张三';
            previewData.date = document.getElementById('birthday-date').value;
            content = \`\${previewData.name}的生日倒计时\`;
          } else if (category === 'prank') {
            previewData = { type: 'prank' };
            content = '整蛊盲盒';
          } else if (category === 'confession') {
            previewData.name = document.getElementById('confession-name').value || '李四';
            previewData.content = document.getElementById('confession-content').value;
            content = previewData.content;
          }

          const res = await fetch('/api/generate-share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, template, content, previewData })
          });
          const data = await res.json();
          if (data.code === 0) {
            alert(\`生成成功：\${data.data.shareUrl}\`);
            loadHistory(category);
          } else {
            alert(data.msg);
          }
        } catch (e) {
          alert('生成失败：' + e.message);
        }
      });
    });

    // 加载历史记录（原有逻辑）
    async function loadHistory(category) {
      try {
        const res = await fetch(\`/api/get-history?category=\${category}\`);
        const data = await res.json();
        if (data.code === 0) {
          const historyListEl = document.getElementById(\`\${category}-history-list\`);
          historyListEl.innerHTML = '';
          if (data.data.length === 0) {
            historyListEl.innerHTML = '<div class="text-gray-400 text-center py-4">暂无生成记录</div>';
            return;
          }
          data.data.forEach(item => {
            const el = document.createElement('div');
            el.className = 'bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center';
            el.innerHTML = \`
              <div>
                <div class="text-lg font-semibold text-gray-800">
                  <a href="\${item.shareUrl}" target="_blank" class="hover:text-primary">
                    <i class="fa-solid fa-link mr-2"></i>\${item.shareUrl}
                  </a>
                </div>
                <div class="text-gray-500 mt-1">\${item.createTimeText} | 模板\${item.template}</div>
              </div>
              <div class="mt-3 md:mt-0 flex gap-3">
                <button class="delete-single-btn px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all" 
                  data-category="\${category}" 
                  data-id="\${item.id}" 
                  data-shareid="\${item.shareId}">
                  <i class="fa-solid fa-trash mr-1"></i>删除
                </button>
                <button class="copy-btn px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all" 
                  data-url="\${item.shareUrl}">
                  <i class="fa-solid fa-copy mr-1"></i>复制
                </button>
              </div>
            \`;
            historyListEl.appendChild(el);
          });

          // 绑定删除单条事件
          document.querySelectorAll('.delete-single-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
              if (!confirm('确定删除这条记录吗？')) return;
              const category = this.dataset.category;
              const id = this.dataset.id;
              const shareId = this.dataset.shareid;
              try {
                const res = await fetch('/api/delete-single-history', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ category, id, shareId })
                });
                const data = await res.json();
                if (data.code === 0) {
                  alert('删除成功');
                  loadHistory(category);
                } else {
                  alert(data.msg);
                }
              } catch (e) {
                alert('删除失败：' + e.message);
              }
            });
          });

          // 绑定复制事件
          document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
              const url = this.dataset.url;
              await navigator.clipboard.writeText(url);
              alert('复制成功：' + url);
            });
          });

          // 一键删除分类所有记录按钮
          const deleteAllBtn = document.createElement('button');
          deleteAllBtn.className = 'w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-lg transition-all';
          deleteAllBtn.innerHTML = '<i class="fa-solid fa-trash-can mr-2"></i>一键删除所有记录';
          deleteAllBtn.addEventListener('click', async function() {
            if (!confirm('确定删除该分类下所有记录吗？')) return;
            try {
              const res = await fetch('/api/delete-all-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category })
              });
              const data = await res.json();
              if (data.code === 0) {
                alert('全部删除成功');
                loadHistory(category);
              } else {
                alert(data.msg);
              }
            } catch (e) {
              alert('删除失败：' + e.message);
            }
          });
          historyListEl.appendChild(deleteAllBtn);
        }
      } catch (e) {
        alert('加载历史失败：' + e.message);
      }
    }

    // 初始化加载节日分类历史
    loadHistory('festival');
  </script>
</body>
</html>
  `;
}

// 生成节日分类内容（仅封装分类HTML）
export function generateFestivalContent() {
  return generateCategoryContent('festival', '节日', 'festival');
}