// content.js
// Bu script her eşleşen sayfaya enjekte edilir ve DOM ile doğrudan konuşur.
// X (Twitter) bir SPA olduğu için postlar sayfa yüklendikten SONRA da
// sürekli DOM'a ekleniyor (infinite scroll). Bu yüzden statik bir
// querySelectorAll yeterli değil — MutationObserver ile DOM'u izlememiz lazım.

const TWEET_TEXT_SELECTOR = '[data-testid="tweetText"]';
const PROCESSED_ATTR = 'data-negfilter-processed';

// Ayarlar: popup'tan değiştirilebilir, storage'dan okunur.
let settings = {
  enabled: true,
  threshold: 0.7, // 0-1 arası negatiflik skoru eşiği
};

chrome.storage.sync.get(['enabled', 'threshold'], (stored) => {
  settings = { ...settings, ...stored };
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) settings.enabled = changes.enabled.newValue;
  if (changes.threshold) settings.threshold = changes.threshold.newValue;
});

function findUnprocessedTweets() {
  return Array.from(document.querySelectorAll(TWEET_TEXT_SELECTOR))
    .filter((el) => !el.hasAttribute(PROCESSED_ATTR));
}

function hideTweet(textEl) {
  // Post'un tamamını (article elementini) buluyoruz, sadece metni değil.
  const article = textEl.closest('article');
  if (!article) return;

  article.classList.add('negfilter-hidden');

  // Kullanıcı isterse geri gösterebilsin diye bir buton ekliyoruz.
  const revealBtn = document.createElement('button');
  revealBtn.className = 'negfilter-reveal-btn';
  revealBtn.textContent = 'Olumsuz içerik gizlendi — göster';
  revealBtn.onclick = () => {
    article.classList.remove('negfilter-hidden');
    revealBtn.remove();
  };
  article.prepend(revealBtn);
}

async function processTweets() {
  if (!settings.enabled) return;

  const tweets = findUnprocessedTweets();
  if (tweets.length === 0) return;

  for (const textEl of tweets) {
    textEl.setAttribute(PROCESSED_ATTR, 'true');
    const text = textEl.innerText.trim();
    if (!text) continue;

    // Skorlamayı background script'e devrediyoruz çünkü:
    // 1) API çağrısı orada merkezi yönetilecek (rate limiting, cache vs.)
    // 2) content script her sayfa yenilemesinde sıfırlanır, background kalıcı
    chrome.runtime.sendMessage(
      { type: 'ANALYZE_TEXT', text },
      (response) => {
        if (response && response.score >= settings.threshold) {
          hideTweet(textEl);
        }
      }
    );
  }
}

// İlk yüklemede mevcut tweet'leri işle
processTweets();

// Sonradan eklenen tweet'ler için DOM'u izle (infinite scroll)
const observer = new MutationObserver(() => {
  processTweets();
});
observer.observe(document.body, { childList: true, subtree: true });
