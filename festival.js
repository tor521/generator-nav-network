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

  // 模板3：颠覆性大改（数字卡片化+立体交互，功能与前两者完全一致）
  else if (template === '3') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#05021A] to-[#120A38] relative overflow-hidden">
        <!-- 背景星空粒子动效（与模板1/2的静态背景本质区别） -->
        <div class="absolute inset-0" id="star-bg"></div>
        <!-- 核心容器：立体悬浮卡片，与模板1/2的扁平布局区别 -->
        <div class="w-full max-w-lg relative z-10">
          <!-- 节日标题：悬浮发光样式 -->
          <div class="text-center mb-8">
            <h2 class="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_15px_rgba(100,216,255,0.7)] tracking-wider relative">
              <span class="relative inline-block animate-[float_6s_ease-in-out_infinite]">${name}</span>
              <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent to #64D8FF to transparent rounded-full"></div>
            </h2>
          </div>

          <!-- 状态提示区域（对应今日/已过/倒计时三种场景） -->
          <div class="text-center mb-6">
            <p id="countdown-status" class="text-lg text-[#A8CFFF] drop-shadow-[0_0_8px_rgba(168,207,255,0.5)]"></p>
          </div>

          <!-- 颠覆性核心：数字拆分卡片化（与模板1/2的文字段落本质区别） -->
          <div id="countdown-cards" class="flex justify-center gap-4 md:gap-6 flex-wrap">
            <!-- 天卡片 -->
            <div class="countdown-card group">
              <div class="card-front bg-[#101848]/90 backdrop-blur-md border border-[#64D8FF]/30 rounded-xl shadow-[0_4px_20px_rgba(0,119,255,0.2)] p-4 md:p-6 relative overflow-hidden">
                <div class="card-number text-4xl md:text-6xl font-bold text-[#64D8FF] drop-shadow-[0_0_10px_rgba(100,216,255,0.8)] font-[\'Orbitron\',\'monospace\']" id="days-num">00</div>
                <div class="card-label text-xs md:text-sm text-[#A8CFFF]/80 mt-2 text-center">天</div>
                <!-- 卡片hover动效装饰 -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to rgba(100,216,255,0.1) to transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            <!-- 时卡片 -->
            <div class="countdown-card group">
              <div class="card-front bg-[#101848]/90 backdrop-blur-md border border-[#64D8FF]/30 rounded-xl shadow-[0_4px_20px_rgba(0,119,255,0.2)] p-4 md:p-6 relative overflow-hidden">
                <div class="card-number text-4xl md:text-6xl font-bold text-[#64D8FF] drop-shadow-[0_0_10px_rgba(100,216,255,0.8)] font-[\'Orbitron\',\'monospace\']" id="hours-num">00</div>
                <div class="card-label text-xs md:text-sm text-[#A8CFFF]/80 mt-2 text-center">时</div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to rgba(100,216,255,0.1) to transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            <!-- 分卡片 -->
            <div class="countdown-card group">
              <div class="card-front bg-[#101848]/90 backdrop-blur-md border border-[#64D8FF]/30 rounded-xl shadow-[0_4px_20px_rgba(0,119,255,0.2)] p-4 md:p-6 relative overflow-hidden">
                <div class="card-number text-4xl md:text-6xl font-bold text-[#64D8FF] drop-shadow-[0_0_10px_rgba(100,216,255,0.8)] font-[\'Orbitron\',\'monospace\']" id="minutes-num">00</div>
                <div class="card-label text-xs md:text-sm text-[#A8CFFF]/80 mt-2 text-center">分</div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to rgba(100,216,255,0.1) to transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            <!-- 秒卡片 -->
            <div class="countdown-card group">
              <div class="card-front bg-[#101848]/90 backdrop-blur-md border border-[#64D8FF]/30 rounded-xl shadow-[0_4px_20px_rgba(0,119,255,0.2)] p-4 md:p-6 relative overflow-hidden">
                <div class="card-number text-4xl md:text-6xl font-bold text-[#64D8FF] drop-shadow-[0_0_10px_rgba(100,216,255,0.8)] font-[\'Orbitron\',\'monospace\']" id="seconds-num">00</div>
                <div class="card-label text-xs md:text-sm text-[#A8CFFF]/80 mt-2 text-center">秒</div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to rgba(100,216,255,0.1) to transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <!-- 秒卡片专属脉冲动效 -->
                <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#64D8FF] animate-[pulse_1s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>

          <!-- 底部科技感标识 -->
          <div class="text-center mt-8 text-xs text-[#A8CFFF]/50">
            <span class="px-2 py-1 bg-[#101848]/50 rounded-full border border-[#64D8FF]/20">COUNTDOWN CARD SYSTEM V2.0</span>
          </div>
        </div>

        <!-- 全局动画与样式定义 -->
        <style>
          /* 悬浮动画 */
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          /* 脉冲动画 */
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
          }
          /* 卡片hover立体提升 */
          .countdown-card {
            transition: transform 0.3s ease-in-out;
          }
          .countdown-card:hover {
            transform: translateY(-6px) scale(1.05);
          }
        </style>
      </div>

      <script>
        // 1. 背景星空粒子生成（增强酷炫感，与模板1/2静态背景区别）
        function createStarBg() {
          const starBg = document.getElementById('star-bg');
          const starCount = 150;
          for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 2 + 1;
            star.style.cssText = \`
              position: absolute;
              width: \${size}px;
              height: \${size}px;
              background: white;
              border-radius: 50%;
              top: \${Math.random() * 100}%;
              left: \${Math.random() * 100}%;
              opacity: \${Math.random() * 0.8 + 0.2};
              animation: starTwinkle \${Math.random() * 5 + 3}s ease-in-out infinite;
            \`;
            starBg.appendChild(star);
          }
          // 星星闪烁动画
          const style = document.createElement('style');
          style.textContent = \`
            @keyframes starTwinkle {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 0.8; }
            }
          \`;
          document.head.appendChild(style);
        }
        createStarBg();

        // 2. 核心倒计时功能（完全保留原有逻辑，仅修改DOM渲染方式）
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
          
          // 状态文案（对应原有三种场景，功能不变）
          const statusEl = document.getElementById('countdown-status');
          const cardsContainer = document.getElementById('countdown-cards');
          if (isToday) {
            statusEl.textContent = '祝你「${name}」快乐无忧！';
            cardsContainer.style.opacity = '0.5'; // 非倒计时状态弱化卡片
          } else if (isPassed) {
            statusEl.textContent = '「${name}」已过，但美好永存，天天开心～';
            cardsContainer.style.opacity = '0.5'; // 非倒计时状态弱化卡片
          } else {
            statusEl.textContent = '距离节日开启，倒计时进行中';
            cardsContainer.style.opacity = '1'; // 倒计时状态正常显示卡片
          }

          // 颠覆性渲染：数字填充到独立卡片（与模板1/2的文字段落本质区别）
          // 补零处理，让数字更规整美观
          const formatNum = (num) => num.toString().padStart(2, '0');
          document.getElementById('days-num').textContent = formatNum(days);
          document.getElementById('hours-num').textContent = formatNum(hours);
          document.getElementById('minutes-num').textContent = formatNum(minutes);
          document.getElementById('seconds-num').textContent = formatNum(seconds);
        }

        // 3. 初始化+1秒刷新（保留原有核心功能，无任何改动）
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body>`;
}
