import { generateCommonHead } from './utils.js';

// 生成节日分类分享页面（模板1/2）
export function generateFestivalPage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  let pageContent = '';

  // 模板1：经典版
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

  // 模板2：国风新中式（强化中国风）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"200\\" height=\\"200\\"><pattern id=\\"bg-pattern\\" width=\\"20\\" height=\\"20\\" patternUnits=\\"userSpaceOnUse\\"><path d=\\"M0 10h20M10 0v20\\" stroke=\\"%23E8DFD0\\" stroke-width=\\"0.5\\" fill=\\"none\\"/></pattern><rect width=\\"100%\\" height=\\"100%\\" fill=\\"url(%23bg-pattern)\\"/><rect width=\\"100%\\" height=\\"100%\\" fill=\\"%23F5F0E8\\" fill-opacity=\\"0.95\\"/></svg>')]">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-[#E8DFD0] relative">
          <!-- 中式祥云装饰 -->
          <div class="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-[#C41E3A] to-[#A81A30] overflow-hidden">
            <svg class="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 15C15 5 30 25 45 15C60 5 75 25 90 15C105 5 120 25 135 15" stroke="white" stroke-width="2" fill="none"/>
              <path d="M0 20C15 10 30 30 45 20C60 10 75 30 90 20C105 10 120 30 135 20" stroke="white" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          
          <!-- 主标题区域 -->
          <div class="pt-16 pb-4 text-center relative">
            <i class="fa-solid fa-scroll text-5xl text-[#C41E3A] mb-3"></i>
            <h2 class="text-3xl font-bold text-[#2B2B2B] tracking-wider font-['MaShanZheng', 'SimHei']">${name}</h2>
            <div class="w-32 h-0.5 bg-[#C41E3A] mx-auto mt-2"></div>
          </div>
          
          <!-- 倒计时区域 -->
          <div class="p-8 text-center font-['Microsoft_YaHei'] bg-[url('data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"100\\" height=\\"100\\"><path d=\\"M25 0 L75 0 L75 100 L25 100 Z M0 25 L100 25 L100 75 L0 75 Z\\" fill=\\"none\\" stroke=\\"%23E8DFD0\\" stroke-width=\\"0.5\\"/></svg>')]">
            <div id="festival-countdown-2" class="text-2xl font-semibold text-[#8A2B1A] my-6 leading-relaxed font-['STKaiti', 'SimKai']"></div>
            <!-- 中式分隔线 -->
            <div class="flex items-center justify-center gap-2 my-4">
              <div class="w-16 h-0.5 bg-[#E8DFD0]"></div>
              <i class="fa-solid fa-flower text-[#C41E3A] text-sm"></i>
              <div class="w-16 h-0.5 bg-[#E8DFD0]"></div>
            </div>
            <p class="mt-2 text-[#8A7F6F] text-sm font-['SimSun']">岁时更迭 · 美好常伴</p>
          </div>
          
          <!-- 中式印章装饰 -->
          <div class="absolute bottom-4 right-4 w-14 h-14 bg-[#C41E3A] rounded-full flex items-center justify-center text-white text-xs font-bold font-['STZhongsong'] rotate-12 shadow-md">
            吉庆
          </div>
          
          <!-- 侧边中式纹样 -->
          <div class="absolute top-1/2 -left-1 transform -translate-y-1/2">
            <svg viewBox="0 0 10 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 0V60M0 10L10 10M0 20L10 20M0 30L10 30M0 40L10 40M0 50L10 50" stroke="#E8DFD0" stroke-width="1"/>
            </svg>
          </div>
          <div class="absolute top-1/2 -right-1 transform -translate-y-1/2">
            <svg viewBox="0 0 10 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 0V60M0 10L10 10M0 20L10 20M0 30L10 30M0 40L10 40M0 50L10 50" stroke="#E8DFD0" stroke-width="1"/>
            </svg>
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
