# Negatif İçerik Filtresi

X (Twitter) akışındaki olumsuz/negatif içerikli gönderileri otomatik tespit edip gizleyen bir Chrome extension'ı. Türkçe ve İngilizce dahil çok dilli metinleri analiz edebiliyor.

## Nasıl çalışıyor

Extension, gönderi metinlerini bir arka uç (backend) servise gönderip 0-1 arası bir "negatiflik skoru" alıyor, eşiğin üzerindeki gönderileri gizliyor. Backend ayrı bir sunucuda (yazarın kendi makinesinde) 7/24 çalışıyor — extension'ın kendisi model içermiyor, sadece isteği o servise iletiyor.

**Önemli:** Extension'ın çalışması için backend'in ayakta olması gerekiyor. Backend geçici olarak erişilemez durumdaysa (örn. bakım, elektrik kesintisi), filtreleme o süre boyunca çalışmaz.

## Kurulum

1. Bu repoyu indir (yeşil "Code" butonu → "Download ZIP", ya da `git clone`)
2. Chrome'da `chrome://extensions` adresini aç
3. Sağ üstten **Geliştirici modu**'nu aç
4. **Paketlenmemiş öğe yükle** butonuna bas
5. İndirdiğin klasörü seç

Extension yüklendikten sonra x.com'u ziyaret ettiğinde otomatik çalışmaya başlar.

## İzinler

- `storage`: kullanıcı ayarlarını (varsa) tarayıcıda saklamak için
- `x.com` / `twitter.com`: gönderi metinlerini okumak için
- Backend adresi: metinleri analiz için göndermek için

Extension, gönderi metinleri dışında hiçbir kişisel veri toplamıyor veya saklamıyor.

## Geri bildirim

Sorun/öneri için bir [issue](../../issues) açabilirsin.

## Destek

Bu projeyi faydalı bulduysan bir kahve ısmarlayabilirsin ☕

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-yellow?logo=buy-me-a-coffee)](https://buymeacoffee.com/kerembors1f)
