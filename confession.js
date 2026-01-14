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

  // 模板2：清新森系简约风（结构大幅重构，低饱和柔和配色，无高对比，功能完全保留）
  else if (template === '2') {
    pageContent = `
      <!-- 结构大幅重构：采用「外层容器+卡片头部模块+内容主体模块+底部装饰模块」的模块化布局，区别于模板1的单层居中卡片 -->
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F0F7F4] to-[#E6F8F3]">
        <!-- 核心卡片：圆角适度（区别于模板1的大圆角），模块化分区，无高对比色系 -->
        <div class="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-lg border border-[#D9ECE6]">
          <!-- 模块1：卡片头部（左侧图标+右侧文字，横向布局，区别于模板1的通栏渐变居中） -->
          <div class="flex items-center p-5 bg-[#F8FCFB] border-b border-[#D9ECE6]">
            <div class="w-12 h-12 bg-[#B8E0D2] rounded-lg flex items-center justify-center mr-4">
              <i class="fa-solid fa-leaf text-[#73B695] text-xl"></i>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-semibold text-[#5A8F7B]">致 ${confName}</h2>
              <p class="text-[#8CBFA7] text-sm mt-1">一份藏在时光里的心意</p>
            </div>
          </div>

          <!-- 模块2：内容主体（上下留白+内层卡片，区别于模板1的直接居中渲染） -->
          <div class="p-6">
            <div id="confession-content-2" class="bg-[#FCFEFD] rounded-lg p-7 text-[#4A6F60] leading-relaxed min-h-[180px] w-full word-break break-all shadow-sm border border-[#E8F3EF] font-normal"></div>
          </div>

          <!-- 模块3：底部装饰（左侧分隔线+右侧图标组，区别于模板1的居中爱心脉冲） -->
          <div class="p-5 bg-[#F8FCFB] border-t border-[#D9ECE6]">
            <div class="flex items-center justify-between">
              <div class="w-16 h-0.5 bg-gradient-to-r from-[#B8E0D2] to-transparent"></div>
              <div class="flex gap-4">
                <i class="fa-solid fa-flower text-[#95C4B2]"></i>
                <i class="fa-solid fa-seedling text-[#73B695]"></i>
                <i class="fa-solid fa-heart text-[#B8E0D2]"></i>
              </div>
              <div class="w-16 h-0.5 bg-gradient-to-l from-[#B8E0D2] to-transparent"></div>
            </div>
            <p class="text-center text-[#8CBFA7] text-xs mt-4">愿山河无恙，岁月温柔</p>
          </div>
        </div>
      </div>

      <script>
        // 完全保留所有原有核心功能，逻辑无任何改动
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
          /* 低饱和森系配色，无高对比明暗，区别于模板1的粉蓝渐变 */
          @keyframes fadeIn {
            from { opacity: 0.7; }
            to { opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
          /* 辅助样式：支撑模块化布局，无旋转、无高对比 */
          .bg-gradient-to-br.from-\\[\#F0F7F4\\].to-\\[\#E6F8F3\\] {
            background: linear-gradient(to bottom right, #F0F7F4, #E6F8F3);
          }
        \`;
        document.head.appendChild(style);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}
