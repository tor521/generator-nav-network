import { generateCommonHead } from './utils.js';
// 生成整蛊分类分享页面（模板1/2）
export function generatePrankPage(data) {
  const { template } = data;
  let pageContent = '';
  // 模板1：清新卡通风（马卡龙色系）
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 to-mint-50">
        <!-- 卡片：圆润卡通造型，浅色系边框 -->
        <div class="w-full max-w-md bg-white rounded-3xl shadow-md overflow-hidden border-2 border-mint-100 transform hover:scale-[1.02] transition-transform">
          <!-- 头部：马卡龙渐变色，卡通图标 -->
          <div class="bg-gradient-to-r from-sky-300 to-mint-300 py-6 text-center">
            <<i class="fa-solid fa-egg text-5xl text-white mb-3 shadow-sm"></</i>
            <h2 class="text-2xl font-bold text-white tracking-wide">快乐盲盒机</h2>
            <p class="text-white/80 text-sm mt-1">戳我解锁小惊喜～</p>
          </div>
          <!-- 主体：宽松内边距，卡通按钮 -->
          <div class="p-10 text-center">
            <button id="prank-btn" class="bg-mint-300 hover:bg-mint-400 text-white py-4 px-10 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
              点击拆盲盒🎁
            </button>
            <!-- 结果文案：卡通字体感，马卡龙主色 -->
            <div id="prank-result" class="mt-10 text-2xl font-bold text-sky-500 hidden">
              有个蛋给你，你个二货🤪
            </div>
            <!-- 装饰元素：卡通分割线 -->
            <div class="flex items-center justify-center mt-8">
              <div class="w-16 h-1 bg-sky-100 rounded-full"></div>
              <<i class="fa-solid fa-star text-xs text-sky-300 mx-2"></</i>
              <div class="w-16 h-1 bg-sky-100 rounded-full"></div>
            </div>
            <!-- 底部小标识：卡通风格 -->
            <p class="mt-6 text-mint-500 text-sm font-medium">CUTE PRANK · 2024</p>
          </div>
        </div>
      </div>
      <script>
        document.getElementById('prank-btn').addEventListener('click', () => {
          const btn = document.getElementById('prank-btn');
          const result = document.getElementById('prank-result');
          // 按钮状态变化
          btn.disabled = true;
          btn.textContent = '拆盒中...';
          btn.classList.remove('hover:scale-[1.02]', 'hover:-translate-y-1');
          btn.classList.add('opacity-80', 'cursor-not-allowed');
          // 延迟显示结果（核心功能不变）
          setTimeout(() => {
            btn.classList.add('hidden');
            result.classList.remove('hidden');
            // 去掉页面抖动，仅保留文案显示
          }, 1500);
        });
      </script>
    `;
  }
  // 模板2：轻奢高级风（保留原逻辑，仅作对比参考）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-[#1A1A1A]">
        <div class="w-full max-w-md bg-[#2D2D2D] rounded-3xl shadow-2xl overflow-hidden border border-[#444444]">
          <div class="bg-gradient-to-r from-[#D4AF37] to-[#F0E68C] py-6 text-center">
            <<i class="fa-solid fa-gift text-4xl text-[#1A1A1A] mb-2"></</i>
            <h2 class="text-2xl font-bold text-[#1A1A1A] tracking-wider">惊喜礼盒</h2>
          </div>
          <div class="p-8 text-center">
            <button id="prank-btn-2" class="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] py-3 px-8 rounded-full font-semibold transition-all hover:bg-[#D4AF37] hover:text-[#1A1A1A] shadow-md hover:shadow-amber-900/20">
              解锁专属惊喜
            </button>
            <div id="prank-result-2" class="mt-8 text-xl font-bold text-[#D4AF37] hidden"></div>
            <div class="w-24 h-1 bg-[#444444] mx-auto mt-6 rounded-full"></div>
            <p class="mt-6 text-[#888888] text-sm">LUXURY SURPRISE · 2024</p>
          </div>
        </div>
      </div>
      <script>
        document.getElementById('prank-btn-2').addEventListener('click', () => {
          const btn = document.getElementById('prank-btn-2');
          const result = document.getElementById('prank-result-2');
          btn.disabled = true;
          btn.textContent = '解锁中...';
          btn.classList.add('opacity-70');
          setTimeout(() => {
            btn.classList.add('hidden');
            result.classList.remove('hidden');
            result.textContent = '恭喜解锁：空气一份💨 奢华无上限～';
            document.body.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            let shakeCount = 0;
            const shakeInterval = setInterval(() => {
              if (shakeCount < 3) {
                document.body.style.transform = \`translate(\${Math.random()*8-4}px, \${Math.random()*8-4}px)\`;
                shakeCount++;
              } else {
                clearInterval(shakeInterval);
                document.body.style.transform = 'translate(0,0)';
              }
            }, 150);
          }, 2000);
        });
      </script>
    `;
  }
  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}
