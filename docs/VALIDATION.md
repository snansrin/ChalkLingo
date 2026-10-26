# v0.3.1 doğrulama ve README denetimi — 26 Ekim 2026

Bu bölüm güncel `v0.3.1` widget’ına aittir. Aşağıdaki `0.3.0` bölümü tarihsel rapordur; yeni sürümün RAM/CPU ölçümü olarak gösterilmez.

- **Kod/README karşılaştırması:** eski 520×640 ana pencere bilgisi ve görev çubuğuna küçültme davranışı artık geçerli değil; README güncellendi. Ana görünüm 360×340, ayar ve alıştırma görünümü 520×640. Tepsiye gizleme ve yalnızca kurulu Windows sürümünde kullanıcı açılışına kaydolma README’de açıklandı.
- **Birim testleri:** GitHub Linux CI üzerinde `npm run check` **32 test / 32 başarılı / 0 hata**, 26 Ekim 2026.
- **Windows küçük widget duman testi:** GitHub Actions üzerinde `npm run test:widget` başarılı. Görünüm geçişleri ve tepsiye gizleme doğrulandı.
- **Dört gerçek Windows ekran görüntüsü:** `tests/screenshots.cjs`, `docs/screenshots/widget-{compact,settings,voice,practice}.png` dosyalarını GitHub Windows Electron runner üzerinden kaydetti; görüntülerin varlığı ve boyutları test edildi. Ekran görüntüsü otomasyonu başarılı ve dosyalar `main` dalına eklendi.
- **Telaffuz:** sadece seçilen dil etiketine uygun sesler kabul edilir; dil eşleşmezse diğer dile otomatik geçiş yoktur. Beş birim testi bulunmaktadır. İnsan kulağıyla aksan kalite kontrolü **henüz yapılmadı**; sistem seslerinin kalitesi cihaza bağlıdır.
- **Windows başlangıcı:** `app.setLoginItemSettings` ve korumalı IPC testi var. Gerçek kurulum sonrası Windows oturum açılış davranışı ve kapat/aç tercihi fiziksel kullanıcı cihazında **henüz doğrulanmadı**.
- **Performans:** 0.3.1 için yeni ölçülmüş CPU/RAM verisi bulunmuyor; 0.3.0 ölçümlerini yeni sürüm için performans garantisi olarak kullanmayın.
- **Güvenlik:** Otomatik başlangıç yalnızca kullanıcı oturumuna kayıt girişidir; Defender, güvenlik duvarı, yönetici ayrıcalıkları ve ayrı bir servis değiştirilmez.

## 0.3.0 için tarihsel kayıt


- npm run check: 24/24 test; JavaScript sözdizimi kontrolü geçti.
- npm audit: 286 pakette 0 bilinen açık; bütün risklerin yok olduğu anlamına gelmez.
- npm run test:desktop: Electron 45 / Windows üzerinde geçti, renderer JavaScript hatası yok.
- UI: 10 dakika/saatlik tercihler, yeniden yüklemede kalıcılık, duraklat/devam et, beş soruluk oturum ve yeni oturum, sanal saatle otomatik ses, duraklamada sessizlik, sessiz saatler, Windows küçültme ve animasyonun askıya alınması, renderer Node erişiminin kapalı olması.
- Birim testleri: geceyi aşan sessiz saatler, tek zamanlayıcı, kalan süre, uzun aradan sonra olay yağmuru olmaması, bozuk tercihler, içerik uzunluğu başlığı olmayan büyük model yanıtının kesilmesi, model kaynak seçenekleri ve mevcut ders/veri kontrolleri.

## Kısa kaynak ölçümü

Electron app.getAppMetrics ile geliştirme uygulamasında ders/ses işlemleri sonrası animasyon açıkken yaklaşık 5 saniye, küçültme sonrası yaklaşık 2 saniye örneklendi.

| Durum | Süreç CPU yüzdeleri toplamı | Çalışma kümeleri toplamı |
| --- | ---: | ---: |
| Animasyon açık | %1,56 | yaklaşık 512 MiB |
| Küçültülmüş | %0,10 | yaklaşık 507 MiB |

Paylaşılan bellek çift sayılabilir. Donanım, ekran ölçeği, ses sürücüsü, paketleme ve Ollama değerleri değiştirir. Uzun süreli sızıntı, pil ömrü, düşük RAM cihazları ve insan tarafından ses kalitesi bu ölçümle doğrulanmış değildir.

## Sınırlar

Gerçek Ollama modeli indirilmedi; cevap kalitesi ve kaynak tüketimi ayrıca sınanmalı. Ses tetikleyicileri test edildi, fiziksel dinleme ayrıca yapılmalı. NSIS ve portable paketler üretildi; temiz cihaz kurulum/kaldırma testi ayrıca gerekli. Paketler imzasız. macOS/Linux çalıştırılmadı. Fotogerçekçi karakter veya tam A1–C2 müfredat iddiası yoktur.

## 0.3.0 güvenlik

IPC doğru ana frame ve tam URL gerektirir. Tek model isteği, gerçek akış boyutu sınırı, sabit yerel uç nokta, yönlendirme yasağı ve zaman aşımı vardır. Konum toplu yazılır; ikinci açılış mevcut pencereyi getirir. Başlangıç kaydı, sistem ayarı değişikliği, shell komutu veya uzak kod yürütme eklenmedi. Model için işletim sistemi seviyesinde CPU/RAM/GPU kotası uygulanmaz.

Paket doğrulaması: release/win-unpacked/ChalkLingo.exe aynı masaüstü testinden geçti; renderer hatası yok. İlk etkileşim denemesi ayar paneli açık kaldığı için zaman aşımına uğradı; tek başına yeniden çalıştırılan tam test başarılı oldu.

## 0.3.2 · CL kurulumu
33 birim/güvenlik testi geçti. Gerçek Windows widget ve ders testleri, kurulu uygulama üzerinde ders/ritim testi başarılı. 32 İngilizce kartın Zira WAV kayıtları yaklaşık 2,5 MB; yüklenme ve oynatma/iptal davranışı test edildi. CL kullanıcı hesabına NSIS ile kuruldu (çıkış kodu 0); masaüstü CL kısayolu, sürüm 0.3.2.0, çalışan pencere ve HKCU kullanıcı başlangıç kaydı doğrulandı. Yeniden başlatma yapılmadı; oturum açma davranışı kayıt düzeyinde doğrulandı. Güvenlik ayarlarına müdahale edilmedi.
%125 Windows ölçeğinde geçici panel içeriği 520×642 ölçülebildi. Testler kenarlık yuvarlamasında en fazla 3 mantıksal piksel sapmasına izin verir. README PNG'leri izole test profilinden alınmıştır; başlangıç kaydı test modunda oluşturulmaz.
