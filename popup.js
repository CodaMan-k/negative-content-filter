// popup.js
// chrome.storage.sync kullanıyoruz (local değil) çünkü kullanıcı birden
// fazla cihazda Chrome'a giriş yaptıysa ayarları senkronize etsin istiyoruz.
// content.js'teki chrome.storage.onChanged listener'ı bu değişiklikleri
// otomatik yakalayıp anlık uyguluyor — popup'ı kapatıp açmaya gerek yok.

const enabledToggle = document.getElementById('enabledToggle');
const thresholdSlider = document.getElementById('thresholdSlider');
const thresholdValue = document.getElementById('thresholdValue');

// Mevcut ayarları yükle
chrome.storage.sync.get(['enabled', 'threshold'], (stored) => {
  enabledToggle.checked = stored.enabled ?? true;
  const threshold = stored.threshold ?? 0.7;
  thresholdSlider.value = threshold;
  thresholdValue.textContent = threshold;
});

enabledToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: enabledToggle.checked });
});

thresholdSlider.addEventListener('input', () => {
  thresholdValue.textContent = thresholdSlider.value;
  chrome.storage.sync.set({ threshold: parseFloat(thresholdSlider.value) });
});
