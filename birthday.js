import { generateCategoryContent } from '../utils.js';

/**
 * 生成生日分类页面内容
 */
export function generateBirthdayContent() {
  return generateCategoryContent('birthday', '生日', 'birthday');
}

/**
 * 生成生日分享页（模板1/2）
 * @param {object} data 分享数据
 * @returns {string} 分享页HTML
 */
export function generateBirthdaySharePage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  
  // 模板1：经典款
  if (template === '1') {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}的生日倒计时</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
  </style>
</head>
<body>
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
</body>
</html>
    `;
  } 
  // 模板2：简约极简风
  else if (template === '2') {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}的生日</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
  </style>
</head>
<body>
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
</body>
</html>
    `;
  } else {
    return generateUnsupportedTemplatePage(template);
  }
}

// 通用：未开发模板提示页
function generateUnsupportedTemplatePage(template) {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>模板未开发</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
  <div class="w-full max-w-md bg-white rounded-3xl shadow-lg text-center p-8">
    <i class="fa-solid fa-box-archive text-5xl text-gray-300 mb-4"></i>
    <h2 class="text-xl text-gray-500">模板${template} 暂未开发</h2>
    <p class="mt-2 text-gray-400">敬请期待更多精美模板</p>
  </div>
</body>
</html>
  `;
}