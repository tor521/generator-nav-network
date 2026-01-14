import { generateCommonHead } from './utils.js';

// 生成节日分类分享页面（模板1/2）
export function generateFestivalPage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  let pageContent = '';

  // 模板1：经典现代版（保持不变，作为风格对比）
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
          <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 py-6 text-center">
            <i class="fa-solid fa-calendar-days text-4xl text-white mb-2"></i>
            <h2 class="text-2xl font-bold text-white tracking-wider">${name}</h2>
          </div>
          <div class="p-8 text-center">
            <div id="festival-countdown" class="text-2xl font-semibold text-gray-700 my-6"></div>
            <div class="w-24 h-1 bg-emerald-200 mx-auto rounded-full"></div>
            <p class="mt-6 text-gray-500 text-sm">专属定制 · 美好时刻</p>
          </div>
        </div>
      </div>
      <script>
        function updateCountdown() {
          const now = new Date();
          const targetDate = new Date('${date}');
          const nextTargetDate = new Date(targetDate);
          if (nextTargetDate < now) nextTargetDate.setFullYear(now.getFullYear() + 1);
          const diffTime = nextTargetDate - now - 28800000;
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

          const isToday = now.getFullYear() === targetDate.getFullYear() &&
                          now.getMonth() === targetDate.getMonth() &&
                          now.getDate() === targetDate.getDate();
          const isPassed = !isToday && targetDate < now && nextTargetDate.getFullYear() > now.getFullYear();
          
          let tipText = '';
          if (isToday) tipText = '祝你「${name}」快乐无忧！';
          else if (isPassed) tipText = '「${name}」已过，但美好永存，天天开心～';
          else tipText = '距离${name}还有 ' + days + '天 ' + hours + '时 ' + minutes + '分 ' + seconds + '秒';
          
          document.getElementById('festival-countdown').textContent = tipText;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 模板2：国风新中式（修复符号泄露+优化配色+强化中式元素）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><pattern id=\'bg-pattern\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'><path d=\'M0 10h20M10 0v20\' stroke=\'%23E8DFD0\' stroke-width=\'0.5\' fill=\'none\'/></pattern><rect width=\'100%\' height=\'100%\' fill=\'url(%23bg-pattern)\'/><rect width=\'100%\' height=\'100%\' fill=\'%23F5F0E8\' fill-opacity=\'0.95\'/></svg>')]">
        <!-- 核心容器：中式卷轴风格，彻底区别于模板1的圆角卡片 -->
        <div class="w-full max-w-md relative">
          <!-- 中式卷轴顶部 -->
          <div class="w-full h-8 bg-[#D4B996] rounded-t-lg shadow-md flex items-center justify-center">
            <div class="w-16 h-1 bg-[#A67C52] rounded-full"></div>
          </div>
          <!-- 卷轴主体：仿古宣纸质感 -->
          <div class="bg-[#F9F3E8] rounded-b-lg shadow-xl border-l-2 border-r-2 border-[#D4B996] p-6 md:p-8 relative overflow-hidden">
            <!-- 背景中式暗纹：梅兰竹菊简化纹（无符号泄露） -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><path d=\'M50 20C60 10 70 20 80 15C90 10 95 30 85 40C75 50 60 45 50 55C40 45 25 50 15 40C5 30 10 10 20 15C30 20 40 10 50 20Z\' fill=\'none\' stroke=\'%23D4B996\' stroke-width=\'0.3\' opacity=\'0.3\'/></svg>')] repeat opacity-50"></div>
            
            <!-- 中式标题区域：朱砂红+毛笔字体 -->
            <div class="text-center mb-8 relative z-10">
              <i class="fa-solid fa-scroll text-4xl text-[#C41E3A] mb-4"></i>
              <h2 class="text-3xl md:text-4xl font-bold text-[#2B2B2B] tracking-wider font-['MaShanZheng', 'SimHei', 'serif']">${name}</h2>
              <!-- 中式回纹分隔线 -->
              <div class="w-full max-w-xs mx-auto mt-3 flex items-center justify-between">
                <div class="w-24 h-0.5 bg-[#A67C52]"></div>
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6H4V0H6V6H10V0H12V6H16V0H18V6H24V8H18V12H16V8H12V12H10V8H6V12H4V8H0V6Z" fill="#C41E3A" opacity="0.7"/>
                </svg>
                <div class="w-24 h-0.5 bg-[#A67C52]"></div>
              </div>
            </div>
            
            <!-- 倒计时区域：仿古宣纸+中式印章点缀 -->
            <div class="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-[#D4B996]/30 relative z-10">
              <div id="festival-countdown-2" class="text-2xl md:text-3xl font-semibold text-[#8A2B1A] my-4 leading-relaxed font-['STKaiti', 'SimKai', 'serif']"></div>
              <!-- 中式梅花分隔符 -->
              <div class="flex items-center justify-center gap-3 my-3">
                <div class="w-16 h-0.5 bg-[#D4B996]/50"></div>
                <i class="fa-solid fa-flower text-[#C41E3A] text-lg"></i>
                <div class="w-16 h-0.5 bg-[#D4B996]/50"></div>
              </div>
              <p class="mt-2 text-[#6B5B49] text-sm font-['SimSun', 'serif']">岁时更迭 · 美好常伴</p>
            </div>
            
            <!-- 中式篆刻印章（右下角） -->
            <div class="absolute bottom-4 right-4 w-16 h-16 bg-[#C41E3A] rounded-sm flex items-center justify-center text-white text-xs font-bold font-['STZhongsong', 'serif'] rotate-6 shadow-md">
              吉庆有余
            </div>
            
            <!-- 左侧中式竖排题字（装饰性） -->
            <div class="absolute top-1/2 -left-8 transform -translate-y-1/2 rotate-90 text-[#6B5B49] text-xs font-['STKaiti'] tracking-wider">
              佳节将至
            </div>
          </div>
          <!-- 中式卷轴底部 -->
          <div class="w-full h-8 bg-[#D4B996] rounded-b-lg shadow-md"></div>
        </div>
      </div>
      <script>
        // 核心功能完全不变：倒计时计算、日期判断、1秒刷新
        function updateCountdown() {
          const now = new Date();
          const targetDate = new Date('${date}');
          const nextTargetDate = new Date(targetDate);
          if (nextTargetDate < now) nextTargetDate.setFullYear(now.getFullYear() + 1);
          const diffTime = nextTargetDate - now - 28800000;
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

          const isToday = now.getFullYear() === targetDate.getFullYear() &&
                          now.getMonth() === targetDate.getMonth() &&
                          now.getDate() === targetDate.getDate();
          const isPassed = !isToday && targetDate < now && nextTargetDate.getFullYear() > now.getFullYear();
          
          let tipText = '';
          if (isToday) tipText = '恭贺${name}，喜乐安康！';
          else if (isPassed) tipText = '${name}已至，岁岁年年皆如意～';
          else tipText = '距${name}尚有 ' + days + '日 ' + hours + '时 ' + minutes + '分 ' + seconds + '秒';
          
          document.getElementById('festival-countdown-2').textContent = tipText;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}
