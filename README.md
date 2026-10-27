<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/feat/mochi-living-language/assets/icon.svg" width="96" alt="Pofinyo"></p>
<h1 align="center">Pofinyo</h1>
<p align="center"><strong>Masaüstünde yaşayan küçük kedin. Dil öğrenirken sana eşlik eder.</strong></p>
<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/feat/mochi-living-language/docs/screenshots/pofinyo-desktop-cat.gif" width="300" alt="Pofinyo yürür, koşar, oturur ve kıvrılıp uyur"></p>

## Masaüstünün kedisi

Pofinyo **dört ayağıyla yürür**, kısa koşular yapar, oturup etrafa bakar ve bir köşeye giderek **kıvrılıp uyur**. Uyandığında esneyip tekrar dolaşır. Platform, ada veya yastık üzerinde hareket etmez.

**Yalnız Windows masaüstü katmanında görünür: klasör ve simgelerin önünde, açık uygulamaların arkasında.** En üstte pencere modu kaldırılmıştır. Masaüstü bağlantısı hazır değilse kedi gizli kalır; uygulamaların üstüne çıkan bir pencereye dönüşmez.

<table><tr><td align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/feat/mochi-living-language/docs/screenshots/pofinyo-cat-walk.png" width="240" alt="Dört ayakla yürüyüş"><br>Yürüyüş ve koşu</td><td align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/feat/mochi-living-language/docs/screenshots/pofinyo-cat-sleep.png" width="240" alt="Köşede kıvrılıp uyuyan Pofinyo"><br>Kıvrılıp uyuma</td></tr></table>

- Yürüyüşte çapraz bacaklar, koşuda ön ve arka ayak çiftleri farklı ritimlerde hareket eder.
- Kedi %25 küçültüldü. Yaklaşık 60 hareket güncellemesi/saniye ve 60 FPS çizim hedefi kullanılır; gerçek hız donanıma bağlıdır.
- Yukarı giderken arka, aşağı gelirken ön, yatay giderken yan görünüş kullanılır. Başını iki yana çevirir; oturur, göz kırpar, kıvrılır ve esneyerek uyanır.
- Kısa düşünce baloncukları davranışına eşlik eder. Bunlar hazırlanmış cümlelerdir; mikrofon veya ekran izlenmez.
- Fare üzerine geldiğinde bekler; tıklayınca tepki verir. Yalnız kendi penceresindeki etkileşimleri alır.
- Hareket azaltma açıkken sakin kalır. Kilit ve uyku durumlarında gezinme durur.

## Kullanım ve kurulum

Windows x64 için **Pofinyo-Setup-2.3.0.exe** veya **Pofinyo-Portable-2.3.0.exe**. Paketler [Pofinyo geliştirme dalının GitHub Actions çalışması tamamlandıktan sonra](https://github.com/snansrin/Pofinyo/actions/workflows/ci.yml?query=branch%3Afeat%2Fmochi-living-language) **Pofinyo-Windows** çıktısından indirilebilir.

1. Uygulamayı aç. Kedi masaüstünde yaşamaya başlar.
2. **Win + D** ile masaüstüne geçebilirsin. Başka uygulama açtığında kedi onun arkasında kalır.
3. Sistem tepsisindeki Pofinyo menüsünden **Masaüstü kedisi** seçeneğiyle açıp kapat.
4. **Öğrenme ekranını aç** ile eğitim araçlarına ulaş. Eğitim ekranı yalnız açmanı istediğinde normal pencere olarak görünür; üstte tutma kapalıdır. Gezinen kedi masaüstü katmanında kalır.
5. Tamamen kapatmak için tepsi menüsündeki **Çıkış** seçeneğini kullan.

Windows ile başlatma ayarlardan isteğe bağlıdır. Eski Mochi/Pofinyo ilerlemesi, defteri ve ayarları korunur; depolama kimliği uyumluluk için sabittir.

## 10.000 kelime, küçük bir paket

**10.000 farklı İngilizce kelime, Türkçe karşılıklarıyla çevrimdışı hazır.** Öğrenme ekranındaki **◫ 10.000 kelime** düğmesinden açılır. İngilizce/Türkçe ara, favorile, kelimeyle tanış ve yazma alıştırması yap; veya beşer kelimelik tanışma turundan sonra FSRS tekrarlarına geç. **Bu havuzla çalış** ana kart havuzunu değiştirir; **Ders havuzuna dön** mevcut rotaya döndürür.

<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/feat/mochi-living-language/docs/screenshots/pofinyo-wordbank.png" width="300" alt="10.000 kelimelik kompakt kütüphane"></p>

- Kullanım verisi **218.033 bayt (~213 KiB) gzip**. Düzenlenebilir kaynak, lisanslar ve betikle bütün sözlük klasörü **0,5 MiB altında**. Bu sayı tüm Electron uygulamasının boyutu değildir.
- Sözlük ihtiyaç anında yüklenir; aramada en fazla 40, çalışma havuzunda en fazla 60 kart nesnesi oluşturulur. Öğrenme ekranı da yalnız istendiğinde oluşturulur.
- İlerleme ayrıca sıkıştırılmış dosyada tutulur; 10.000 kartlık öğrenme geçmişi eski küçük kayıt sınırlarında kesilmez. Yedek sınırı 32 MiB'dir.
- Büyük havuz **İngilizce–Türkçe** içindir. Diğer altı dilin mevcut dersleri korunur. Bu sözlük havuzuna A1–C2 seviyesi veya hayali örnek cümle atanmaz; cümle kurma oyunu bu havuzda kapalıdır.
- Anlamlar FreeDict, sıralama FrequencyWords kaynaklıdır. Bazı sık kelimeler düzeltildi; bütün çeviriler bağımsız öğretmen incelemesinden geçmiş değildir. [Kaynak, lisans, sınırlar ve yeniden üretim](docs/WORDBANK-10000.md).

## Nasıl öğretiyor?

**Tanış → anlamı hatırla → yardımsız yaz → başka bağlamda kullan → zamanı gelince tekrar et.**

- **İngilizce temel rotası:** 8 iletişim durağı, 48 özgün kalıp, açıklamalı örnekler ve farklı bağlam soruları.
- **FSRS-6:** tanıma, yazma, bağlam, dinleme ve parçalı cümle kurma kayıtları ayrıdır. Bir kelimeyi seçenekten tanımak, yazabildiğin anlamına gelmez.
- **Dört serbest oyun:** anlam eşleştirme, dinleme, aklından yazma ve cümle kurma; süre baskısı yoktur.
- **Kişisel defter:** arama, favoriler, kelime ve örnek ekleme, arşivleme ve geri alma.
- **İlerleme ve tekrar:** ilk uygulama ile sonraki günlerin kanıtı ayrıdır. İpuçları, erken tekrar ve aynı turdaki düzeltme takvimi ilerletmez. Kediyi sevmek veya izlemek XP kazandırmaz.

Türkçe açıklamalı İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Rusça ve Japonca için **277 temel ders kartı**, ayrıca yukarıdaki **10.000 kelimelik geniş havuz** bulunur. Temel kartlar: 234 kelime/cümle hedefi ve 43 dil bilgisi satırı. Ayrıntılı sıralı rota şu anda İngilizce temelidir; tam A1-C2 kursu veya CEFR sertifikası değildir. İleri seviye havuzlar küçüktür.

Başlangıç İngilizce sesleri pakettedir; diğer içeriklerde cihazın uygun dil sesi kullanılır. Konuşma veya telaffuz puanlama yapılmaz. Yazma kontrolü öğretilen biçimler ve listelenen alternatiflerle sınırlıdır.

## Gizlilik ve araştırma

Hesap, abonelik veya API anahtarı gerekmez. Eğitim kayıtları cihazındadır; sıkıştırılmış profil dosyasıyla saklanır ve JSON olarak yedeklenebilir. Sistem genelinde klavye, fare, ekran veya mikrofon kaydı yapılmaz. Kedi ve öğrenme ekranının dış ağ erişimi kapalıdır.

[Pedagojik araştırma ve sınırlar](https://github.com/snansrin/Pofinyo/blob/136607f8fc6f65bcc4a128eb6c8ac5edf827e6e1/docs/EDUCATION-RESEARCH-2026-10-27.md) · [Masaüstü katmanı ve kedi doğrulaması](https://github.com/snansrin/Pofinyo/blob/136607f8fc6f65bcc4a128eb6c8ac5edf827e6e1/docs/DESKTOP-CAT-2.0.md). Genel FSRS parametreleri kişisel geçmişe göre eğitilmez; hedef hatırlama oranı bir model ayarıdır, başarı garantisi değildir. Bağımsız öğretmen incelemesi ve karşılaştırmalı öğrenme etkisi çalışması henüz yapılmadı.

## Geliştirme

Güncel Pofinyo kaynakları geliştirme dalındadır. Node.js 24 ve Git:

```sh
git clone --branch feat/mochi-living-language https://github.com/snansrin/Pofinyo.git Pofinyo
cd Pofinyo
npm ci
npm start
npm run check
npm run test:desktop
npm run test:studio
npm run test:wordbank
npm run test:education
npm run test:companion
npm run dist:win
```

Windows masaüstü bağlantısı Win32 **SetParent / WS_CHILD** ile Explorer masaüstü görünümüne yapılır; yalnızca üstte tutmayı kapatmakla yetinilmez. Kedi masaüstü simgelerinin kardeş penceresidir. Bağlantı kaybolduğunda gizlenir. Konumlandırma odak çalmaz ve kedi hiçbir zaman topmost yapılmaz. Win32 erişimi sabit sürümlü MIT lisanslı Koffi ile ana süreçte sınırlıdır; renderer'a genel yerel API verilmez.

Model testleri hareket sınırlarını, davranış geçişlerini ve eğitim motorunu kapsar. Gerçek Electron testleri masaüstü ebeveynini, simgelerin üzerindeki sırayı, topmost olmamasını, sabit boyutta hareketi ve eğitim akışlarını doğrular. Explorer olmayan test ortamında görünür overlay yerine gizli kalması kontrol edilir. Eski sürümün hareket modeli testleri tarihsel regresyon kapsamı olarak korunmuştur.

Kedi, gizli bir Electron çizicisinden alınan alfa kareleriyle `UpdateLayeredWindow` üzerinden çizilir. Saydam veya görünür pikselleri olmayan kareler gösterilmez; doğrudan yeniden ebeveynlenen Chromium penceresinin siyah dikdörtgen sorunu bu yolla önlenir.

Masaüstü kedisi Windows Explorer gerektirir. macOS/Linux için masaüstü kedisi desteği yoktur. Diğer Windows kabukları ve tüm çoklu monitör/DPI kombinasyonları kapsamlı denenmedi. Electron'un bellek maliyeti vardır.

Pofinyo karakteri ve animasyonları özgün SVG/CSS çizimidir. MIT lisansı. [FSRS lisansı](https://github.com/snansrin/Pofinyo/blob/136607f8fc6f65bcc4a128eb6c8ac5edf827e6e1/ui/vendor/ts-fsrs.LICENSE) ve bağımlılıkların lisansları korunur.

Gerçek Explorer ebeveynliği testi etkileşimli Windows masaüstünde çalıştırılır. CI sunucusunda kedi katmanı gizli-kalma/DOM yoluyla kontrol edilir; `POFINYO_REAL_DESKTOP=1` yalnız gerçek masaüstü bulunan test oturumunda kullanılmalıdır. Farklı DPI awareness modları için bağlantı kurulmaz; normal overlay kullanılmaz.
