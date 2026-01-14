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

  // 模板3：无多余动效+稳定无波动+移动端适配（最终完美版）
  else if (template === '3') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 overflow-hidden font-[\'Orbitron\',\'Consolas\',monospace,sans-serif]" style="box-sizing: border-box;">
        <!-- 1. 静态模糊背景（无缩放动画，消除页面波动） -->
        <div class="absolute inset-0 z-0" style="background: linear-gradient(to bottom right, #0F0B21, #1A143B, #2D1B69);"></div>
        <div class="blur-bg-overlay absolute inset-0 z-0" style="
          background: radial-gradient(circle at 30% 20%, rgba(131, 56, 236, 0.2), transparent 40%),
                      radial-gradient(circle at 70% 80%, rgba(58, 134, 255, 0.2), transparent 40%),
                      radial-gradient(circle at 50% 50%, rgba(253, 29, 29, 0.1), transparent 50%);
          backdrop-filter: blur(50px);
          opacity: 0.85; /* 固定透明度，无渐变动画，消除波动 */
        "></div>

        <!-- 2. 静态霓虹网格（无移动/透明度动画，稳定无干扰） -->
        <div class="cyber-grid-bg absolute inset-0 z-0" style="
          background-image: linear-gradient(to right, rgba(58, 134, 255, 0.1) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(58, 134, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.5; /* 固定透明度，无动画，稳定显示 */
        "></div>

        <!-- 3. 静态霓虹光晕（无缩放动画，消除页面放大缩小错觉） -->
        <div class="cyber-glow-overlay absolute inset-0 z-0" style="
          background: radial-gradient(circle at 50% 50%, rgba(131, 56, 236, 0.2), rgba(58, 134, 255, 0.15), transparent 70%);
          backdrop-filter: blur(10px);
          opacity: 0.7; /* 固定透明度，无缩放，稳定无波动 */
        "></div>

        <!-- 4. 赛博核心卡片（仅保留霓虹边框流光，无呼吸/缩放动效，稳定显示） -->
        <div class="cyber-card w-full relative z-20" style="
          max-width: 400px;
          min-width: 280px;
          margin: 0 auto;
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
          animation: neonBorderFlow 3s linear infinite; /* 仅保留核心霓虹边框流光，无其他动效 */
        ">
          <!-- 顶部霓虹栏（完全静态，无任何动效，无扫描线残留） -->
          <div class="cyber-header" style="
            background: linear-gradient(90deg, #833AB4, #3A86FF, #FD1D1D);
            padding: 20px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
          ">
            <h2 class="festival-name" id="festival-name-3" style="
              color: #FFFFFF; /* 纯白无发光 */
              font-size: clamp(1.5rem, 5vw, 2rem); /* 响应式字体，无透明度动画 */
              font-weight: bold;
              letter-spacing: 1px;
              position: relative;
              z-index: 1;
              padding: 0 10px;
              opacity: 1; /* 固定透明度，无波动 */
            ">${name}</h2>
          </div>

          <!-- 倒计时区域（完全静态，无任何动效，移动端适配稳定） -->
          <div class="cyber-countdown-area" style="
            padding: 20px 16px;
            text-align: center;
            position: relative;
          ">
            <!-- 赛博分隔线（静态，无动效） -->
            <div class="cyber-divider" style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
              margin-bottom: 16px;
              margin-top: 4px;
            ">
              <div class="divider-line" style="
                width: 60px;
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
                opacity: 1; /* 固定透明度，无呼吸动效 */
              "></div>
              <div class="divider-line" style="
                width: 60px;
                height: 1px;
                background: linear-gradient(90deg, transparent, #3A86FF, transparent);
                border-radius: 50%;
                opacity: 0.7;
              "></div>
            </div>

            <!-- 倒计时显示（纯白无发光，完全静态，无任何动效，移动端稳定） -->
            <div id="festival-countdown-3" style="
              font-size: clamp(1.2rem, 4vw, 1.8rem);
              font-weight: bold;
              color: #FFFFFF;
              margin: 20px 0;
              letter-spacing: 1px;
              line-height: 1.4;
              padding: 0 10px;
              word-break: keep-all;
              opacity: 1; /* 固定透明度，无波动 */
            "></div>

            <!-- 赛博标签栏（完全静态，无悬浮动效，移动端紧凑稳定） -->
            <div class="cyber-tag-bar" style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              margin-top: 16px;
              flex-wrap: wrap;
              padding: 0 10px;
            ">
              <div class="cyber-tag" style="
                padding: 4px 10px;
                background: rgba(26, 20, 59, 0.6);
                border: 1px solid rgba(58, 134, 255, 0.3);
                border-radius: 16px;
                color: #3A86FF;
                font-size: 10px;
                text-shadow: 0 0 2px rgba(58, 134, 255, 0.5);
                white-space: nowrap;
                opacity: 1; /* 固定透明度，无悬浮动效 */
              ">COUNTDOWN SYSTEM</div>
              <div class="cyber-pulse-dot" style="
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #FD1D1D;
                box-shadow: 0 0 3px #FD1D1D;
                opacity: 1; /* 固定透明度，无呼吸动效 */
              "></div>
              <div class="cyber-tag" style="
                padding: 4px 10px;
                background: rgba(26, 20, 59, 0.6);
                border: 1px solid rgba(58, 134, 255, 0.3);
                border-radius: 16px;
                color: #3A86FF;
                font-size: 10px;
                text-shadow: 0 0 2px rgba(58, 134, 255, 0.5);
                white-space: nowrap;
                opacity: 1; /* 固定透明度，无悬浮动效 */
              ">V2.0.0</div>
            </div>
          </div>

          <!-- 卡片底部霓虹条（仅同步霓虹边框流光，无额外动效） -->
          <div class="cyber-card-footer" style="
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #FD1D1D, #3A86FF, #833AB4, #FD1D1D);
            background-size: 400% 100%;
            animation: neonBorderFlow 3s linear infinite;
            opacity: 0.8;
          "></div>
        </div>

        <!-- 全局样式（仅保留霓虹边框流光动画，删除所有其他多余动效，消除波动） -->
        <style>
          /* 全局盒模型重置，确保布局稳定无错乱 */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          /* 仅保留核心：霓虹边框流光动画（无其他动效，消除页面放大缩小） */
          @keyframes neonBorderFlow {
            0% { background-position: 0% 0%; }
            100% { background-position: 400% 0%; }
          }
          /* 适配极小屏（320px以下），布局稳定无挤压 */
          @media screen and (max-width: 320px) {
            .festival-name {
              font-size: 1.2rem !important;
            }
            #festival-countdown-3 {
              font-size: 1rem !important;
            }
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
