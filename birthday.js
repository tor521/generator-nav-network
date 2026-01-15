import { generateCommonHead } from './utils.js';

// 生成生日分类分享页面（模板1/2）
export function generateBirthdayPage(data) {
  const { template, previewData } = data;
  const { name, date } = previewData;
  let pageContent = '';

  // 通用抽奖模块（抽离公共逻辑，模板1/2共用）
  const lotteryModule = `
    <style>
      .lottery-btn {
        background: linear-gradient(to right, #f97316, #ea580c);
        color: white;
        border: none;
        padding: 12px 32px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 20px;
      }
      .lottery-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
      }
      .lottery-btn:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
      }
      .lottery-result {
        margin-top: 20px;
        padding: 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.9);
        color: #1f2937;
        font-size: 18px;
        font-weight: 600;
        display: none;
      }
      .lottery-tips {
        margin-top: 12px;
        color: #6b7280;
        font-size: 14px;
      }
    </style>

    <!-- 抽奖区域（默认隐藏，生日当天显示） -->
    <div id="lottery-container" style="display: none;">
      <button id="lottery-btn" class="lottery-btn">点击抽微信红包</button>
      <div id="lottery-result" class="lottery-result"></div>
      <div id="lottery-tips" class="lottery-tips"></div>
    </div>

    <script>
      // 奖品池配置
      const prizes = [
        { amount: 0.88, text: '0.88元微信红包' },
        { amount: 5.88, text: '5.88元微信红包' },
        { amount: 6.88, text: '6.88元微信红包' },
        { amount: 8.88, text: '8.88元微信红包' },
        { amount: 18.88, text: '18.88元微信红包' },
        { amount: 58.88, text: '58.88元微信红包' }
      ];

      // 生成用户唯一标识（基于浏览器指纹，简化版）
      function getUserId() {
        const fingerprint = [
          navigator.userAgent,
          screen.width,
          screen.height,
          navigator.language
        ].join('|');
        return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '');
      }

      // KV操作封装（假设环境已提供KV读写API，需根据实际环境适配）
      const KV = {
        // 读取KV值
        async get(key) {
          try {
            return await kv.get(key); // 替换为实际KV读取方法
          } catch (e) {
            console.error('KV读取失败:', e);
            return null;
          }
        },
        // 写入KV值
        async set(key, value) {
          try {
            await kv.put(key, value); // 替换为实际KV写入方法
          } catch (e) {
            console.error('KV写入失败:', e);
          }
        }
      };

      // 初始化抽奖状态
      async function initLottery() {
        const now = new Date();
        const birthDate = new Date('${date}');
        const isToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
        
        // 非生日当天，不显示抽奖区域
        if (!isToday) return;

        const userId = getUserId();
        const lotteryKey = \`lottery_${name}_\${userId}\`; // 唯一抽奖标识（姓名+用户ID）
        const lotteryContainer = document.getElementById('lottery-container');
        const lotteryBtn = document.getElementById('lottery-btn');
        const lotteryResult = document.getElementById('lottery-result');
        const lotteryTips = document.getElementById('lottery-tips');

        // 显示抽奖区域
        lotteryContainer.style.display = 'block';

        // 检查是否已抽奖
        const hasLottery = await KV.get(lotteryKey);
        if (hasLottery) {
          lotteryBtn.disabled = true;
          lotteryBtn.textContent = '今日已抽奖';
          lotteryTips.textContent = '每个用户生日当天仅可抽奖1次，感谢参与！';
          return;
        }

        // 绑定抽奖点击事件
        lotteryBtn.addEventListener('click', async () => {
          try {
            // 禁用按钮防止重复点击
            lotteryBtn.disabled = true;
            lotteryBtn.textContent = '正在抽奖...';

            // 随机抽取奖品
            const randomIndex = Math.floor(Math.random() * prizes.length);
            const prize = prizes[randomIndex];

            // 记录抽奖结果到KV（TIME_KV空间）
            await KV.set(lotteryKey, JSON.stringify({
              prize: prize.amount,
              time: new Date().toISOString(),
              name: '${name}'
            }));

            // 显示抽奖结果
            lotteryResult.style.display = 'block';
            lotteryResult.textContent = \`恭喜你抽中：\${prize.text} 🎉\`;
            lotteryBtn.textContent = '今日已抽奖';
            lotteryTips.textContent = '红包将自动发放至你的微信账户，请注意查收！';
          } catch (e) {
            console.error('抽奖失败:', e);
            lotteryBtn.disabled = false;
            lotteryBtn.textContent = '点击抽微信红包';
            lotteryTips.textContent = '抽奖失败，请稍后重试！';
          }
        });
      }

      // 页面加载后初始化抽奖功能
      window.onload = async () => {
        await initLottery();
      };
    </script>
  `;

  // 模板1：经典版（新增抽奖模块）
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
            <!-- 插入抽奖模块 -->
            ${lotteryModule}
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

  // 模板2：酷炫赛博朋克风（新增抽奖模块）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] relative overflow-hidden">
        <!-- 背景装饰：动态网格线+光点 -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,69,255,0.15),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(45,212,191,0.15),transparent_40%)]"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><path fill=\'none\' stroke=\'rgba(120,69,255,0.05)\' stroke-width=\'0.5\' d=\'M0 50h100M50 0v100\'/></svg>')] repeat"></div>
        
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
          
          <!-- 2. 倒计时核心区域：数字卡片组+文案 -->
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
                <!-- 文案会通过JS动态填充 -->
              </div>
            </div>
            
            <!-- 插入抽奖模块（赛博朋克风格适配） -->
            <div style="width: 100%; max-width: 400px; text-align: center;">
              ${lotteryModule.replace(
                '.lottery-btn {',
                '.lottery-btn { background: linear-gradient(to right, #7844FF, #2DD4BF); border: 1px solid rgba(120, 69, 255, 0.5); box-shadow: 0 0 15px rgba(120, 69, 255, 0.3);'
              ).replace(
                '.lottery-btn:hover:not(:disabled) {',
                '.lottery-btn:hover:not(:disabled) { box-shadow: 0 0 25px rgba(45, 212, 191, 0.5);'
              ).replace(
                '.lottery-result {',
                '.lottery-result { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(120, 69, 255, 0.4); color: #fff;'
              ).replace(
                '.lottery-tips {',
                '.lottery-tips { color: #A1A1AA;'
              )}
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
          
          if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
          const diffTime = nextBirthday - now;
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
          
          const isToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
          let tipText = '';
          
          if (isToday) {
            tipText = \`
              <p class="text-xl md:text-2xl text-white mb-2">🎊 生辰吉乐 · 万事胜意 🎊</p>
              <p class="text-[#2DD4BF] font-bold text-lg md:text-xl drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">
                祝\${name}今天快乐，永远快乐！
              </p>
            \`;
          } else {
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
          
          document.getElementById('birthday-countdown-2').innerHTML = tipText;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}
