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

  // 模板3：严格对齐最终满意版（模糊背景+低调赛博，功能不变）
  else if (template === '3') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 overflow-hidden font-[\'Orbitron\',\'Consolas\',monospace,sans-serif]">
        <!-- 1. 模糊背景核心层（与最终HTML完全一致） -->
        <div class="absolute inset-0 z-0" style="background: linear-gradient(to bottom right, #0F0B21, #1A143B, #2D1B69);"></div>
        <div class="blur-bg-overlay absolute inset-0 z-0" style="
          background: radial-gradient(circle at 30% 20%, rgba(131, 56, 236, 0.2), transparent 40%),
                      radial-gradient(circle at 70% 80%, rgba(58, 134, 255, 0.2), transparent 40%),
                      radial-gradient(circle at 50% 50%, rgba(253, 29, 29, 0.1), transparent 50%);
          backdrop-filter: blur(50px);
          animation: blurGlowPulse 8s ease-in-out infinite;
        "></div>

        <!-- 2. 动态霓虹网格（弱化透明度，适配模糊背景） -->
        <div class="cyber-grid-bg absolute inset-0 z-0" style="
          background-image: linear-gradient(to right, rgba(58, 134, 255, 0.1) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(58, 134, 255, 0.1) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 20s linear infinite, gridPulse 8s ease-in-out infinite;
          opacity: 0.6;
        "></div>

        <!-- 3. 霓虹光晕扫动（叠加模糊，柔和风格） -->
        <div class="cyber-glow-overlay absolute inset-0 z-0" style="
          background: radial-gradient(circle at 50% 50%, rgba(131, 56, 236, 0.2), rgba(58, 134, 255, 0.15), transparent 70%);
          animation: glowSweep 6s ease-in-out infinite;
          backdrop-filter: blur(10px);
        "></div>

        <!-- 4. 赛博核心卡片（毛玻璃+流光边框，与最终HTML一致） -->
        <div class="cyber-card w-full max-w-400px relative z-20" style="
          max-width: 400px;
          background: rgba(18, 15, 41, 0.85);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          border: 2px solid transparent;
          background-clip: padding-box, border-box;
          background-origin: padding-box, border-box;
          background-image: linear-gradient(#120F29, #120F29), 
                            linear-gradient(90deg, #FF00FF, #00FFFF, #FD1D1D, #FF00FF);
          background-size: 400% 100%;
          box-shadow: 0 0 20px rgba(131, 56, 236, 0.3), 
                      0 0 40px rgba(58, 134, 255, 0.2), 
                      inset 0 0 10px rgba(253, 29, 29, 0.15);
          overflow: hidden;
          animation: neonBorderFlow 3s linear infinite, cardBreathe 6s ease-in-out infinite;
        ">
          <!-- 顶部霓虹栏（无多重发光，柔和扫描） -->
          <div class="cyber-header" style="
            background: linear-gradient(90deg, #833AB4, #3A86FF, #FD1D1D);
            padding: 28px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
          ">
            <div style="
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
              animation: headerScan 3s ease-in-out infinite;
            "></div>
            <h2 class="festival-name" id="festival-name-3" style="
              color: #FFFFFF;
              font-size: 2rem;
              font-weight: bold;
              letter-spacing: 2px;
              position: relative;
              z-index: 1;
              text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
              animation: textSoftPulse 4s ease-in-out infinite;
            ">${name}</h2>
          </div>

          <!-- 倒计时区域（无多重发光，柔和风格） -->
          <div class="cyber-countdown-area" style="
            padding: 32px;
            text-align: center;
            position: relative;
          ">
            <!-- 赛博分隔线 -->
            <div class="cyber-divider" style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
              margin-bottom: 24px;
              margin-top: 8px;
            ">
              <div class="divider-line" style="
                width: 80px;
                height: 1px;
                background: linear-gradient(90deg, transparent, #3A86FF, transparent);
                border-radius: 50%;
                opacity: 0.7;
              "></div>
              <div class="divider-dot" style="
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #FF00FF;
                box-shadow: 0 0 3px #FF00FF;
                animation: dotSoftPulse 2s ease-in-out infinite;
              "></div>
              <div class="divider-line" style="
                width: 80px;
                height: 1px;
                background: linear-gradient(90deg, transparent, #3A86FF, transparent);
                border-radius: 50%;
                opacity: 0.7;
              "></div>
            </div>

            <!-- 倒计时显示（保留原有ID，功能不变） -->
            <div id="festival-countdown-3" style="
              font-size: 1.8rem;
              font-weight: bold;
              color: #E0EFFF;
              margin: 32px 0;
              text-shadow: 0 0 2px rgba(224, 239, 255, 0.6);
              letter-spacing: 1px;
              animation: countdownSoftGlow 3s ease-in-out infinite;
            "></div>

            <!-- 赛博标签栏 -->
            <div class="cyber-tag-bar" style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-top: 24px;
            ">
              <div class="cyber-tag" style="
                padding: 6px 12px;
                background: rgba(26, 20, 59, 0.6);
                border: 1px solid rgba(58, 134, 255, 0.3);
                border-radius: 16px;
                color: #3A86FF;
                font-size: 12px;
                text-shadow: 0 0 2px rgba(58, 134, 255, 0.5);
                animation: tagFloat 5s ease-in-out infinite;
              ">COUNTDOWN SYSTEM</div>
              <div class="cyber-pulse-dot" style="
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #FD1D1D;
                box-shadow: 0 0 3px #FD1D1D;
                animation: pulseSoftGlow 2s ease-in-out infinite;
              "></div>
              <div class="cyber-tag" style="
                padding: 6px 12px;
                background: rgba(26, 20, 59, 0.6);
                border: 1px solid rgba(58, 134, 255, 0.3);
                border-radius: 16px;
                color: #3A86FF;
                font-size: 12px;
                text-shadow: 0 0 2px rgba(58, 134, 255, 0.5);
                animation: tagFloat 5s ease-in-out infinite;
              ">V2.0.0</div>
            </div>
          </div>

          <!-- 卡片底部霓虹条 -->
          <div class="cyber-card-footer" style="
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #FD1D1D, #3A86FF, #833AB4, #FD1D1D);
            background-size: 400% 100%;
            animation: footerGlow 5s ease-in-out infinite, neonBorderFlow 3s linear infinite;
            opacity: 0.8;
          "></div>
        </div>

        <!-- 全局动画样式（与最终HTML完全一致，无多余动效） -->
        <style>
          @keyframes blurGlowPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
          }
          @keyframes gridPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @keyframes glowSweep {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 0.9; }
            100% { transform: scale(1); opacity: 0.6; }
          }
          @keyframes neonBorderFlow {
            0% { background-position: 0% 0%; }
            100% { background-position: 400% 0%; }
          }
          @keyframes cardBreathe {
            0%, 100% { box-shadow: 0 0 20px rgba(131, 56, 236, 0.2), 0 0 40px rgba(58, 134, 255, 0.15), inset 0 0 10px rgba(253, 29, 29, 0.1); }
            50% { box-shadow: 0 0 30px rgba(131, 56, 236, 0.3), 0 0 60px rgba(58, 134, 255, 0.25), inset 0 0 15px rgba(253, 29, 29, 0.15); }
          }
          @keyframes headerScan {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
          }
          @keyframes textSoftPulse {
            0%, 100% { opacity: 0.8; text-shadow: 0 0 3px rgba(255, 255, 255, 0.5); }
            50% { opacity: 1; text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); }
          }
          @keyframes dotSoftPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 3px #FF00FF; }
            50% { transform: scale(1.5); box-shadow: 0 0 6px #FF00FF; }
          }
          @keyframes countdownSoftGlow {
            0%, 100% { opacity: 0.8; text-shadow: 0 0 2px rgba(224, 239, 255, 0.6); }
            50% { opacity: 1; text-shadow: 0 0 4px rgba(224, 239, 255, 0.9); }
          }
          @keyframes tagFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          @keyframes pulseSoftGlow {
            0%, 100% { transform: scale(1); box-shadow: 0 0 3px #FD1D1D; }
            50% { transform: scale(1.2); box-shadow: 0 0 6px #FD1D1D; }
          }
          @keyframes footerGlow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.9; }
          }
        </style>
      </div>
      <script>
        // 核心功能与模板1/2完全一致（无任何修改，确保功能不变）
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
        // 初始化+1秒刷新（保留原有功能逻辑）
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body>`;
}
