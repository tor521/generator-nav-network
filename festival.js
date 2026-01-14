import { generateCommonHead } from './utils.js';

// 生成节日分类分享页面（模板1/2/3）
export function generateFestivalPage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  let pageContent = '';

  // 模板1：清新浅绿系（保持原有优化后的样式，功能不变）
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F8FBF9] to-[#EFF7F3]">
        <!-- 背景质感点缀（无SVG，纯CSS渐变纹理，提升层次感且更柔和） -->
        <div class="absolute inset-0 bg-grid bg-opacity-5" style="background-image: linear-gradient(to right, #81C784 1px, transparent 1px), linear-gradient(to bottom, #81C784 1px, transparent 1px); background-size: 40px 40px;"></div>
        <div class="w-full max-w-md bg-white/95 rounded-3xl shadow-lg overflow-hidden border border-[#B3E5CC]/50 relative backdrop-blur-sm">
          <!-- 顶部渐变栏：优化配色（低饱和浅绿渐变，无SVG熊猫） -->
          <div class="bg-gradient-to-r from-[#7CCC80] to-[#8AD08E] py-6 text-center relative">
            <!-- 顶部装饰（纯CSS，无SVG，呼应熊猫主题的浅绿+白点缀） -->
            <div class="absolute top-2 right-4 w-12 h-12 rounded-full bg-white bg-opacity-15 flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-white bg-opacity-30"></div>
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
              <div class="w-16 h-1 bg-[#B3E5CC]/60 rounded-full"></div>
              <div class="w-3 h-3 rounded-full bg-[#66BB6A]/80"></div>
              <div class="w-16 h-1 bg-[#B3E5CC]/60 rounded-full"></div>
            </div>
            <p class="mt-6 text-[#558B2F]/80 text-sm flex items-center justify-center gap-2">
              <span>专属定制 · 美好时刻</span>
              <!-- 底部点缀：纯CSS实现（移除SVG竹子，低饱和绿点缀） -->
              <div class="w-2 h-4 bg-[#81C784]/70 rounded-sm"></div>
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

  // 模板2：国风新中式（保持原有优化后的样式，功能不变）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FCF9F4] to-[#F8F2E9]">
        <!-- 核心容器：中式卷轴风格，彻底区别于模板1的圆角卡片 -->
        <div class="w-full max-w-md relative">
          <!-- 中式卷轴顶部 -->
          <div class="w-full h-8 bg-[#D4B996]/80 rounded-t-lg shadow-md flex items-center justify-center">
            <div class="w-16 h-1 bg-[#A67C52]/70 rounded-full"></div>
          </div>
          <!-- 卷轴主体：仿古宣纸质感 -->
          <div class="bg-[#F9F3E8]/95 rounded-b-lg shadow-xl border-l-2 border-r-2 border-[#D4B996]/40 p-6 md:p-8 relative overflow-hidden backdrop-blur-sm">
            <!-- 背景中式暗纹：梅兰竹菊简化纹（无符号泄露，透明度降低更柔和） -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><path d=\'M50 20C60 10 70 20 80 15C90 10 95 30 85 40C75 50 60 45 50 55C40 45 25 50 15 40C5 30 10 10 20 15C30 20 40 10 50 20Z\' fill=\'none\' stroke=\'%23D4B996\' stroke-width=\'0.3\' opacity=\'0.15\'/></svg>')] repeat opacity-30"></div>
            
            <!-- 中式标题区域：朱砂红+毛笔字体 -->
            <div class="text-center mb-8 relative z-10">
              <i class="fa-solid fa-scroll text-4xl text-[#C41E3A]/80 mb-4"></i>
              <h2 class="text-3xl md:text-4xl font-bold text-[#2B2B2B]/90 tracking-wider font-[\'MaShanZheng\',\'SimHei\',\'serif\']">${name}</h2>
              <!-- 中式回纹分隔线 -->
              <div class="w-full max-w-xs mx-auto mt-3 flex items-center justify-between">
                <div class="w-24 h-0.5 bg-[#A67C52]/60"></div>
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6H4V0H6V6H10V0H12V6H16V0H18V6H24V8H18V12H16V8H12V12H10V8H6V12H4V8H0V6Z" fill="#C41E3A" opacity="0.5"/>
                </svg>
                <div class="w-24 h-0.5 bg-[#A67C52]/60"></div>
              </div>
            </div>
            
            <!-- 倒计时区域：仿古宣纸+中式印章点缀 -->
            <div class="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-[#D4B996]/20 relative z-10">
              <div id="festival-countdown-2" class="text-2xl md:text-3xl font-semibold text-[#8A2B1A]/90 my-4 leading-relaxed font-[\'STKaiti\',\'SimKai\',\'serif\']"></div>
              <!-- 中式梅花分隔符 -->
              <div class="flex items-center justify-center gap-3 my-3">
                <div class="w-16 h-0.5 bg-[#D4B996]/30"></div>
                <i class="fa-solid fa-flower text-[#C41E3A]/70 text-lg"></i>
                <div class="w-16 h-0.5 bg-[#D4B996]/30"></div>
              </div>
              <p class="mt-2 text-[#6B5B49]/80 text-sm font-[\'SimSun\',\'serif\']">岁时更迭 · 美好常伴</p>
            </div>
            
            <!-- 左侧中式竖排题字（装饰性） -->
            <div class="absolute top-1/2 -left-8 transform -translate-y-1/2 rotate-90 text-[#6B5B49]/70 text-xs font-[\'STKaiti\',\'serif\'] tracking-wider">
              佳节将至
            </div>
          </div>
          <!-- 中式卷轴底部 -->
          <div class="w-full h-8 bg-[#D4B996]/80 rounded-b-lg shadow-md"></div>
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

  // 模板3：赛博朋克科技风（新增酷炫视觉，核心功能与前两者一致）
  else if (template === '3') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F0B21] to-[#1A143B] relative overflow-hidden">
        <!-- 背景科技网格动效（酷炫氛围铺垫） -->
        <div class="absolute inset-0 bg-grid-tech" style="background-image: linear-gradient(to right, #3A86FF 1px, transparent 1px), linear-gradient(to bottom, #3A86FF 1px, transparent 1px); background-size: 60px 60px; animation: gridMove 20s linear infinite;"></div>
        <!-- 背景光晕扫动效果 -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(131,56,236,0.2),transparent_70%)]">
          <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to rgba(58,134,255,0.1) animate-pulse" style="animation-duration: 4s;"></div>
        </div>
        <!-- 核心科技卡片容器 -->
        <div class="w-full max-w-md relative z-10 bg-[#120F29]/80 backdrop-blur-md rounded-2xl border border-[#3A86FF]/30 shadow-[0_0_30px_rgba(131,56,236,0.3)] overflow-hidden">
          <!-- 顶部霓虹渐变栏 + 扫描动效 -->
          <div class="bg-gradient-to-r from-[#833AB4] via-[#3A86FF] to-[#FD1D1D] py-7 text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to #3A86FF to transparent animate-[scan_3s_ease-in-out_infinite]"></div>
            <h2 class="text-2xl md:text-3xl font-bold text-white tracking-wider relative z-10 drop-shadow-[0_0_8px_rgba(58,134,255,0.8)]">${name}</h2>
            <!-- 顶部霓虹点缀 -->
            <div class="absolute top-4 right-6 w-10 h-10 rounded-full bg-[#FD1D1D]/20 flex items-center justify-center">
              <div class="w-6 h-6 rounded-full bg-[#FD1D1D]/40 drop-shadow-[0_0_6px_rgba(253,29,29,0.8)]"></div>
            </div>
          </div>
          <!-- 倒计时核心区域（科技感数字显示） -->
          <div class="p-8 text-center relative">
            <!-- 科技分隔线（霓虹发光） -->
            <div class="flex items-center justify-center gap-4 mb-6 mt-2">
              <div class="w-20 h-1 bg-gradient-to-r from-transparent to #3A86FF to transparent rounded-full"></div>
              <div class="w-4 h-4 rounded-full bg-[#833AB4] drop-shadow-[0_0_4px_rgba(131,56,236,1)]"></div>
              <div class="w-20 h-1 bg-gradient-to-r from-transparent to #3A86FF to transparent rounded-full"></div>
            </div>
            <!-- 倒计时显示容器（霓虹文字+发光效果） -->
            <div id="festival-countdown-3" class="text-2xl md:text-3xl font-bold text-[#E0EFFF] my-8 drop-shadow-[0_0_10px_rgba(58,134,255,0.6)] font-[\'Orbitron\',\'monospace\']"></div>
            <!-- 底部科技标签 + 霓虹点缀 -->
            <div class="flex items-center justify-center gap-3 text-xs text-[#3A86FF]/70 mt-6">
              <span class="px-3 py-1 bg-[#1A143B]/60 rounded-full border border-[#3A86FF]/20">COUNTDOWN SYSTEM</span>
              <div class="w-2 h-2 rounded-full bg-[#FD1D1D] animate-pulse" style="animation-duration: 2s;"></div>
              <span class="px-3 py-1 bg-[#1A143B]/60 rounded-full border border-[#3A86FF]/20">V1.0.0</span>
            </div>
          </div>
          <!-- 卡片底部霓虹边框动效 -->
          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FD1D1D] via-[#3A86FF] to-[#833AB4] animate-[glow_5s_ease-in-out_infinite]"></div>
        </div>
        <!-- 全局动画样式定义 -->
        <style>
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
          }
          @keyframes scan {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: -100%; }
          }
          @keyframes glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        </style>
      </div>
      <script>
        // 核心功能与模板1/2完全一致：倒计时计算、日期判断、1秒刷新，仅修改DOM元素ID
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
          
          document.getElementById('festival-countdown-3').textContent = tipText;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body>`;
}
