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

  // 模板1：奶油粉蓝高级版
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

  // 模板2：卡通可爱风
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFE6F2] to-[#C8E6C9]">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-[#FFD6E0] relative">
          <div class="absolute top-4 left-4 text-[#FFAB91] text-2xl animate-bounce">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="absolute top-4 right-4 text-[#81C784] text-2xl animate-pulse">
            <i class="fa-solid fa-heart"></i>
          </div>
          <div class="bg-gradient-to-r from-[#FF80AB] to-[#81D4FA] py-6 text-center">
            <h2 class="text-2xl font-bold text-white tracking-wider">✨ 给 ${confName} 的悄悄话 ✨</h2>
          </div>
          <div class="p-6 text-center">
            <div id="confession-content-2" class="bg-[#FFF9C4] rounded-2xl p-6 text-[#616161] leading-relaxed mb-4 min-h-[180px] w-full word-break break-all shadow-sm border border-[#FFE082] font-['Comic_Sans_MS']"></div>
            <div class="flex justify-center gap-3 mt-4">
              <span class="inline-block w-4 h-4 bg-[#FF80AB] rounded-full animate-pulse"></span>
              <span class="inline-block w-4 h-4 bg-[#81D4FA] rounded-full animate-pulse delay-100"></span>
              <span class="inline-block w-4 h-4 bg-[#81C784] rounded-full animate-pulse delay-200"></span>
            </div>
            <p class="mt-4 text-[#9E9E9E] text-sm">💖 超喜欢你哦 💖</p>
          </div>
        </div>
      </div>
      <script>
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
                if (Math.random() > 0.9 && i % 10 === 0) {
                  el.innerHTML += ['🥰', '✨', '🍬', '🌸', '💓'][Math.floor(Math.random()*5)];
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
          @keyframes fadeIn {
            from { opacity: 0.8; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce { animation: bounce 2s infinite ease-in-out; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 1; }
          }
          .animate-pulse { animation: pulse 2s infinite ease-in-out; }
        \`;
        document.head.appendChild(style);
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}