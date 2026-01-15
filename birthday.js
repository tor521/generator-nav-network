import { generateCommonHead } from './utils.js';

// 生成生日分类分享页面（模板1/2）
export function generateBirthdayPage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  let pageContent = '';

  // 固定奖品池：指定金额的微信红包
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

  // 模板1：经典暖色调版（生日抽奖功能）
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

  // 模板2：清新蓝调版（生日抽奖功能）
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

  // 拼接页面头部和核心脚本（两个模板共用同一套逻辑）
  return `
    ${generateCommonHead()}
    ${pageContent}
    <script>
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

      // 抽奖核心函数（抽完后无法重复触发）
      function drawLottery() {
        // 1. 防重复判断：已抽奖则直接返回，不执行后续逻辑
        if (hasDrawnLottery) {
          alert('你已经抽过奖啦，祝你生日快乐！');
          return;
        }
        
        const btn = document.getElementById('lottery-btn');
        const resultEl = document.getElementById('lottery-result');
        
        // 2. 禁用按钮并修改状态（视觉+功能双重防重复）
        btn.disabled = true;
        btn.textContent = '正在抽奖...';
        resultEl.classList.remove('hidden');
        resultEl.textContent = '';
        
        // 3. 模拟抽奖滚动动效（提升交互体验）
        let rollCount = 0;
        const rollInterval = setInterval(() => {
          const randomIndex = Math.floor(Math.random() * prizes.length);
          resultEl.textContent = `正在抽取：${prizes[randomIndex]}`;
          rollCount++;
          
          // 4. 停止滚动并展示最终结果
          if (rollCount >= 20) {
            clearInterval(rollInterval);
            const finalIndex = Math.floor(Math.random() * prizes.length);
            resultEl.textContent = `🎉 恭喜抽中：${prizes[finalIndex]} 🎉`;
            
            // 5. 标记为已抽奖（永久锁定，当前会话内有效）
            hasDrawnLottery = true;
            
            // 6. 修改按钮样式和文本，明确已抽奖状态
            btn.textContent = '已抽奖，生日快乐！';
            btn.style.backgroundColor = '#9CA3AF';
            btn.style.cursor = 'not-allowed';
            btn.classList.remove('hover:bg-orange-600', 'hover:bg-blue-600');
          }
        }, 150);
      }

      // 更新倒计时并判断是否为生日当天
      function updateCountdown() {
        const now = new Date();
        const birthDate = new Date('${date}');
        const currentBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        // 计算下一个生日（用于倒计时展示）
        let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
        
        const diffTime = nextBirthday - now;
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        // 判断是否为生日当天（年月日一致）
        const isBirthdayToday = (
          now.getFullYear() === currentBirthday.getFullYear() &&
          now.getMonth() === currentBirthday.getMonth() &&
          now.getDate() === currentBirthday.getDate()
        );

        // 渲染倒计时内容
        const countdownEl = document.getElementById('birthday-countdown');
        if (isBirthdayToday) {
          countdownEl.textContent = '🎊 今天就是你的生日啦！生日快乐！ 🎊';
          // 生日当天：显示抽奖模块
          document.getElementById('birthday-lottery').classList.remove('hidden');
          // 绑定抽奖按钮点击事件（仅绑定一次）
          document.getElementById('lottery-btn').addEventListener('click', drawLottery);
        } else {
          countdownEl.textContent = `距离你的生日还有：${days}天${hours}时${minutes}分${seconds}秒`;
          // 非生日当天：隐藏抽奖模块
          document.getElementById('birthday-lottery').classList.add('hidden');
        }
      }

      // 初始化倒计时并每秒更新
      updateCountdown();
      setInterval(updateCountdown, 1000);
    </script>
  `;
}
