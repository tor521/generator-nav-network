import { generateCommonHead } from './utils.js';

// 生成节日分类分享页面（模板1/2）
export function generateFestivalPage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  let pageContent = '';

  // 模板1：移除所有SVG + 优化配色元素（清新浅绿系，无卡通装饰，质感提升）
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#E6F7EF] to-[#D4F0E4]">
        <!-- 背景质感点缀（无SVG，纯CSS渐变纹理，提升层次感） -->
        <div class="absolute inset-0 bg-grid bg-opacity-10" style="background-image: linear-gradient(to right, #81C784 1px, transparent 1px), linear-gradient(to bottom, #81C784 1px, transparent 1px); background-size: 30px 30px;"></div>
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-[#B3E5CC] relative">
          <!-- 顶部渐变栏：优化配色（低饱和浅绿渐变，无SVG熊猫） -->
          <div class="bg-gradient-to-r from-[#66BB6A] to-[#81C784] py-6 text-center relative">
            <!-- 顶部装饰（纯CSS，无SVG，呼应熊猫主题的浅绿+白点缀） -->
            <div class="absolute top-2 right-4 w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-white bg-opacity-40"></div>
            </div>
            <h2 class="text-2xl font-bold text-white tracking-wider relative z-10">${name}</h2>
          </div>
          <!-- 倒计时区域：优化配色+纯CSS分隔元素（移除SVG，质感提升） -->
          <div class="p-8 text-center relative">
            <div id="festival-countdown" class="text-2xl font-semibold text-[#2E7D32] my-6">
              <!-- 文案由JS动态填充，功能不变 -->
            </div>
            <!-- 分隔线：纯CSS实现（移除SVG熊猫/竹子，优化浅绿渐变） -->
            <div class="flex items-center justify-center gap-3">
              <div class="w-16 h-1 bg-[#B3E5CC] rounded-full"></div>
              <div class="w-3 h-3 rounded-full bg-[#66BB6A]"></div>
              <div class="w-16 h-1 bg-[#B3E5CC] rounded-full"></div>
            </div>
            <p class="mt-6 text-[#558B2F] text-sm flex items-center justify-center gap-2">
              <span>专属定制 · 美好时刻</span>
              <!-- 底部点缀：纯CSS实现（移除SVG竹子，低饱和绿点缀） -->
              <div class="w-2 h-4 bg-[#81C784] rounded-sm"></div>
            </p>
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

  // 模板2：国风新中式（保持不变，功能不变）
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
              <h2 class="text-3xl md:text-4xl font-bold text-[#2B2B2B] tracking-wider font-[\'MaShanZheng\',\'SimHei\',\'serif\']">${name}</h2>
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
              <div id="festival-countdown-2" class="text-2xl md:text-3xl font-semibold text-[#8A2B1A] my-4 leading-relaxed font-[\'STKaiti\',\'SimKai\',\'serif\']"></div>
              <!-- 中式梅花分隔符 -->
              <div class="flex items-center justify-center gap-3 my-3">
                <div class="w-16 h-0.5 bg-[#D4B996]/50"></div>
                <i class="fa-solid fa-flower text-[#C41E3A] text-lg"></i>
                <div class="w-16 h-0.5 bg-[#D4B996]/50"></div>
              </div>
              <p class="mt-2 text-[#6B5B49] text-sm font-[\'SimSun\',\'serif\']">岁时更迭 · 美好常伴</p>
            <!-- 中式篆刻印章（右下角） -->
            <div class="absolute bottom-4 right-4 w-16 h-16 bg-[#C41E3A] rounded-sm flex items-center justify-center text-white text-xs font-bold font-[\'STZhongSong\',\'serif\'] rotate-6 shadow-md">
              吉庆有余
            </div>
            </div>
            

            
            <!-- 左侧中式竖排题字（装饰性） -->
            <div class="absolute top-1/2 -left-8 transform -translate-y-1/2 rotate-90 text-[#6B5B49] text-xs font-[\'STKaiti\',\'serif\'] tracking-wider">
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
          if (isToday) tipText = '祝你「${name}」快乐无忧！';
          else if (isPassed) tipText = '「${name}」已过，但美好永存，天天开心～';
          else tipText = '距${name}尚有 ' + days + '日 ' + hours + '时 ' + minutes + '分 ' + seconds + '秒';
          
          document.getElementById('festival-countdown-2').textContent = tipText;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body>`;
}


