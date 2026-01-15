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
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-center">
            <i class="fa-solid fa-cake-candles text-4xl text-white mb-2"></i>
            <h2 class="text-2xl font-bold text-white tracking-wider">${name}的生日</h2>
          </div>
          <div class="p-8 text-center">
            <div id="birthday-countdown" class="text-2xl font-semibold text-gray-700 my-6"></div>
            <!-- 生日抽奖模块（默认隐藏） -->
            <div id="birthday-lottery" class="hidden my-8">
              <div class="w-32 h-1 bg-amber-300 mx-auto rounded-full mb-4"></div>
              <h3 class="text-xl font-bold text-amber-600 mb-4">🎂 生日专属微信红包抽奖 🎂</h3>
              <button id="lottery-btn" class="bg-orange-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-orange-600 transition-colors mb-4">
                点击抽取生日微信红包
              </button>
              <div id="lottery-result" class="text-lg text-gray-800 font-bold hidden mt-4 min-h-[24px] text-green-600"></div>
            </div>
            <div class="w-24 h-1 bg-amber-200 mx-auto rounded-full"></div>
            <p class="mt-6 text-gray-500 text-sm">专属生日祝福 · 快乐永存</p>
          </div>
        </div>
      </div>
    `;
  }

  // 模板2：清新蓝调版
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 to-blue-50">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100">
          <div class="bg-gradient-to-r from-sky-500 to-blue-500 py-6 text-center">
            <i class="fa-solid fa-birthday-cake text-4xl text-white mb-2"></i>
            <h2 class="text-2xl font-bold text-white tracking-wider">${name}的生日</h2>
          </div>
          <div class="p-8 text-center">
            <div id="birthday-countdown" class="text-2xl font-semibold text-gray-700 my-6"></div>
            <!-- 生日抽奖模块（默认隐藏） -->
            <div id="birthday-lottery" class="hidden my-8">
              <div class="w-32 h-1 bg-sky-300 mx-auto rounded-full mb-4"></div>
              <h3 class="text-xl font-bold text-blue-600 mb-4">🎂 生日专属微信红包抽奖 🎂</h3>
              <button id="lottery-btn" class="bg-blue-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-600 transition-colors mb-4">
                点击抽取生日微信红包
              </button>
              <div id="lottery-result" class="text-lg text-gray-800 font-bold hidden mt-4 min-h-[24px] text-blue-600"></div>
            </div>
            <div class="w-24 h-1 bg-sky-200 mx-auto rounded-full"></div>
            <p class="mt-6 text-gray-500 text-sm">专属生日祝福 · 快乐永存</p>
          </div>
        </div>
      </div>
    `;
  }

  // 拼接页面头部和修正后的核心脚本
  return `
    ${generateCommonHead()}
    <!-- 确保引入Tailwind CSS和Font Awesome（兜底，防止generateCommonHead缺失） -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    ${pageContent}
    <script>
      // 1. 等待DOM完全加载完成后再执行所有逻辑，避免元素获取失败
      document.addEventListener('DOMContentLoaded', function() {
        // 全局状态：标记是否已抽奖（防止重复抽奖）
        let hasDrawnLottery = false;
        // 固定奖品池：微信红包系列
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

        // 2. 缓存DOM元素，避免重复获取，提高性能+容错
        const countdownEl = document.getElementById('birthday-countdown');
        const lotteryModule = document.getElementById('birthday-lottery');
        const lotteryBtn = document.getElementById('lottery-btn');
        const lotteryResult = document.getElementById('lottery-result');

        // 抽奖核心函数（抽完后无法重复触发）
        function drawLottery() {
          // 防重复判断：已抽奖则直接返回，不执行后续逻辑
          if (hasDrawnLottery) {
            alert('你已经抽过奖啦，祝你生日快乐！');
            return;
          }

          // 容错：判断元素是否存在
          if (!lotteryBtn || !lotteryResult) return;

          // 禁用按钮并修改状态（视觉+功能双重防重复）
          lotteryBtn.disabled = true;
          lotteryBtn.textContent = '正在抽奖...';
          lotteryResult.classList.remove('hidden');
          lotteryResult.textContent = '';

          // 模拟抽奖滚动动效（提升交互体验）
          let rollCount = 0;
          const rollInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * prizes.length);
            lotteryResult.textContent = `正在抽取：${prizes[randomIndex]}`;
            rollCount++;

            // 停止滚动并展示最终结果
            if (rollCount >= 20) {
              clearInterval(rollInterval);
              const finalIndex = Math.floor(Math.random() * prizes.length);
              lotteryResult.textContent = `🎉 恭喜抽中：${prizes[finalIndex]} 🎉`;

              // 标记为已抽奖（永久锁定，当前会话内有效）
              hasDrawnLottery = true;

              // 修改按钮样式和文本，明确已抽奖状态
              lotteryBtn.textContent = '已抽奖，生日快乐！';
              lotteryBtn.style.backgroundColor = '#9CA3AF';
              lotteryBtn.style.cursor = 'not-allowed';
              lotteryBtn.classList.remove('hover:bg-orange-600', 'hover:bg-blue-600');
            }
          }, 150);
        }

        // 3. 更新倒计时并判断是否为生日当天（修正核心：仅对比月、日，忽略年份）
        function updateCountdown() {
          // 容错：倒计时元素不存在则直接返回
          if (!countdownEl) return;

          const now = new Date();
          const birthDate = new Date('${date}');

          // 计算下一个生日（用于倒计时展示）
          let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
          if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);

          // 计算倒计时差值
          const diffTime = nextBirthday - now;
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

          // 修正：生日当天判断（仅对比 月 和 日，忽略年份，符合真实需求）
          const isBirthdayToday = (
            now.getMonth() === birthDate.getMonth() &&
            now.getDate() === birthDate.getDate()
          );

          // 渲染倒计时内容
          if (isBirthdayToday) {
            countdownEl.textContent = '🎊 今天就是你的生日啦！生日快乐！ 🎊';
            // 4. 双重保障显示抽奖模块（移除hidden类 + 手动设置display，防止Tailwind失效）
            if (lotteryModule) {
              lotteryModule.classList.remove('hidden');
              lotteryModule.style.display = 'block';
            }
            // 5. 绑定抽奖按钮点击事件（仅绑定一次，避免重复绑定）
            if (lotteryBtn && !lotteryBtn.hasEventListener) {
              lotteryBtn.addEventListener('click', drawLottery);
              lotteryBtn.hasEventListener = true; // 标记已绑定事件
            }
          } else {
            countdownEl.textContent = `距离你的生日还有：${days}天${hours}时${minutes}分${seconds}秒`;
            // 非生日当天：隐藏抽奖模块（双重保障）
            if (lotteryModule) {
              lotteryModule.classList.add('hidden');
              lotteryModule.style.display = 'none';
            }
          }
        }

        // 初始化倒计时并每秒更新
        updateCountdown();
        setInterval(updateCountdown, 1000);
      });
    </script>
  `;
}
