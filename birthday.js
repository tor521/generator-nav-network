import { generateCommonHead } from './utils.js';

// 生成生日分类分享页面（模板1/2）
export function generateBirthdayPage(data) {
  const { template, previewData } = data;
  // 容错：确保 previewData 包含必要字段
  const { name = '未知用户', date = new Date().toISOString().split('T')[0] } = previewData || {};
  let pageContent = '';

  // 固定奖品池：指定金额微信红包
  const prizes = [
    '微信红包1.88元',
    '微信红包2.88元',
    '微信红包3.88元',
    '微信红包4.88元',
    '微信红包5.88元',
    '微信红包6.88元',
    '微信红包8.88元',
    '微信红包58.88元'
  ];

  // 模板1：经典暖色调版
  if (template === '1') {
    pageContent = '<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-50">' +
      '<div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">' +
      '<div class="bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-center">' +
      '<i class="fa-solid fa-cake-candles text-4xl text-white mb-2"></i>' +
      '<h2 class="text-2xl font-bold text-white tracking-wider">' + name + '的生日</h2>' +
      '</div>' +
      '<div class="p-8 text-center">' +
      '<div id="birthday-countdown" class="text-2xl font-semibold text-gray-700 my-6"></div>' +
      '<div id="birthday-lottery" class="hidden my-8">' +
      '<div class="w-32 h-1 bg-amber-300 mx-auto rounded-full mb-4"></div>' +
      '<h3 class="text-xl font-bold text-amber-600 mb-4">🎂 生日专属微信红包抽奖 🎂</h3>' +
      '<button id="lottery-btn" class="bg-orange-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors mb-4">' +
      '点击抽取生日微信红包' +
      '</button>' +
      '<div id="lottery-result" class="text-lg text-gray-800 font-bold hidden mt-4 min-h-[24px] text-green-600"></div>' +
      '</div>' +
      '<div class="w-24 h-1 bg-amber-200 mx-auto rounded-full"></div>' +
      '<p class="mt-6 text-gray-500 text-sm">专属生日祝福 · 快乐永存</p>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  // 模板2：清新蓝调版
  else if (template === '2') {
    pageContent = '<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 to-blue-50">' +
      '<div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100">' +
      '<div class="bg-gradient-to-r from-sky-500 to-blue-500 py-6 text-center">' +
      '<i class="fa-solid fa-birthday-cake text-4xl text-white mb-2"></i>' +
      '<h2 class="text-2xl font-bold text-white tracking-wider">' + name + '的生日</h2>' +
      '</div>' +
      '<div class="p-8 text-center">' +
      '<div id="birthday-countdown" class="text-2xl font-semibold text-gray-700 my-6"></div>' +
      '<div id="birthday-lottery" class="hidden my-8">' +
      '<div class="w-32 h-1 bg-sky-300 mx-auto rounded-full mb-4"></div>' +
      '<h3 class="text-xl font-bold text-blue-600 mb-4">🎂 生日专属微信红包抽奖 🎂</h3>' +
      '<button id="lottery-btn" class="bg-blue-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-600 transition-colors mb-4">' +
      '点击抽取生日微信红包' +
      '</button>' +
      '<div id="lottery-result" class="text-lg text-gray-800 font-bold hidden mt-4 min-h-[24px] text-blue-600"></div>' +
      '</div>' +
      '<div class="w-24 h-1 bg-sky-200 mx-auto rounded-full"></div>' +
      '<p class="mt-6 text-gray-500 text-sm">专属生日祝福 · 快乐永存</p>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  // 拼接页面头部和修正后的核心脚本
  return generateCommonHead() +
    '<script src="https://cdn.tailwindcss.com"></script>' +
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">' +
    pageContent +
    '<script>' +
    'document.addEventListener(\'DOMContentLoaded\', function() {' +
    'let hasDrawnLottery = false;' +
    'const prizes = [' +
    '\'微信红包1.88元\',' +
    '\'微信红包2.88元\',' +
    '\'微信红包3.88元\',' +
    '\'微信红包4.88元\',' +
    '\'微信红包5.88元\',' +
    '\'微信红包6.88元\',' +
    '\'微信红包8.88元\',' +
    '\'微信红包58.88元\'' +
    '];' +
    'const countdownEl = document.getElementById(\'birthday-countdown\');' +
    'const lotteryModule = document.getElementById(\'birthday-lottery\');' +
    'const lotteryBtn = document.getElementById(\'lottery-btn\');' +
    'const lotteryResult = document.getElementById(\'lottery-result\');' +
    'function drawLottery() {' +
    'if (hasDrawnLottery) {' +
    'alert(\'你已经抽过奖啦，祝你生日快乐！\');' +
    'return;' +
    '}' +
    'if (!lotteryBtn || !lotteryResult) return;' +
    'lotteryBtn.disabled = true;' +
    'lotteryBtn.textContent = \'正在抽奖...\';' +
    'lotteryResult.classList.remove(\'hidden\');' +
    'lotteryResult.textContent = \'\';' +
    'let rollCount = 0;' +
    'const rollInterval = setInterval(function() {' +
    'const randomIndex = Math.floor(Math.random() * prizes.length);' +
    // 关键修正：替换模板字符串为 ES5 拼接
    'lotteryResult.textContent = \'正在抽取：\' + prizes[randomIndex];' +
    'rollCount++;' +
    'if (rollCount >= 20) {' +
    'clearInterval(rollInterval);' +
    'const finalIndex = Math.floor(Math.random() * prizes.length);' +
    // 关键修正：替换模板字符串为 ES5 拼接
    'lotteryResult.textContent = \'🎉 恭喜抽中：\' + prizes[finalIndex] + \' 🎉\';' +
    'hasDrawnLottery = true;' +
    'lotteryBtn.textContent = \'已抽奖，生日快乐！\';' +
    'lotteryBtn.style.backgroundColor = \'#9CA3AF\';' +
    'lotteryBtn.style.cursor = \'not-allowed\';' +
    'lotteryBtn.classList.remove(\'hover:bg-orange-600\', \'hover:bg-blue-600\');' +
    '}' +
    '}, 150);' +
    '}' +
    'function updateCountdown() {' +
    'if (!countdownEl) return;' +
    'const now = new Date();' +
    'const birthDate = new Date(\'' + date + '\');' +
    'let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());' +
    'if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);' +
    'const diffTime = nextBirthday - now;' +
    'const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));' +
    'const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));' +
    'const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));' +
    'const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);' +
    'const isBirthdayToday = (' +
    'now.getMonth() === birthDate.getMonth() &&' +
    'now.getDate() === birthDate.getDate()' +
    ');' +
    'if (isBirthdayToday) {' +
    'countdownEl.textContent = \'🎊 今天就是你的生日啦！生日快乐！ 🎊\';' +
    'if (lotteryModule) {' +
    'lotteryModule.classList.remove(\'hidden\');' +
    'lotteryModule.style.display = \'block\';' +
    '}' +
    'if (lotteryBtn && !lotteryBtn.hasEventListener) {' +
    'lotteryBtn.addEventListener(\'click\', drawLottery);' +
    'lotteryBtn.hasEventListener = true;' +
    '}' +
    '} else {' +
    // 关键修正：替换模板字符串为 ES5 拼接
    'countdownEl.textContent = \'距离你的生日还有：\' + days + \'天\' + hours + \'时\' + minutes + \'分\' + seconds + \'秒\';' +
    'if (lotteryModule) {' +
    'lotteryModule.classList.add(\'hidden\');' +
    'lotteryModule.style.display = \'none\';' +
    '}' +
    '}' +
    '}' +
    'updateCountdown();' +
    'setInterval(updateCountdown, 1000);' +
    '});' +
    '</script>';
}
