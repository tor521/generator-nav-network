import { generateCommonHead } from './utils.js';
// 生成整蛊分类分享页面（模板1/2）
export function generatePrankPage(data) {
  const { template } = data;
  let pageContent = '';
  // 模板1：优化版清新卡通风（马卡龙柔焦风，修正多余<+去掉旋转动效）
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <!-- 卡片：柔焦阴影+超大圆角，更显软萌 -->
        <div class="w-full max-w-md bg-white rounded-4xl shadow-lg shadow-pink-100/60 overflow-hidden border border-pink-100 transition-all duration-300 hover:shadow-pink-200/70">
          <!-- 头部：渐变更柔和，移除图标旋转动效，修正多余<符号 -->
          <div class="bg-gradient-to-r from-pink-200 to-purple-200 py-7 text-center relative overflow-hidden">
            <i class="fa-solid fa-gift text-5xl text-white mb-3 shadow-md"></i>
            <h2 class="text-2xl font-bold text-white tracking-wide drop-shadow-sm">软萌盲盒铺</h2>
            <p class="text-white/90 text-sm mt-1">点击开启快乐暴击～</p>
            <!-- 装饰小点：增加灵动性 -->
            <div class="absolute top-3 right-6 w-2 h-2 bg-white/70 rounded-full"></div>
            <div class="absolute bottom-4 left-8 w-1.5 h-1.5 bg-white/70 rounded-full"></div>
          </div>
          <!-- 主体：优化间距，按钮更精致，修正多余<符号 -->
          <div class="p-10 text-center">
            <button id="prank-btn" class="bg-gradient-to-r from-pink-300 to-purple-300 text-white py-4 px-12 rounded-full font-bold text-lg shadow-md shadow-pink-200/50 transition-all duration-300 hover:shadow-pink-300/70 hover:scale-105 active:scale-98">
              拆盲盒啦🎀
            </button>
            <!-- 结果文案：颜色更柔和，加轻微阴影 -->
            <div id="prank-result" class="mt-10 text-2xl font-bold text-purple-500 hidden drop-shadow-sm">
              恭喜你获得：极品西北风~🤪
            </div>
            <!-- 装饰分割线：虚线+小气泡，更可爱，修正多余<符号 -->
            <div class="flex items-center justify-center mt-8">
              <div class="w-14 h-0.5 bg-pink-100 rounded-full"></div>
              <i class="fa-solid fa-circle text-xs text-pink-200 mx-2"></i>
              <div class="w-14 h-0.5 bg-pink-100 rounded-full"></div>
            </div>
            <!-- 底部标识：加可爱图标，颜色呼应，修正多余<符号 -->
            <p class="mt-6 text-pink-400 text-sm font-medium flex items-center justify-center gap-2">
              <i class="fa-solid fa-heart text-xs"></i>
              CUTE PRANK · 2024
              <i class="fa-solid fa-heart text-xs"></i>
            </p>
          </div>
        </div>
      </div>
      <script>
        document.getElementById('prank-btn').addEventListener('click', () => {
          const btn = document.getElementById('prank-btn');
          const result = document.getElementById('prank-result');
          // 按钮状态优化：加载时保持渐变，增加禁用质感
          btn.disabled = true;
          btn.textContent = '努力拆盒中...';
          btn.classList.remove('hover:scale-105', 'active:scale-98');
          btn.classList.add('opacity-90', 'cursor-not-allowed', 'shadow-pink-100/30');
          // 核心功能不变：1.5秒后显示文案
          setTimeout(() => {
            btn.classList.add('hidden');
            result.classList.remove('hidden');
            // 给文案加淡入效果，更自然
            result.style.transition = 'opacity 0.5s';
            result.style.opacity = '0';
            setTimeout(() => {
              result.style.opacity = '1';
            }, 50);
          }, 1500);
        });
      </script>
    `;
  }
  // 模板2：轻奢高级风（保留原逻辑，对比参考）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-[#1A1A1A]">
        <div class="w-full max-w-md bg-[#2D2D2D] rounded-3xl shadow-2xl overflow-hidden border border-[#444444]">
          <div class="bg-gradient-to-r from-[#D4AF37] to-[#F0E68C] py-6 text-center">
            <i class="fa-solid fa-gift text-4xl text-[#1A1A1A] mb-2"></i>
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
