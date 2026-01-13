/**
 * 简化版：所有通用工具函数合并在此，无需拆分多个文件
 * 包含：HTML通用生成 + 分享/历史记录通用逻辑
 */

// --------------- 原 html-utils.js 内容 ---------------
/**
 * 生成分类通用HTML结构（复用原有逻辑）
 * @param {string} category 分类标识
 * @param {string} categoryName 分类名称
 * @param {string} colorClass 颜色类名
 * @returns {string} HTML字符串
 */
export function generateCategoryContent(category, categoryName, colorClass) {
  return `
    <div class="bg-white rounded-2xl shadow-md p-6 md:p-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-${colorClass} mb-2">${categoryName}模板生成</h2>
        <p class="text-gray-500">选择模板，填写信息，一键生成专属分享链接</p>
      </div>

      <div class="space-y-6">
        <div>
          <label class="block text-gray-700 mb-2 text-lg">选择模板</label>
          <select class="template-select w-full p-3 border border-gray-300 rounded-lg text-lg" data-category="${category}">
            <option value="1">模板1（经典款）</option>
            <option value="2">模板2（拓展款）</option>
          </select>
        </div>

        ${category === 'festival' ? `
          <div>
            <label for="festival-name" class="block text-gray-700 mb-2 text-lg">节日名称</label>
            <input type="text" id="festival-name" class="w-full p-3 border border-gray-300 rounded-lg text-lg" placeholder="例如：春节、中秋节" value="春节">
          </div>
          <div>
            <label for="festival-date" class="block text-gray-700 mb-2 text-lg">节日日期</label>
            <input type="date" id="festival-date" class="w-full p-3 border border-gray-300 rounded-lg text-lg" value="${new Date().getFullYear()}-12-31">
          </div>
        ` : category === 'birthday' ? `
          <div>
            <label for="birthday-name" class="block text-gray-700 mb-2 text-lg">姓名</label>
            <input type="text" id="birthday-name" class="w-full p-3 border border-gray-300 rounded-lg text-lg" placeholder="输入姓名" value="张三">
          </div>
          <div>
            <label for="birthday-date" class="block text-gray-700 mb-2 text-lg">生日日期</label>
            <input type="date" id="birthday-date" class="w-full p-3 border border-gray-300 rounded-lg text-lg" value="${new Date().getFullYear()}-01-01">
          </div>
        ` : category === 'confession' ? `
          <div>
            <label for="confession-name" class="block text-gray-700 mb-2 text-lg">表白对象</label>
            <input type="text" id="confession-name" class="w-full p-3 border border-gray-300 rounded-lg text-lg" placeholder="输入TA的名字" value="李四">
          </div>
          <div>
            <label for="confession-content" class="block text-gray-700 mb-2 text-lg">表白内容</label>
            <textarea id="confession-content" class="w-full p-3 border border-gray-300 rounded-lg text-lg min-h-[150px]" placeholder="输入想对TA说的话">喜欢你很久了～</textarea>
          </div>
        ` : ''}

        <button class="generate-share-btn w-full bg-${colorClass} hover:bg-${colorClass}/90 text-white py-4 rounded-lg text-xl font-semibold transition-all shadow-md hover:shadow-lg" data-category="${category}">
          <i class="fa-solid fa-link mr-2"></i>生成分享链接
        </button>
      </div>

      <div class="mt-10">
        <h3 class="text-xl font-bold text-gray-700 mb-4">生成历史</h3>
        <div id="${category}-history-list" class="space-y-4 max-h-[400px] overflow-y-auto pr-2"></div>
      </div>
    </div>
  `;
}

// --------------- 原 share.js 内容 ---------------
/**
 * 生成分享ID并保存（复用原有逻辑）
 */
export async function generateShareIdAndSave(kv, request, requestUrl) {
  const body = await request.json();
  const { category, template, content, previewData } = body;
  
  // 表白分类参数校验
  if (category === 'confession' && (!previewData.name || !previewData.content)) {
    return { code: -1, msg: '表白姓名和内容不能为空' };
  }
  // 通用参数校验
  if (!category || !template || !content || !previewData) {
    return { code: -1, msg: '参数不全' };
  }
  
  // 生成分享ID
  const shareId = Math.random().toString(36).substring(2, 10);
  const shareKey = `share:${shareId}`;
  // 保存分享数据
  await kv.put(shareKey, JSON.stringify({
    category, template, content, previewData,
    createTime: Date.now(),
    shareId
  }));

  // 保存历史记录
  const historyKey = `history:${category}:${Date.now()}`;
  const shareUrl = `${new URL(requestUrl).origin}/share/${shareId}`;
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
  await kv.put(historyKey, JSON.stringify(record));
  
  return { 
    code: 0, 
    msg: '生成成功', 
    data: { shareUrl, shareId } 
  };
}

/**
 * 获取分类历史记录
 */
export async function getHistoryList(kv, category) {
  const historyKeys = await kv.list({ prefix: `history:${category}:` });
  const historyList = [];
  for (const key of historyKeys.keys) {
    const value = await kv.get(key.name);
    if (value) historyList.push(JSON.parse(value));
  }
  historyList.sort((a, b) => b.createTime - a.createTime);
  return historyList;
}

/**
 * 删除单条历史记录
 */
export async function deleteSingleHistory(kv, request) {
  const body = await request.json();
  const { category, id, shareId } = body;
  if (!category || !id || !shareId) {
    return { code: -1, msg: '参数不全' };
  }
  // 批量删除分享链接和历史记录
  await Promise.all([
    kv.delete(`share:${shareId}`),
    kv.delete(id)
  ]);
  return { code: 0, msg: '删除成功' };
}

/**
 * 一键删除分类所有记录
 */
export async function deleteAllHistory(kv, request) {
  const body = await request.json();
  const { category } = body;
  if (!category) return { code: -1, msg: '缺少分类参数' };
  
  const historyKeys = await kv.list({ prefix: `history:${category}:` });
  const deletePromises = [];
  for (const key of historyKeys.keys) {
    const record = JSON.parse(await kv.get(key.name));
    if (record.shareId) deletePromises.push(kv.delete(`share:${record.shareId}`));
    deletePromises.push(kv.delete(key.name));
  }
  await Promise.all(deletePromises);
  return { code: 0, msg: '全部删除成功' };
}