import { generateCommonHead } from './utils.js';
// lottery.js - 抽奖模板生成逻辑（解决参与人验证、刷新重置抽奖次数问题）
export function generateLotteryPage(data) {
  // 容错处理：防止传入data为空或格式异常
  if (!data || typeof data !== 'object') {
    data = {
      previewData: {},
      template: '1'
    };
  }

  const { previewData, template } = data;
  // 解构自定义参数，提供更严谨的默认值
  const {
    title = '未知抽奖活动',
    prizes = '无奖品',
    time = '未设置',
    drawCount = 1,
    name = '幸运用户' // 表单必填的参与人总名称（如「公司员工」），同时作为验证基准
  } = previewData || {};

  // 格式化时间 - 适配日期格式（YYYY-MM-DD），显示为"XXXX年XX月XX日"（一整天）
  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === '未设置') return '未设置';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) {
        return timeStr;
      }
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'long'
      });
    } catch (e) {
      return timeStr;
    }
  };
  const formattedTime = formatTime(time);

  // 处理奖品列表 - 支持中文逗号（，）分隔，同时兼容英文逗号（,）
  const prizeList = prizes.split(/[,，]/)
    .map(prize => prize.trim())
    .filter(prize => prize && prize.length > 0);

  // 容错：如果奖品列表为空，补充默认值
  if (prizeList.length === 0) {
    prizeList.push('无有效奖品配置');
  }

  // 容错：确保drawCount是合法数字
  const validDrawCount = Number.isInteger(Number(drawCount)) && Number(drawCount) > 0 
    ? Number(drawCount) 
    : 1;

  // 生成唯一抽奖活动标识（用于localStorage键名，防止多个活动数据冲突）
  const lotteryActivityKey = `lottery_${escapeHtml(title)}_${formattedTime}`.replace(/\s+/g, '_');

  // 模板1：经典喜庆风格（解决两个核心问题）
  if (template === '1') {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 抽奖活动</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "Microsoft YaHei", "Heiti SC", sans-serif; background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; }
    .lottery-card { background: #fff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 600px; width: 100%; text-align: center; }
    .title { color: #e63946; font-size: 2.5rem; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
    .info-item { margin: 15px 0; font-size: 1.2rem; color: #333; }
    .prizes-title { font-size: 1.5rem; color: #d62828; margin: 25px 0 15px; font-weight: bold; }
    .prize-list { list-style: none; margin: 10px 0; }
    .prize-item { background: #fefae0; padding: 10px; margin: 8px 0; border-radius: 8px; color: #023e8a; font-size: 1.1rem; }
    .count-box { background: #ffb703; color: #fff; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 1.3rem; font-weight: bold; }
    /* 新增：参与人验证输入框样式 */
    .verify-box { margin: 20px 0; }
    .verify-input { padding: 12px 20px; width: 80%; border: 2px solid #e63946; border-radius: 50px; font-size: 1.1rem; text-align: center; outline: none; }
    .verify-input:focus { border-color: #d62828; box-shadow: 0 0 10px rgba(230, 57, 70, 0.2); }
    .verify-tip { color: #ff0000; font-size: 0.9rem; margin-top: 10px; display: none; }
    /* 抽奖按钮样式 */
    .lottery-btn { background: #e63946; color: #fff; border: none; border-radius: 50px; padding: 18px 40px; font-size: 1.4rem; font-weight: bold; cursor: pointer; margin: 20px 0; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(230, 57, 70, 0.3); }
    .lottery-btn:hover { background: #d62828; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(230, 57, 70, 0.4); }
    .lottery-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
    /* 中奖结果展示样式 */
    .result-box { background: #f77f00; color: #fff; padding: 20px; border-radius: 12px; margin: 20px 0; font-size: 1.5rem; font-weight: bold; display: none; }
    .footer { margin-top: 30px; color: #666; font-size: 1rem; }
    @media (max-width: 480px) {
      .lottery-card { padding: 25px; }
      .title { font-size: 2rem; }
      .verify-input { width: 90%; }
      .lottery-btn { padding: 15px 30px; font-size: 1.2rem; }
    }
  </style>
</head>
<body>
  <div class="lottery-card">
    <h1 class="title">🎉 ${escapeHtml(title)} 🎉</h1>
    <div class="info-item">📅 抽奖日期：${escapeHtml(formattedTime)}（全天）</div>
    <div class="info-item">👤 活动参与对象：${escapeHtml(name)}</div>
    <div class="count-box">🎁 每人可抽奖次数：${validDrawCount} 次</div>
    
    <!-- 新增：参与人身份验证模块 -->
    <div class="verify-box">
      <input type="text" class="verify-input" id="userVerifyInput" placeholder="请输入你的姓名（验证身份后才能抽奖）">
      <div class="verify-tip" id="verifyTip">身份验证失败，请输入正确的参与人姓名！</div>
    </div>

    <div class="prizes-title">🎯 奖品列表</div>
    <ul class="prize-list">
      ${prizeList.map(prize => `<li class="prize-item">${escapeHtml(prize)}</li>`).join('')}
    </ul>
    
    <!-- 抽奖按钮 -->
    <button class="lottery-btn" id="lotteryBtn" disabled>请先完成身份验证 📝</button>
    <!-- 中奖结果展示框 -->
    <div class="result-box" id="resultBox"></div>
    <div class="footer">祝所有参与用户好运连连，抽中大奖！</div>
  </div>

  <script>
    // ********** 解决问题1：参与人验证 **********
    const verifyInput = document.getElementById('userVerifyInput');
    const verifyTip = document.getElementById('verifyTip');
    const lotteryBtn = document.getElementById('lotteryBtn');
    const resultBox = document.getElementById('resultBox');
    const prizeList = ${JSON.stringify(prizeList)};
    const maxDrawCount = ${validDrawCount}; // 最大抽奖次数
    const activityParticipant = "${escapeHtml(name)}"; // 活动参与对象（验证基准）
    const lotteryActivityKey = "${lotteryActivityKey}"; // 本地存储唯一标识

    // ********** 解决问题2：localStorage 持久化抽奖次数 **********
    // 从本地存储获取剩余抽奖次数，无数据则初始化
    let remainingDraws = localStorage.getItem(lotteryActivityKey);
    remainingDraws = remainingDraws ? Number(remainingDraws) : maxDrawCount;

    // 页面加载完成后，更新按钮状态（兼容刷新后场景）
    window.onload = function() {
      updateLotteryBtnState();
      // 如果已用完抽奖次数，直接提示
      if (remainingDraws <= 0) {
        lotteryBtn.textContent = '抽奖次数已用完 🎯';
        verifyInput.disabled = true;
      }
    };

    // 1. 参与人身份验证逻辑（输入框实时校验）
    verifyInput.addEventListener('input', function() {
      const userInput = this.value.trim();
      const isVerified = verifyParticipant(userInput);

      // 隐藏验证提示
      verifyTip.style.display = 'none';

      // 更新抽奖按钮状态
      if (isVerified && remainingDraws > 0) {
        lotteryBtn.disabled = false;
        lotteryBtn.textContent = '点击抽奖 🎲';
      } else if (remainingDraws <= 0) {
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = '抽奖次数已用完 🎯';
      } else {
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = '请先完成身份验证 📝';
      }
    });

    // 2. 身份验证核心函数（可扩展：支持模糊匹配、白名单等）
    function verifyParticipant(userInput) {
      if (!userInput || !activityParticipant) return false;

      // 验证规则：① 输入内容不为空 ② 包含在活动参与对象中（或完全匹配，可自定义）
      // 示例：活动对象是「公司员工」，输入「张三」（员工姓名）可通过；也可改为完全匹配
      const isMatched = userInput.length > 0 && activityParticipant.includes(userInput);
      return isMatched;
    }

    // 3. 抽奖按钮点击事件（包含验证、开奖、持久化）
    lotteryBtn.addEventListener('click', function() {
      const userInput = verifyInput.value.trim();
      const isVerified = verifyParticipant(userInput);

      // 二次验证（防止绕过输入框直接点击）
      if (!isVerified) {
        verifyTip.style.display = 'block';
        return;
      }

      if (remainingDraws <= 0) {
        alert('你的抽奖次数已用完！');
        return;
      }

      // 禁用按钮和输入框，防止重复操作
      lotteryBtn.disabled = true;
      verifyInput.disabled = true;
      lotteryBtn.textContent = '正在开奖... 🌀';
      resultBox.style.display = 'none';

      // 模拟开奖动画（延迟1.5秒）
      setTimeout(() => {
        // 随机抽取奖品
        const randomIndex = Math.floor(Math.random() * prizeList.length);
        const winningPrize = prizeList[randomIndex];

        // 更新剩余抽奖次数并持久化到localStorage
        remainingDraws--;
        localStorage.setItem(lotteryActivityKey, remainingDraws);

        // 显示中奖结果
        resultBox.style.display = 'block';
        resultBox.innerHTML = \`恭喜你！抽中：<br/>「\${winningPrize}」\`;

        // 恢复输入框可用（如需多次抽奖），更新按钮状态
        verifyInput.disabled = false;
        updateLotteryBtnState();

        // 提示剩余次数
        if (remainingDraws > 0 && remainingDraws < maxDrawCount) {
          alert(\`你还有 \${remainingDraws} 次抽奖机会！\`);
        }
      }, 1500);
    });

    // 4. 更新抽奖按钮状态辅助函数
    function updateLotteryBtnState() {
      const userInput = verifyInput.value.trim();
      const isVerified = verifyParticipant(userInput);

      if (remainingDraws <= 0) {
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = '抽奖次数已用完 🎯';
      } else if (isVerified) {
        lotteryBtn.disabled = false;
        lotteryBtn.textContent = \`点击抽奖（剩余\${remainingDraws}次） 🎲\`;
      } else {
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = '请先完成身份验证 📝';
      }
    }
  </script>
</body>
</html>
    `.trim();
  }

  // 模板2：科技简约风格（解决两个核心问题）
  if (template === '2') {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 抽奖活动</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "Inter", "Roboto", sans-serif; background: #0f172a; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; color: #fff; }
    .lottery-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; backdrop-filter: blur(10px); max-width: 600px; width: 100%; text-align: center; }
    .title { color: #38bdf8; font-size: 2.2rem; margin-bottom: 25px; letter-spacing: 1px; }
    .info-wrapper { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; }
    .info-item { background: rgba(56, 189, 248, 0.1); padding: 12px 20px; border-radius: 8px; font-size: 1.1rem; flex: 1; min-width: 200px; }
    .prizes-title { color: #a78bfa; font-size: 1.4rem; margin-bottom: 15px; font-weight: 600; }
    .prize-list { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 25px; }
    .prize-item { background: rgba(167, 139, 250, 0.1); padding: 15px; border-radius: 8px; color: #e0e7ff; transition: transform 0.3s; }
    .prize-item:hover { transform: translateY(-5px); }
    .count-box { color: #fcd34d; font-size: 1.2rem; margin-bottom: 20px; font-weight: 600; }
    /* 新增：参与人验证输入框样式 */
    .verify-box { margin: 20px 0; }
    .verify-input { padding: 12px 20px; width: 80%; border: 2px solid #38bdf8; border-radius: 8px; font-size: 1.1rem; text-align: center; outline: none; background: rgba(255,255,255,0.05); color: #fff; }
    .verify-input:focus { border-color: #0ea5e9; box-shadow: 0 0 10px rgba(56, 189, 248, 0.2); }
    .verify-tip { color: #ff4d4f; font-size: 0.9rem; margin-top: 10px; display: none; }
    /* 抽奖按钮样式（科技风） */
    .lottery-btn { background: #38bdf8; color: #fff; border: none; border-radius: 8px; padding: 18px 40px; font-size: 1.4rem; font-weight: bold; cursor: pointer; margin: 20px 0; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(56, 189, 248, 0.3); }
    .lottery-btn:hover { background: #0ea5e9; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(56, 189, 248, 0.4); }
    .lottery-btn:disabled { background: #64748b; cursor: not-allowed; transform: none; box-shadow: none; }
    /* 中奖结果展示样式（科技风） */
    .result-box { background: rgba(167, 139, 250, 0.2); border: 1px solid rgba(167, 139, 250, 0.3); color: #e0e7ff; padding: 20px; border-radius: 12px; margin: 20px 0; font-size: 1.5rem; font-weight: bold; display: none; }
    .footer { color: #94a3b8; font-size: 0.95rem; }
    @media (max-width: 480px) {
      .lottery-card { padding: 25px; }
      .title { font-size: 1.8rem; }
      .info-wrapper { flex-direction: column; }
      .verify-input { width: 90%; }
      .lottery-btn { padding: 15px 30px; font-size: 1.2rem; }
    }
  </style>
</head>
<body>
  <div class="lottery-card">
    <h1 class="title">✨ ${escapeHtml(title)} ✨</h1>
    <div class="info-wrapper">
      <div class="info-item">📅 抽奖日期：${escapeHtml(formattedTime)}（全天）</div>
      <div class="info-item">👤 活动参与对象：${escapeHtml(name)}</div>
    </div>
    <div class="count-box">🎮 可抽奖次数：${validDrawCount} 次/人</div>
    
    <!-- 新增：参与人身份验证模块 -->
    <div class="verify-box">
      <input type="text" class="verify-input" id="userVerifyInput" placeholder="请输入你的姓名（验证身份后才能抽奖）">
      <div class="verify-tip" id="verifyTip">身份验证失败，请输入正确的参与人姓名！</div>
    </div>

    <div class="prizes-title">🏆 奖品池</div>
    <ul class="prize-list">
      ${prizeList.map(prize => `<li class="prize-item">${escapeHtml(prize)}</li>`).join('')}
    </ul>
    
    <!-- 抽奖按钮 -->
    <button class="lottery-btn" id="lotteryBtn" disabled>请先完成身份验证 📝</button>
    <!-- 中奖结果展示框 -->
    <div class="result-box" id="resultBox"></div>
    <div class="footer">本次活动最终解释权归主办方所有</div>
  </div>

  <script>
    // ********** 解决问题1：参与人验证 **********
    const verifyInput = document.getElementById('userVerifyInput');
    const verifyTip = document.getElementById('verifyTip');
    const lotteryBtn = document.getElementById('lotteryBtn');
    const resultBox = document.getElementById('resultBox');
    const prizeList = ${JSON.stringify(prizeList)};
    const maxDrawCount = ${validDrawCount};
    const activityParticipant = "${escapeHtml(name)}";
    const lotteryActivityKey = "${lotteryActivityKey}";

    // ********** 解决问题2：localStorage 持久化抽奖次数 **********
    let remainingDraws = localStorage.getItem(lotteryActivityKey);
    remainingDraws = remainingDraws ? Number(remainingDraws) : maxDrawCount;

    // 页面加载完成后更新状态
    window.onload = function() {
      updateLotteryBtnState();
      if (remainingDraws <= 0) {
        lotteryBtn.textContent = '抽奖次数已用完 🎯';
        verifyInput.disabled = true;
      }
    };

    // 1. 参与人身份验证（实时校验）
    verifyInput.addEventListener('input', function() {
      const userInput = this.value.trim();
      const isVerified = verifyParticipant(userInput);

      verifyTip.style.display = 'none';

      if (isVerified && remainingDraws > 0) {
        lotteryBtn.disabled = false;
        lotteryBtn.textContent = '点击抽奖 🎲';
      } else if (remainingDraws <= 0) {
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = '抽奖次数已用完 🎯';
      } else {
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = '请先完成身份验证 📝';
      }
    });

    // 2. 身份验证核心函数
    function verifyParticipant(userInput) {
      if (!userInput || !activityParticipant) return false;
      // 可自定义验证规则（如白名单、模糊匹配、完全匹配等）
      return userInput.length > 0 && activityParticipant.includes(userInput);
    }

    // 3. 抽奖逻辑（包含持久化）
    lotteryBtn.addEventListener('click', function() {
      const userInput = verifyInput.value.trim();
      const isVerified = verifyParticipant(userInput);

      if (!isVerified) {
        verifyTip.style.display = 'block';
        return;
      }

      if (remainingDraws <= 0) {
        alert('你的抽奖次数已用完！');
        return;
      }

      lotteryBtn.disabled = true;
      verifyInput.disabled = true;
      lotteryBtn.textContent = '正在开奖... 🌀';
      resultBox.style.display = 'none';

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * prizeList.length);
        const winningPrize = prizeList[randomIndex];

        // 持久化剩余次数
        remainingDraws--;
        localStorage.setItem(lotteryActivityKey, remainingDraws);

        // 展示结果
        resultBox.style.display = 'block';
        resultBox.innerHTML = \`恭喜你！抽中：<br/>「\${winningPrize}」\`;

        // 更新状态
        verifyInput.disabled = false;
        updateLotteryBtnState();

        if (remainingDraws > 0 && remainingDraws < maxDrawCount) {
          alert(\`你还有 \${remainingDraws} 次抽奖机会！\`);
        }
      }, 1500);
    });

    // 4. 更新按钮状态
    function updateLotteryBtnState() {
      const userInput = verifyInput.value.trim();
      const isVerified = verifyParticipant(userInput);

      if (remainingDraws <= 0) {
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = '抽奖次数已用完 🎯';
      } else if (isVerified) {
        lotteryBtn.disabled = false;
        lotteryBtn.textContent = \`点击抽奖（剩余\${remainingDraws}次） 🎲\`;
      } else {
        lotteryBtn.disabled = true;
        lotteryBtn.textContent = '请先完成身份验证 📝';
      }
    }
  </script>
</body>
</html>
    `.trim();
  }

  // 默认返回模板1
  return generateLotteryPage({
    previewData: data.previewData,
    template: '1'
  });
}

// HTML转义函数（防止XSS）
function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => escapeMap[char] || char);
}

