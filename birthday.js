import { generateCommonHead } from './utils.js';

// 生成生日分类分享页面（模板1/2）
export function generateBirthdayPage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  let pageContent = '';

  // 模板1：经典版（保持不变）
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-center">
            <i class="fa-solid fa-cake-candles text-4xl text-white mb-2"></i>
            <h2 class="text-2xl font-bold text-white tracking-wider">${name}的生日</h2>
          </div>
          <div class="p-8 text-center">
            <div id="birthday-countdown" class="text-2xl font-semibold text-gray-700 my-6"></div>
            <div class="w-24 h-1 bg-amber-200 mx-auto rounded-full"></div>
            <p class="mt-6 text-gray-500 text-sm">专属生日祝福 · 快乐永存</p>
          </div>
        </div>
      </div>
      <script>
        function updateCountdown() {
          const now = new Date();
          const birthDate = new Date('${date}');
          const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
          if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
          const diffTime = nextBirthday - now;
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

          const isToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
          let tipText = isToday ? '${name}生日快乐，愿你在未来的日子里健康、快乐、平安、顺遂！' : '${name}的生日还有 ' + days + '天 ' + hours + '时 ' + minutes + '分 ' + seconds + '秒';
          
          document.getElementById('birthday-countdown').textContent = tipText;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 模板2：酷炫赛博朋克风（彻底重构布局+优化文案）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] relative overflow-hidden">
        <!-- 背景装饰：动态网格线+光点 -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,69,255,0.15),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(45,212,191,0.15),transparent_40%)]"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><path fill=\"none\" stroke=\"rgba(120,69,255,0.05)\" stroke-width=\"0.5\" d=\"M0 50h100M50 0v100\"/></svg>')] repeat"></div>
        
        <!-- 顶部装饰：悬浮霓虹标题 -->
        <div class="absolute top-12 left-0 right-0 text-center">
          <h1 class="text-xl md:text-2xl text-[#A1A1AA]/70 uppercase tracking-[0.5em] font-light animate-fade-in">
            BIRTHDAY COUNTDOWN
          </h1>
        </div>
        
        <!-- 核心区域：非卡片式布局，分层视觉 -->
        <div class="w-full max-w-lg relative flex flex-col items-center justify-center gap-12">
          <!-- 1. 姓名展示：超大号霓虹渐变文字+悬浮动效 -->
          <div class="relative">
            <h2 class="text-5xl md:text-7xl font-black tracking-wider text-center">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#7844FF] to-[#2DD4BF] drop-shadow-[0_0_15px_rgba(120,69,255,0.5)] transition-all duration-500 hover:drop-shadow-[0_0_25px_rgba(45,212,191,0.7)]">
                ${name}
              </span>
            </h2>
            <!-- 姓名下方霓虹光晕 -->
            <div class="w-full h-2 bg-gradient-to-r from-[#7844FF]/30 to-[#2DD4BF]/30 rounded-full mt-2 blur-sm"></div>
          </div>
          
          <!-- 2. 倒计时核心区域：数字卡片组+文案，彻底摆脱模板1结构 -->
          <div class="w-full flex flex-col items-center gap-8">
            <!-- 倒计时数字/文案容器：玻璃拟态面板 -->
            <div class="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-xl p-6 md:p-8 border border-[#7844FF]/30 shadow-lg shadow-[#7844FF]/20 relative">
              <!-- 面板角落装饰 -->
              <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#7844FF] rounded-tl-xl"></div>
              <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#2DD4BF] rounded-tr-xl"></div>
              <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#2DD4BF] rounded-bl-xl"></div>
              <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#7844FF] rounded-br-xl"></div>
              
              <!-- 倒计时文案展示 -->
              <div id="birthday-countdown-2" class="text-center">
                <!-- 文案会通过JS动态填充，保留不同状态的精美文案 -->
              </div>
            </div>
            
            <!-- 3. 底部提示：霓虹图标+简约文案 -->
            <div class="flex items-center gap-3 text-[#A1A1AA]/80 text-sm md:text-base">
              <i class="fa-solid fa-cake-candles text-[#7844FF] animate-bounce" style="animation-delay: 1s"></i>
              <span class="uppercase tracking-wider">专属生辰 · 静待美好</span>
            </div>
          </div>
        </div>
        
        <!-- 底部装饰：悬浮霓虹粒子 -->
        <div class="absolute bottom-8 left-0 right-0 text-center">
          <i class="fa-solid fa-star text-[#7844FF]/50 text-xs animate-pulse mx-1"></i>
          <i class="fa-solid fa-star text-[#2DD4BF]/50 text-xs animate-pulse mx-1" style="animation-delay: 0.3s"></i>
          <i class="fa-solid fa-star text-[#7844FF]/50 text-xs animate-pulse mx-1" style="animation-delay: 0.6s"></i>
        </div>
      </div>
      <script>
        function updateCountdown() {
          const now = new Date();
          const birthDate = new Date('${date}');
          const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
          
          // 核心功能不变：判断下一个生日年份
          if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
          const diffTime = nextBirthday - now;
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
          
          const isToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
          let tipText = '';
          
          // 优化倒计时文案：分状态设计，更有仪式感和氛围感
          if (isToday) {
            // 当天生日：双行文案+霓虹强调，更具祝福感
            tipText = \`
              <p class="text-xl md:text-2xl text-white mb-2">🎊 生辰吉乐 · 万事胜意 🎊</p>
              <p class="text-[#2DD4BF] font-bold text-lg md:text-xl drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">
                祝\${name}今天快乐，永远快乐！
              </p>
            \`;
          } else {
            // 倒计时状态：分层文案+数字高亮，更具科技感
            tipText = \`
              <p class="text-[#A1A1AA] text-sm md:text-base mb-3">距离\${name}的生日还有</p>
              <p class="text-2xl md:text-3xl text-white font-bold">
                <span class="text-[#7844FF] drop-shadow-[0_0_10px_rgba(120,69,255,0.6)]">\${days}</span> 天 
                <span class="text-[#2DD4BF] drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]">\${hours}</span> 时 
                <span class="text-[#7844FF] drop-shadow-[0_0_10px_rgba(120,69,255,0.6)]">\${minutes}</span> 分 
                <span class="text-[#2DD4BF] drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]">\${seconds}</span> 秒
              </p>
              <p class="text-[#A1A1AA]/70 text-xs mt-3 uppercase tracking-wider">敬请期待 · 美好将至</p>
            \`;
          }
          
          // 插入倒计时文案（支持HTML格式，提升视觉层次）
          document.getElementById('birthday-countdown-2').innerHTML = tipText;
        }
        
        // 核心功能不变：初始化+1秒刷新
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}
