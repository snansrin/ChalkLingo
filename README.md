# ChalkLingo ✳ · Küçük kara tahta, her gün yeni bir ders

Windows masaüstünde çalışan, öğretmen animasyonlu, **çevrimdışı** dil öğrenme widget'ı.

**GitHub:** https://github.com/snansrin/ChalkLingo

## Özellikler

- Kara tahtaya **sol tıkla**: tebeşir silme animasyonu ve yeni kelime/cümle/dil bilgisi dersi.
- **Sağ tıkla**: yönetim panelinden öğrenilecek dili, seviyeyi ve ders türünü seç.
- **Yedi dil:** İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Rusça, Japonca.
- **A1–C2** başlangıç seviyeleri; tüm seviyelerde kelime/cümle/dil bilgisi kartları; 212 örnek ders.
- **Türkçe açıklamalar**, kullanım örnekleri, kurulu sistem sesleriyle seslendirme.
- **Öğrendim / tekrar** seçenekleriyle basitleştirilmiş aralıklı tekrar; ilerleme kaydı ve JSON dışa/içe aktarma.
- Tebeşir yazısı, hareketli öğretmen, otomatik ders geçişi, animasyonları kapatma ve her zaman üstte tutma.
- Hesap, API anahtarı, telemetri veya internet gerekmez.

> İçerik, CEFR bandlarına yerleştirilmiş *örnek bir başlangıç derlemesidir*. Resmî CEFR yeterlilik sertifikası ya da tam kapsamlı bir dil eğitimi yerine geçmez.

## Windows'ta çalıştır

Node.js 24 ve Git kuruluysa PowerShell'de:

```powershell
git clone https://github.com/snansrin/ChalkLingo.git
cd ChalkLingo
npm install
npm run check
npm start
```

Windows kurulum dosyası ve taşınabilir uygulama için:

```powershell
npm run dist:win
```

Çıktılar `release/` klasörüne yazılır. Kod imzası olmadan üretilen kurulum dosyaları Windows SmartScreen uyarısı verebilir. GitHub Actions > **Verify and package** > **Run workflow** ile Windows paketini Actions artifact olarak da üretebilirsin (Windows CI testi ayrıca gereklidir).

## Kontroller

| İşlem | Sonuç |
|---|---|
| Kara tahtaya sol tık / Boşluk | Yeni ders |
| Sağ tık / S | Yönetim paneli |
| 1 / ↶ | 5 dakika içinde tekrar |
| 2 / ✓ | Öğrendim, sonraki güne programla |
| R / ♫ | Sesli telaffuz |
| Sağ üst köşedeki ikonlar | Ayarlar, küçült, kapat |
| Başlık çubuğunu sürükle | Widget'ı taşımak |

## Kod yapısı

```text
main.cjs                  Güvenli Electron pencere / IPC / yerel protokol
preload.cjs               Kısıtlı masaüstü API köprüsü
ui/index.html             Kara tahta, öğretmen SVG, ayarlar, erişilebilirlik
ui/styles.css             Tema, animasyon, duyarlı bileşenler
ui/lessons.js             Yedi dilde toplam 212 çevrimdışı ders
ui/engine.js              Filtreleme, tekrar planlama, veri doğrulama
ui/app.js                 Kullanıcı etkileşimi, TTS, yedekler
tests/engine.test.cjs     Öğrenme motoru ve içerik testleri
.github/workflows/ci.yml  Linux kalite kontrolü, isteğe bağlı Windows paketleme
```

### Güvenlik ve gizlilik

Electron'da `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false` kullanılır. CSP uzaktan betik, ağ bağlantısı ve gömülü nesneleri engeller. IPC yalnızca izinli pencere işlemlerini kabul eder. Öğrenme geçmişi `localStorage` üzerinde cihazda tutulur; yedekler yerel JSON'dur. Kullanıcıdan parola veya API anahtarı istenmez.

### Sınırlar

- Dersler başlangıç düzeyinde örnek içeriklerdir; pedagojik kontrol ve geniş müfredat sonraki sürümlerde yapılmalıdır.
- Telaffuz, işletim sisteminde kurulu seslere bağlıdır.
- Windows EXE'nin gerçek bilgisayarda kurulumu bu depodan ayrıca doğrulanmalıdır. Kod imzalama ve otomatik güncelleme henüz eklenmedi.
- Masaüstü pencere özellikleri yalnızca Electron uygulamasında çalışır.

MIT lisanslı kaynak kod; çalışma ilerledikçe kaliteli müfredat paketleri eklenebilir.
