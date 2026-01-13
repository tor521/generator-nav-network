import { generateCommonHead } from './utils.js';

// 生成整蛊分类分享页面（模板1/2）
export function generatePrankPage(data) {
  const { template } = data;
  let pageContent = '';

  // 模板1：经典版
  if (template === '1') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 to-pink-50">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100">
          <div class="bg-gradient-to-r from-rose-500 to-pink-500 py-6 text-center">
            <i class="fa-solid fa-face-grin-tongue text-4xl text-white mb-2"></i>
            <h2 class="text-2xl font-bold text-white tracking-wider">礼物盲盒</h2>
          </div>
          <div class="p-8 text-center">
            <button id="prank-btn" class="bg-rose-500 hover:bg-rose-600 text-white py-3 px-8 rounded-full font-semibold transition-all shadow-md hover:shadow-lg">
              点击领取你的礼物
            </button>
            <div id="prank-result" class="mt-8 text-xl font-bold text-rose-500 hidden"></div>
            <div class="w-24 h-1 bg-rose-200 mx-auto mt-6 rounded-full"></div>
          </div>
        </div>
      </div>
      <script>
        document.getElementById('prank-btn').addEventListener('click', () => {
          const btn = document.getElementById('prank-btn');
          const result = document.getElementById('prank-result');
          btn.disabled = true;
          btn.textContent = '抽取中...';
          setTimeout(() => {
            btn.classList.add('hidden');
            result.classList.remove('hidden');
            result.textContent = '有个蛋给你，你个二货🤪';
            document.body.style.transition = 'transform 0.2s';
            for(let i=0; i<5; i++) {
              setTimeout(() => {
                document.body.style.transform = \`translate(\${Math.random()*10-5}px, \${Math.random()*10-5}px)\`;
              }, i*100);
            }
            setTimeout(() => {
              document.body.style.transform = 'translate(0,0)';
            }, 600);
          }, 1500);
        });
      </script>
    `;
  }

  // 模板2：轻奢高级风
  else if (template === '2') {
    pageContent = `
      <div class="min-h-screen flex items-center justify-center p-4 bg-[#1A1A1A]">
        <div class="w-full max-w-md bg-[#2D2D2D] rounded-3xl shadow-2xl overflow-hidden border border-[#444444]">
          <div class="bg-gradient-to-r from-[#D4AF37] to-[#F0E68C] py-6 text-center">
            <i class="fa-solid fa-gift text-4xl text-[#1A1A1A] mb-2"></i>
            <h2 class="text-2xl font-bold text-[#1A1A1A] tracking-wider">惊喜礼盒</h2>
          </div>
          <div class="p-8 text-center">
            <button id="prank-btn-2" class="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] py-3 px-8 rounded-full font-semibold transition-all hover:bg-[#D4AF37] hover:text-[#1A1A1A] shadow-md hover:shadow-amber-900/20">
              解锁专属惊喜
            </button>
            <div id="prank-result-2" class="mt-8 text-xl font-bold text-[#D4AF37] hidden"></div>
            <div class="w-24 h-1 bg-[#444444] mx-auto mt-6 rounded-full"></div>
            <p class="mt-6 text-[#888888] text-sm">LUXURY SURPRISE · 2024</p>
          </div>
        </div>
      </div>
      <script>
        document.getElementById('prank-btn-2').addEventListener('click', () => {
          const btn = document.getElementById('prank-btn-2');
          const result = document.getElementById('prank-result-2');
          btn.disabled = true;
          btn.textContent = '解锁中...';
          btn.classList.add('opacity-70');
          setTimeout(() => {
            btn.classList.add('hidden');
            result.classList.remove('hidden');
            result.textContent = '恭喜解锁：空气一份💨 奢华无上限～';
            document.body.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            let shakeCount = 0;
            const shakeInterval = setInterval(() => {
              if (shakeCount < 3) {
                document.body.style.transform = \`translate(\${Math.random()*8-4}px, \${Math.random()*8-4}px)\`;
                shakeCount++;
              } else {
                clearInterval(shakeInterval);
                document.body.style.transform = 'translate(0,0)';
              }
            }, 150);
          }, 2000);
        });
      </script>
    `;
  }

  // 拼接完整HTML
  return generateCommonHead() + `<body>${pageContent}</body></html>`;
}