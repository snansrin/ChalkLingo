# Mochi 1.1 - doğrulama kaydı

Tarih: 27 Ekim 2026. Windows x64, Node.js 24.19.0, Electron 45.0.0, Playwright 1.62.1.

## Araştırmanın izlenebilirliği

10 depo README/özellik karşılaştırması, 7 ayrıntılı issue API kaydı, arama sonucundan ayrıca okunan BongoCat #1140, iki yorum dizisi ve iki canlı görsel gözlem. Kaynaklı analiz `RESEARCH-2026-10-27.md`, gözlemlenen sayılar `research-snapshot-2026-10-27.json` dosyasında. Popülerlik, kullanıcı memnuniyeti ve eğitim etkisi eşitlenmedi.

## Model ve masaüstü testleri

15 model/veri/yerleşim testi ve bütün sözdizimi kontrolleri geçti. Testler: 1.0 veri geçişi, günlük farklı kart sayımı, zamanı gelmiş kartların önceliği, hata kaydının kalıcılığı ve çözülmesi, kazanılmış aksesuarın hata sonrası korunması, özel kart doğrulama/yedek alanları, serbest çalışmanın takvim ve hedefi değiştirmemesi, kısa ve negatif koordinatlı ekranlara sığma.

`npm run test:desktop` geçti: dört temel oyun, kurulu ana güvenlik tercihleri, yerel protokol sınırı, kalıcı ayarlar, yedekleme/geri yükleme ve pencere modları.

`npm run test:studio` geçti: tanıma/yazma içeren günlük rota, sayısal klavye kısayolları, tekrarsız günlük hedef, açılan aksesuarı seçip yeniden açma, özel kelime ekleme, arama/favori, arşiv/geri alma, örneği görüntüleme, hata atölyesinde takvimi/XP’yi değiştirmeden onarma, gerçek HTML sürükleme ve tıklama alternatifi, genişleyen yedeği geri yükleme, tıklama geçirme IPC dönüşü. Standart pencere boyutunda ana öğrenme eylemlerinin kaydırma gerektirmediği kontrol edildi.

Gerçek Electron ekran görüntüleri yenilendi. Panellerin başlık ve kapatma düğmesi sabit kalır; yeni panele geçerken içerik en başa döner. PDF raporun yedi sayfası çizdirilip görsel olarak incelendi; Poppler düşük çözünürlükte bazı yazıları eksik gösterdiği için üçüncü sayfa ikinci okuyucuyla da kontrol edildi ve tam metin doğrulandı.

## Kısa kaynak örneklemesi

Beş saniyelik görünür pencere örneğinde toplam süreç CPU süresi yaklaşık 0,65 saniye; gizleme geçişi içeren beş saniyede yaklaşık 0,20 saniye. Bunlar tek bir CPU çekirdeğine göre yaklaşık %13,0 ve %4,0 karşılığıdır; tüm bilgisayarın toplam CPU yüzdesi değildir. Görünür durumda süreç çalışma kümelerinin toplamı yaklaşık 416 MiB idi. Paylaşılan sayfalar birden fazla sayılabilir. Örnekler otomasyon ve paketleme araçları bulunan yerel oturumda alındı; uzun süreli veya donanımdan bağımsız performans sonucu değildir.

Yeni boşta davranışları ek bir sürekli döngü açmaz; mevcut 15 saniyelik denetim kullanılır. Panellerde/gizlemede animasyon durur. Kaynak tabanı hâlâ Electron’dur ve bellek maliyeti küçümsenmemelidir.

## Paket ve kurulum

Son kaynaklardan Windows NSIS ve taşınabilir paket oluşturulur. ASAR içeriği son çalışma zamanı kaynaklarıyla karşılaştırılır. 1.0 kurulu sürümünün yerel verisi güncellemeden önce bu sohbetin çalışma klasörüne yedeklenir. Kurulu 1.1 test sonuçları doğrulama tamamlandığında aşağıya eklenir.

## Sınırlar

Tam FSRS, ses tanıma, otomatik çeviri ve genişletilmiş sertifikalı müfredat eklenmedi. Yedi öğrenme dili ve mevcut başlangıç verisi korunur. Arayüz Türkçedir. 1.0’da tutulmayan günlük ve hata geçmişi geriye dönük üretilmez. macOS/Linux ve gerçek çok monitörlü tıklama geçirme senaryoları kapsamlı denenmedi; yerleşim sınırları model düzeyinde test edildi. Erişilebilirlik için klavye, metin ve odak durumları gözden geçirildi; tam ekran okuyucu çalışması yapılmadı. Eğitim etkinliği kullanıcı çalışmasıyla ölçülmedi.

## Kurulu 1.1 sonucu

NSIS kurulumu çıkış kodu 0 ile tamamlandı. `MOCHI_EXE=C:\Users\snans\AppData\Local\Programs\Mochi\Mochi.exe` üzerinden `test:desktop` ve `test:studio` grupları tekrar çalıştırıldı; ikisi de geçti. Kurulum öncesi mevcut profil bu sohbetin `work/Mochi-1.0-profile-before-upgrade` klasörüne yedeklendi. Son paketlenmiş çalışma zamanı dosyaları kaynaklarla karşılaştırıldı ve eşleşti. PDF raporu, kaynak gözlem kaydı, kurulum, taşınabilir sürüm, kaynak arşivi ve SHA-256 özetleri teslim edildi.
