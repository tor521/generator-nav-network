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

  // 模板2：简约极简风
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-[#F9F9F9]">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E0E0E0]">
          <div class="py-8 text-center border-b border-[#F0F0F0]">
            <h2 class="text-2xl font-light text-[#333333] tracking-wide">${name}</h2>
            <p class="text-sm text-[#999999] mt-2">BIRTHDAY</p>
          </div>
          <div class="p-8 text-center">
            <div id="birthday-countdown-2" class="text-xl font-light text-[#333333] my-8 leading-relaxed"></div>
            <div class="w-16 h-0.5 bg-[#E0E0E0] mx-auto"></div>
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

          const isToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
          let tipText = isToday ? 'Happy Birthday' : days + ' DAYS TO GO';
          
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