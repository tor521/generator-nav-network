import { generateCommonHead } from './utils.js';

// 生成表白分类分享页面（模板1/2）
export function generateConfessionPage(data) {
  const { template, previewData } = data;
  const confName = previewData.name;
  const confContent = previewData.content
    .replace(/\\n/g, '<br>')
    .replace(/`/g, '\\`')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
  let pageContent = '';

  // 模板1：奶油粉蓝高级版（保持不变）
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream-blue to-cream-pink">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-cream-border relative">
          <div class="bg-gradient-to-r from-sky-mist to-peach-bloom py-8 text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full opacity-15">
              <i class="fa-solid fa-heart text-white text-9xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
            </div>
            <h2 class="text-3xl font-bold text-white tracking-wider relative z-10">致 ${confName}</h2>
            <p class="text-cream-white mt-2 relative z-10">一份专属的心意 💌</p>
            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-16 h-2"></div>
          </div>
          <div class="p-8 text-center">
            <div id="confession-content" class="bg-gradient-to-r from-cream-bg to-cream-light rounded-2xl p-8 text-gray-700 leading-relaxed mb-4 min-h-[180px] w-full word-break break-all shadow-sm border border-cream-border"></div>
            <div class="flex justify-center gap-2 mt-6">
              <i class="fa-solid fa-heart text-peach-bloom-light animate-pulse"></i>
              <i class="fa-solid fa-heart text-sky-mist-light animate-pulse delay-100"></i>
              <i class="fa-solid fa-heart text-peach-bloom animate-pulse delay-200"></i>
            </div>
            <p class="mt-4 text-gray-600 text-sm">愿这份心意能抵达你心底</p>
          </div>
        </div>
      </div>
      <script>
        function typeWriterEffect(text, el, speed = 80) {
          let i = 0;
          el.innerHTML = '';
          const timer = setInterval(() => {
            if (i < text.length) {
              if (text.charAt(i) === '<' && text.substring(i, i+4) === '<br>') {
                el.innerHTML += '<br>';
                i += 4;
              } else {
                el.innerHTML += text.charAt(i);
                i++;
              }
            } else {
              clearInterval(timer);
              el.classList.add('animate-fadeIn');
            }
          }, speed);
        }
        const userInputContent = \`${confContent}\`;
        typeWriterEffect(userInputContent, document.getElementById('confession-content'));
        
        const style = document.createElement('style');
        style.textContent = \`
          :root {
            --cream-blue: #f5f9ff;
            --cream-pink: #fff5f7;
            --cream-border: #f0e6f8;
            --cream-bg: #ffffff;
            --cream-light: #faf6fb;
            --cream-white: #fffcfe;
            --sky-mist: #94b3fd;
            --sky-mist-light: #b4c7fd;
            --peach-bloom: #f8b8c8;
            --peach-bloom-light: #fcd7e0;
          }
          .bg-gradient-to-br.from-cream-blue.to-cream-pink {
            background: linear-gradient(to bottom right, var(--cream-blue), var(--cream-pink));
          }
          .border-cream-border { border-color: var(--cream-border); }
          .bg-gradient-to-r.from-sky-mist.to-peach-bloom {
            background: linear-gradient(to right, var(--sky-mist), var(--peach-bloom));
          }
          .text-cream-white { color: var(--cream-white); }
          .bg-gradient-to-r.from-cream-bg.to-cream-light {
            background: linear-gradient(to right, var(--cream-bg), var(--cream-light));
          }
          .text-sky-mist { color: var(--sky-mist); }
          .text-sky-mist-light { color: var(--sky-mist-light); }
          .text-peach-bloom { color: var(--peach-bloom); }
          .text-peach-bloom-light { color: var(--peach-bloom-light); }
          @keyframes fadeIn {
            from { opacity: 0.8; }
            to { opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          .animate-pulse { animation: pulse 1.5s infinite ease-in-out; }
        \`;
        document.head.appendChild(style);
      </script>
    `;
  }

  // 模板2：童趣涂鸦撞色风（大幅修改，与模板1风格差异化）
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFF267] to-[#FF67AB]">
        <div class="w-full max-w-md bg-white rounded-[24px] shadow-[0_0_20px_rgba(255,103,171,0.3)] overflow-hidden border-4 border-dashed border-[#67E5FF] relative rotate-1">
          <!-- 涂鸦装饰元素 -->
          <div class="absolute -top-6 -left-6 w-16 h-16 bg-[#FF67AB] rounded-full flex items-center justify-center text-white text-2xl rotate-12">
            <i class="fa-solid fa-candy-cane"></i>
          </div>
          <div class="absolute -bottom-6 -right-6 w-16 h-16 bg-[#67E5FF] rounded-full flex items-center justify-center text-white text-2xl -rotate-12">
            <i class="fa-solid fa-star"></i>
          </div>
          <!-- 标题栏 -->
          <div class="bg-gradient-to-r from-[#FF67AB] to-[#67E5FF] py-6 text-center px-4 relative">
            <div class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0wIDBoNjAwVjEwMEgwVjB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+')] opacity-50"></div>
            <h2 class="text-2xl font-bold text-white tracking-wider relative z-10 drop-shadow-md">🎨 给 ${confName} 的小涂鸦 🎨</h2>
          </div>
          <!-- 内容区域 -->
          <div class="p-6 text-center bg-[#FFF9E8]">
            <div id="confession-content-2" class="bg-white rounded-[16px] p-6 text-[#FF4D88] leading-relaxed mb-4 min-h-[180px] w-full word-break break-all shadow-[inset_0_0_10px_rgba(103,229,255,0.2)] border-2 border-[#FF67AB] font-['Ma_Shan_Zheng',_cursive] text-lg"></div>
            <!-- 装饰圆点 -->
            <div class="flex justify-center gap-4 mt-4">
              <span class="inline-block w-6 h-6 bg-[#FF67AB] rounded-full animate-bounce"></span>
              <span class="inline-block w-6 h-6 bg-[#67E5FF] rounded-full animate-spin-slow"></span>
              <span class="inline-block w-6 h-6 bg-[#FFF267] rounded-full animate-bounce delay-200"></span>
            </div>
            <p class="mt-4 text-[#FF4D88] text-sm mt-6 drop-shadow-sm">🍬 把甜甜的话都送给你 🍬</p>
          </div>
        </div>
      </div>
      <script>
        // 保留原有打字机功能，仅微调随机表情更贴合涂鸦风格
        function cuteTypeWriterEffect(text, el, speed = 100) {
          let i = 0;
          el.innerHTML = '';
          const timer = setInterval(() => {
            if (i < text.length) {
              if (text.charAt(i) === '<' && text.substring(i, i+4) === '<br>') {
                el.innerHTML += '<br>';
                i += 4;
              } else {
                el.innerHTML += text.charAt(i);
                // 随机插入涂鸦风表情，频率略调整
                if (Math.random() > 0.92 && i % 8 === 0) {
                  el.innerHTML += ['🍭', '🎨', '🖍️', '🌈', '🍩'][Math.floor(Math.random()*5)];
                }
                i++;
              }
            } else {
              clearInterval(timer);
              el.classList.add('animate-fadeIn');
            }
          }, speed);
        }
        const userInputContent = \`${confContent}\`;
        cuteTypeWriterEffect(userInputContent, document.getElementById('confession-content-2'));
        
        const style = document.createElement('style');
        style.textContent = \`
          /* 新增/修改动画，区别于模板1的柔和动画 */
          @keyframes fadeIn {
            from { opacity: 0.7; transform: scale(0.95) rotate(-1deg); }
            to { opacity: 1; transform: scale(1) rotate(0); }
          }
          .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-bounce { animation: bounce 1.8s infinite ease-in-out; }
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow { animation: spin-slow 3s infinite linear; }
          /* 手写字体引入（可选） */
          @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
          .font-['Ma_Shan_Zheng',_cursive] { font-family: 'Ma Shan Zheng', cursive; }
          .rotate-1 { transform: rotate(1deg); }
          .-rotate-12 { transform: rotate(-12deg); }
          .rotate-12 { transform: rotate(12deg); }
          .drop-shadow-md { text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
          .drop-shadow-sm { text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        \`;
        document.head.appendChild(style);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}
