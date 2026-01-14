/**
 * 公共工具函数 - KV操作/通用渲染
 * 绑定的KV命名空间变量名：TIME_KV
 */

// 生成通用HTML头部（所有页面共用）
export function generateCommonHead() {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <title>@一条无聊的桀</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
  </style>
</head>
`;
}

// 获取分类历史记录（通用逻辑）
export async function getCategoryHistory(env, category) {
  const historyKeys = await env.TIME_KV.list({ prefix: `history:${category}:` });
  const historyList = [];
  for (const key of historyKeys.keys) {
    const value = await env.TIME_KV.get(key.name);
    if (value) historyList.push(JSON.parse(value));
  }
  return historyList.sort((a, b) => b.createTime - a.createTime);
}

// 生成分享ID并存储（通用逻辑）
export async function createShareRecord(env, request, category, template, content, previewData) {
  const shareId = Math.random().toString(36).substring(2, 10);
  const shareKey = `share:${shareId}`;
  
  // 存储分享数据
  await env.TIME_KV.put(shareKey, JSON.stringify({
    category, template, content, previewData,
    createTime: Date.now(),
    shareId
  }));

  // 存储历史记录
  const historyKey = `history:${category}:${Date.now()}`;
  const shareUrl = `${new URL(request.url).origin}/share/${shareId}`;
  const record = {
    id: historyKey,
    category,
    template,
    content,
    shareId,
    shareUrl,
    createTime: Date.now(),
    createTimeText: new Date().toLocaleString()
  };
  await env.TIME_KV.put(historyKey, JSON.stringify(record));

  return { shareUrl, shareId };
}
