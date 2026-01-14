import { generateCommonHead } from './utils.js';

// 生成生日分类分享页面（模板1/2）
export function generateBirthdayPage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  let pageContent = '';

  // 模板1：经典版
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

  // 模板2：酷炫赛博朋克风（优化后）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] relative overflow-hidden">
        <!-- 背景装饰光点 -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,69,255,0.15),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(45,212,191,0.15),transparent_40%)]"></div>
        <!-- 主卡片：玻璃拟态+霓虹边框 -->
        <div class="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg shadow-[#7844FF]/20 overflow-hidden border border-[#7844FF]/30 relative transition-all duration-300 hover:scale-[1.02] hover:shadow-[#2DD4BF]/30">
          <!-- 顶部霓虹装饰条 -->
          <div class="h-1 bg-gradient-to-r from-[#7844FF] to-[#2DD4BF]"></div>
          
          <!-- 头部区域 -->
          <div class="py-8 text-center relative">
            <h2 class="text-3xl font-bold text-white tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#7844FF] to-[#2DD4BF]">${name}</h2>
            <p class="text-sm text-[#A1A1AA] mt-2 uppercase tracking-widest">BIRTHDAY CELEBRATION</p>
            <!-- 装饰性霓虹图标 -->
            <i class="fa-solid fa-star-of-life text-[#7844FF]/50 absolute top-4 right-8 text-xl animate-pulse"></i>
            <i class="fa-solid fa-star-of-life text-[#2DD4BF]/50 absolute top-4 left-8 text-xl animate-pulse" style="animation-delay: 0.5s"></i>
          </div>
          
          <!-- 倒计时区域 -->
          <div class="p-8 text-center">
            <div id="birthday-countdown-2" class="text-2xl md:text-3xl font-bold text-white my-8 leading-relaxed tracking-wide"></div>
            <!-- 渐变分隔线 -->
            <div class="w-24 h-0.5 bg-gradient-to-r from-[#7844FF] to-[#2DD4BF] mx-auto rounded-full"></div>
            <!-- 底部小字 -->
            <p class="mt-6 text-xs text-[#A1A1AA]/80">TIME TO CELEBRATE 🎉</p>
          </div>
          
          <!-- 底部装饰 -->
          <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-[#7844FF]/10 to-[#2DD4BF]/10"></div>
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

          const isToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
          let tipText = isToday ? '🎉 Happy Birthday 🎉' : days + ' DAYS TO CELEBRATE';
          
          document.getElementById('birthday-countdown-2').textContent = tipText;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}
