// background.js
// Service worker — extension kapalıyken bile mesajları dinlemeye hazır.

const BACKEND_URL = 'https://user-lenovo-g500.tailb6efdb.ts.net/analyze';

async function realAnalyze(text) {
  const res = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Backend hatası: ${res.status}`);
  const data = await res.json();
  return data.score;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_TEXT') {
    realAnalyze(message.text)
      .then((score) => sendResponse({ score }))
      .catch((err) => {
        console.error('[negfilter] analiz hatası:', err);
        sendResponse({ score: 0 }); // backend çökerse hiçbir şeyi gizleme, sessizce geç
      });
    return true; // async response için kanalı açık tutuyoruz
  }
});
