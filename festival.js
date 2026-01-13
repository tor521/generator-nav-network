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

  // 模板2：国风新中式
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-[#F5F0E8]">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E8DFD0] relative">
          <div class="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg viewBox="0 0 100 100" fill="#C41E3A">
              <path d="M10,10 L90,10 L90,90 L10,90 Z M20,20 L80,20 L80,80 L20,80 Z M30,30 L70,30 L70,70 L30,70 Z" stroke="#C41E3A" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="bg-gradient-to-r from-[#C41E3A] to-[#A81A30] py-6 text-center relative">
            <i class="fa-solid fa-scroll text-4xl text-white mb-2"></i>
            <h2 class="text-2xl font-bold text-white tracking-wider font-['SimHei']">${name}</h2>
            <div class="absolute top-2 left-4 text-white opacity-50">
              <i class="fa-solid fa-cloud text-xl"></i>
            </div>
            <div class="absolute top-2 right-4 text-white opacity-50">
              <i class="fa-solid fa-cloud text-xl"></i>
            </div>
          </div>
          <div class="p-8 text-center font-['Microsoft_YaHei']">
            <div id="festival-countdown-2" class="text-2xl font-semibold text-[#2B2B2B] my-6 leading-relaxed font-['SimKai']"></div>
            <div class="w-24 h-1 bg-[#E8DFD0] mx-auto rounded-full"></div>
            <p class="mt-6 text-[#8A7F6F] text-sm">岁时更迭 · 美好常伴</p>
            <div class="absolute bottom-4 right-4 w-12 h-12 bg-[#C41E3A] rounded-full flex items-center justify-center text-white text-xs font-bold">
              吉庆
            </div>
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