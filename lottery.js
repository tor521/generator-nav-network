// lottery.js - 抽奖模板生成逻辑（两个差异化模板）
import { generateCommonHead } from './utils.js';
export function generateLotteryPage(data) {
  const { previewData, template } = data;
  // 解构自定义参数，提供默认值防止报错
  const {
    title = '未知抽奖活动',
    prizes = '无奖品',
    time = '未设置',
    drawCount = 1,
    name = '幸运用户'
  } = previewData;

  // 格式化时间（兼容 datetime-local 格式和普通文本）
  const formatTime = (timeStr) => {
    if (!timeStr) return '未设置';
    try {
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return timeStr;
    }
  };
  const formattedTime = formatTime(time);

  // 处理奖品列表（逗号分隔转数组，去空去重）
  const prizeList = prizes.split(',')
    .map(prize => prize.trim())
    .filter(prize => prize);

  // 模板1：经典喜庆风格（暖色调、传统排版，适合节日/生日抽奖）
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
    .footer { margin-top: 30px; color: #666; font-size: 1rem; }
    @media (max-width: 480px) {
      .lottery-card { padding: 25px; }
      .title { font-size: 2rem; }
    }
  </style>
</head>
<body>
  <div class="lottery-card">
    <h1 class="title">🎉 ${title} 🎉</h1>
    <div class="info-item">📅 抽奖时间：${formattedTime}</div>
    <div class="count-box">🎁 每人可抽奖次数：${drawCount} 次</div>
    <div class="prizes-title">🎯 奖品列表</div>
    <ul class="prize-list">
      ${prizeList.map(prize => `<li class="prize-item">${prize}</li>`).join('')}
    </ul>
    <div class="footer">祝 ${name} 好运连连，抽中大奖！</div>
  </div>
</body>
</html>
    `;
  }

  // 模板2：科技简约风格（深色背景、模糊效果，适合企业/活动抽奖）
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
    .footer { color: #94a3b8; font-size: 0.95rem; }
    @media (max-width: 480px) {
      .lottery-card { padding: 25px; }
      .title { font-size: 1.8rem; }
      .info-wrapper { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="lottery-card">
    <h1 class="title">✨ ${title} ✨</h1>
    <div class="info-wrapper">
      <div class="info-item">📅 抽奖时间：${formattedTime}</div>
      <div class="info-item">👤 参与用户：${name || '所有用户'}</div>
    </div>
    <div class="count-box">🎮 可抽奖次数：${drawCount} 次/人</div>
    <div class="prizes-title">🏆 奖品池</div>
    <ul class="prize-list">
      ${prizeList.map(prize => `<li class="prize-item">${prize}</li>`).join('')}
    </ul>
    <div class="footer">本次活动最终解释权归主办方所有</div>
  </div>
</body>
</html>
    `;
  }

  // 默认返回模板1（防止无效模板值）
  return generateLotteryPage({
    previewData,
    template: '1'
  });
}