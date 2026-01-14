import { generateCommonHead } from './utils.js';

// 生成表白分类分享页面（模板1/2）
export function generateConfessionPage(data) {
  const { template, previewData } = data;
  const confName = previewData.name;
  const confContent = previewData.content
    .replace(/\\n/g, '<br>')
    .replace(/`/g, '\\`')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
  let pageContent = '';

  // 模板1：奶油粉蓝高级版（保持不变，作为风格对照）
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream-blue to-cream-pink">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-cream-border relative">
          <div class="bg-gradient-to-r from-sky-mist to-peach-bloom py-8 text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full opacity-15">
              <i class="fa-solid fa-heart text-white text-9xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
            </div>
            <h2 class="text-3xl font-bold text-white tracking-wider relative z-10">致 ${confName}</h2>
            <p class="text-cream-white mt-2 relative z-10">一份专属的心意 💌</p>
            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-16 h-2"></div>
          </div>
          <div class="p-8 text-center">
            <div id="confession-content" class="bg-gradient-to-r from-cream-bg to-cream-light rounded-2xl p-8 text-gray-700 leading-relaxed mb-4 min-h-[180px] w-full word-break break-all shadow-sm border border-cream-border"></div>
            <div class="flex justify-center gap-2 mt-6">
              <i class="fa-solid fa-heart text-peach-bloom-light animate-pulse"></i>
              <i class="fa-solid fa-heart text-sky-mist-light animate-pulse delay-100"></i>
              <i class="fa-solid fa-heart text-peach-bloom animate-pulse delay-200"></i>
            </div>
            <p class="mt-4 text-gray-600 text-sm">愿这份心意能抵达你心底</p>
          </div>
        </div>
      </div>
      <script>
        function typeWriterEffect(text, el, speed = 80) {
          let i = 0;
          el.innerHTML = '';
          const timer = setInterval(() => {
            if (i < text.length) {
              if (text.charAt(i) === '<' && text.substring(i, i+4) === '<br>') {
                el.innerHTML += '<br>';
                i += 4;
              } else {
                el.innerHTML += text.charAt(i);
                i++;
              }
            } else {
              clearInterval(timer);
              el.classList.add('animate-fadeIn');
            }
          }, speed);
        }
        const userInputContent = \`${confContent}\`;
        typeWriterEffect(userInputContent, document.getElementById('confession-content'));
        
        const style = document.createElement('style');
        style.textContent = \`
          :root {
            --cream-blue: #f5f9ff;
            --cream-pink: #fff5f7;
            --cream-border: #f0e6f8;
            --cream-bg: #ffffff;
            --cream-light: #faf6fb;
            --cream-white: #fffcfe;
            --sky-mist: #94b3fd;
            --sky-mist-light: #b4c7fd;
            --peach-bloom: #f8b8c8;
            --peach-bloom-light: #fcd7e0;
          }
          .bg-gradient-to-br.from-cream-blue.to-cream-pink {
            background: linear-gradient(to bottom right, var(--cream-blue), var(--cream-pink));
          }
          .border-cream-border { border-color: var(--cream-border); }
          .bg-gradient-to-r.from-sky-mist.to-peach-bloom {
            background: linear-gradient(to right, var(--sky-mist), var(--peach-bloom));
          }
          .text-cream-white { color: var(--cream-white); }
          .bg-gradient-to-r.from-cream-bg.to-cream-light {
            background: linear-gradient(to right, var(--cream-bg), var(--cream-light));
          }
          .text-sky-mist { color: var(--sky-mist); }
          .text-sky-mist-light { color: var(--sky-mist-light); }
          .text-peach-bloom { color: var(--peach-bloom); }
          .text-peach-bloom-light { color: var(--peach-bloom-light); }
          @keyframes fadeIn {
            from { opacity: 0.8; }
            to { opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          .animate-pulse { animation: pulse 1.5s infinite ease-in-out; }
        \`;
        document.head.appendChild(style);
      </script>
    `;
  }

  // 模板2：极简几何卡片+明暗对比风（完全重构结构，无旋转，与模板1风格鲜明区分）
  else if (template === '2') {
    pageContent = `
      <!-- 结构大幅重构：采用「外层遮罩+中层几何卡片+内层分区布局」，区别于模板1的单层卡片 -->
      <div class="min-h-screen flex items-center justify-center p-4 bg-[#1A1A2E]">
        <!-- 外层几何装饰遮罩（新增结构，模板1无此层级） -->
        <div class="w-full max-w-md relative">
          <div class="absolute inset-0 bg-[#0F3460] rounded-xl opacity-70 blur-sm"></div>
          <!-- 中层核心卡片（无任何旋转效果，几何直角+切角设计） -->
          <div class="relative w-full bg-white rounded-xl overflow-hidden shadow-[0_0_30px_rgba(11,223,255,0.5)] z-10">
            <!-- 顶部通栏：几何切角+纯色块，区别于模板1的渐变圆角栏 -->
            <div class="bg-[#E94560] py-5 px-6 relative">
              <!-- 几何切角装饰（模板1无此元素） -->
              <div class="absolute top-0 right-0 w-16 h-16">
                <div class="absolute inset-0 bg-white clip-path-triangle"></div>
              </div>
              <h2 class="text-2xl font-bold text-white tracking-wide">致 ${confName}</h2>
              <p class="text-[#FFEBEF] text-sm mt-1">专属心意 · 不负遇见</p>
            </div>
            
            <!-- 中间内容区：双列侧边装饰+主体内容，完全区别于模板1的居中单一区域 -->
            <div class="flex items-start">
              <!-- 左侧几何装饰条（新增结构，模板1无侧边装饰） -->
              <div class="w-2 bg-gradient-to-b from-[#00F5D4] to-[#E94560] h-full"></div>
              <!-- 右侧内容主体（打字机渲染区域） -->
              <div class="flex-1 p-6">
                <div id="confession-content-2" class="bg-[#F8F9FA] rounded-lg p-6 text-[#2D3436] leading-relaxed min-h-[180px] w-full word-break break-all shadow-inner border border-[#E0E0E0] font-sans"></div>
              </div>
            </div>
            
            <!-- 底部功能区：网格布局+图标装饰，区别于模板1的居中弹性布局 -->
            <div class="bg-[#F8F9FA] py-4 px-6 border-t border-[#E0E0E0]">
              <div class="flex justify-between items-center">
                <div class="flex gap-3">
                  <i class="fa-solid fa-star text-[#00F5D4]"></i>
                  <i class="fa-solid fa-heart text-[#E94560]"></i>
                  <i class="fa-solid fa-paper-plane text-[#0F3460]"></i>
                </div>
                <p class="text-[#6C757D] text-xs">愿岁月静好，温暖相伴</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        // 保留所有核心功能：打字机效果、内容替换、换行处理完全不变
        function typeWriterEffect(text, el, speed = 80) {
          let i = 0;
          el.innerHTML = '';
          const timer = setInterval(() => {
            if (i < text.length) {
              if (text.charAt(i) === '<' && text.substring(i, i+4) === '<br>') {
                el.innerHTML += '<br>';
                i += 4;
              } else {
                el.innerHTML += text.charAt(i);
                i++;
              }
            } else {
              clearInterval(timer);
              el.classList.add('animate-fadeIn');
            }
          }, speed);
        }
        const userInputContent = \`${confContent}\`;
        typeWriterEffect(userInputContent, document.getElementById('confession-content-2'));
        
        const style = document.createElement('style');
        style.textContent = \`
          /* 移除所有旋转相关样式，无任何旋转效果 */
          /* 新增几何切角样式，支撑模板2独特结构 */
          .clip-path-triangle {
            clip-path: polygon(100% 0, 0 0, 100% 100%);
          }
          /* 动画调整：保留淡入功能，风格改为硬朗简洁，区别于模板1的柔和动画 */
          @keyframes fadeIn {
            from { opacity: 0.7; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
          /* 辅助样式：支撑双列布局和几何装饰 */
          .bg-gradient-to-b.from-\\[\#00F5D4\\].to-\\[\#E94560\\] {
            background: linear-gradient(to bottom, #00F5D4, #E94560);
          }
          .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
        \`;
        document.head.appendChild(style);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}
