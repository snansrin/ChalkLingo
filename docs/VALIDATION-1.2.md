# Mochi 1.2 - eğitim sürümü doğrulaması

27 Ekim 2026. Windows x64, Node.js 24.19.0, Electron 45.0.0, Playwright 1.62.1.

## Uygulanan kapsam

Sabit seri takvimi yerine ts-fsrs 5.4.2 / FSRS-6; tanıma, üretim, bağlam, dinleme ve parçalı cümle kurma için bağımsız kayıtlar. Sekiz durak ve 48 özgün İngilizce temel hedefi; açık öğretim, tanıma, yazma ve öğretimden farklı bağlamda boşluk tamamlama. Eski 229 satır ve kimlikleri korundu. Toplam 277 satır, 234 oynanabilir kelime/cümle hedefi.

Kaynak ve çıkarım sınırları `EDUCATION-RESEARCH-2026-10-27.md` içindedir. Bu dosya yazılım doğrulamasıdır; öğrenme etkinliği sonucu değildir.

## Geçen kontroller

- `npm run check`: bütün sözdizimi kontrolleri ve 32 model/veri/yerleşim testi geçti.
- `npm run test:desktop`: dört oyun, kayıtlar, ayarlar, yedekleme, pencere modları, sandbox ve yerel protokol kontrolleri geçti.
- `npm run test:studio`: eski kart rotası, sayısal kısayollar, günlük farklı kart hedefi, aksesuar kalıcılığı, kişisel defter, arama/favori/arşiv, hata atölyesinde erken alıştırmanın takvimi ve XP'yi koruması, sürükleme alternatifi, yedek/geri yükleme ve tıklama geçirme geçti.
- `npm run test:education`: önkoşullu harita, incelemenin puan kazandırmaması, öğretimden önce sınamama, anlam seçimi, yazma, bağlam, ipucunun ve düzeltmenin FSRS/XP üretmemesi, ilk gün gecikmeli kanıt oluşturmama, yeniden açılışta kayıtlar ve diğer dilde kart rotasına dönüş geçti.

Model testleri özellikle tanımanın üretime taşınmamasını, erken cevabın kaydı değiştirmemesini, gecikmeli kanıt için iki ayrı beceri/gün ve en az 24 saat koşulunu, yalnızca gece yarısı geçişinin yetmemesini, son yanlışın durumu geri almasını, eski yedekten FSRS geçmişi uydurulmamasını ve bozuk ithal kayıtların elenmesini kapsar. 100 vade simülasyonu sonlu durum ve 365 günlük üst aralık için kontrol edildi; öğrenen performansı simüle edilmedi.

## Paket ve kurulu uygulama

NSIS ve taşınabilir Windows x64 paketleri `npm run dist:win` ile oluşturuldu. NSIS kurulumu çıkış kodu 0 ile tamamlandı; kurulu yürütülebilir dosya sürümü 1.2.0.0. Güncellemeden önce mevcut 1.1 kullanıcı profili bu sohbetin çalışma klasöründe tarihli bir yedeğe kopyalandı. Uygulama kimliği ve kullanıcı profili yeri değişmedi.

Üç masaüstü senaryo grubu `MOCHI_EXE` ile doğrudan kurulu uygulamaya karşı tekrar çalıştırıldı; hepsi geçti. Her test ayrı geçici kullanıcı profili kullandı. Normal kullanıcının profiline test cevapları eklenmedi. Testlerden sonra uygulama normal profilinde açıldı; başlıklı ana pencere süreci doğrulandı.

Kurulu `resources/app.asar` ile aynı derlemenin `release/win-unpacked/resources/app.asar` dosyasının SHA-256 değerleri eşleşti:

`B3444838EDE3F37057C4DD0FA588D589BB944606B52F2E16DE97C4A48859BBAE`

## Görsel doğrulama

Gerçek uygulamadan rota, öğretim kartı, harita, bağlam ve yöntem ekranları alındı. Ana rota düğmesi standart pencerede ilk görünümde erişilebilir hale getirildi. Panellerin içerikleri kaydırılabilir, başlık ve kapatma alanı sabittir. Kaynaklı PDF raporun yedi sayfası çizdirildi ve görsel olarak incelendi; ekran görüntülerinin en-boy oranı düzeltildi ve son sayfa yeniden kontrol edildi.

## Bilinen sınırlar

İlk ayrıntılı sıralı kurs İngilizce temelidir; tam A1 veya A1-C2 kursu değildir. Diğer altı dil önceki kart kapsamındadır. Her yeni hedefin tek sabit bağlam sorusu vardır. İlerleme sayaçları bütün dil yeterliğini veya görülmemiş gerçek yaşam görevine aktarımı ölçmez. İçerik bağımsız öğretmen incelemesinden geçmedi. Yazma kontrolü listelenen biçimler/kısaltmalarla sınırlıdır; alternatif bütün doğru cümleleri anlayan bir model yoktur.

Konuşma kaydı, telaffuz puanı, sertifikalı seviye tespiti ve kişisel geçmişten parametre optimizasyonu uygulanmadı. Hedef %90 hatırlama oranı bir model ayarıdır. Yeni kurs örneklerinin seslendirmesi cihazın İngilizce konuşma sesine bağlıdır. Eski hata atölyesi kart düzeyinde yardımcı alıştırmadır; ayrıntılı kurs beceri kayıtlarını kullanır.

Windows kurulu paket test edildi; macOS/Linux, kapsamlı ekran okuyucu incelemesi ve gerçek öğrenenlerle karşılaştırmalı 1/7/30 gün çalışması yapılmadı. Paketlerde kod imzalama sertifikası yoktur. Kod testlerinin geçmesi hatasızlık veya en iyi eğitim ürünü garantisi değildir.
