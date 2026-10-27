<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/ec9b0bef66cc123230e2c6d837195e5b9ec43935/assets/icon.svg" width="96" alt="Pofinyo ikonu"></p>
<h1 align="center">Pofinyo</h1>
<p align="center"><strong>Masaüstünde küçük bir kedi. Her gün birkaç yeni kelime.</strong></p>
<p align="center">Windows x64 · Çevrimdışı kelime havuzu · Türkçe açıklamalar · Yerel ilerleme kaydı</p>
<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/screenshots/pofinyo-desktop-cat.gif" width="240" alt="Pofinyo’nun yönüne göre yürümesi, koşması, oturması ve kıvrılıp uyuması"></p>

Pofinyo, **masaüstünde yaşayan animasyonlu bir kedi** ile **10.000 kelimelik İngilizce–Türkçe çalışma havuzunu** bir araya getirir. Kelimeleri küçük gruplarla tanı, yardımsız hatırla ve FSRS ile zamanı geldiğinde tekrar et.

**Güncel sürüm: 2.3.0.** [Windows paketleri](https://github.com/snansrin/Pofinyo/actions/runs/40487072942) · [Güncel uygulama kaynakları](https://github.com/snansrin/Pofinyo/tree/feat/mochi-living-language) · [Kelime kaynağı ve doğrulama](https://github.com/snansrin/Pofinyo/blob/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/WORDBANK-10000.md)

## Hemen başla

1. [Başarılı 2.3.0 Windows çalışmasındaki](https://github.com/snansrin/Pofinyo/actions/runs/40487072942) **Pofinyo-Windows** çıktısını aç. **Pofinyo-Setup-2.3.0.exe** kurulumlu, **Pofinyo-Portable-2.3.0.exe** taşınabilir sürümdür. Artifakt indirmek için GitHub oturumu gerekebilir.
2. Pofinyo’yu çalıştır. Kedi masaüstünde dolaşır; **Win + D** ile görebilirsin.
3. Sistem tepsisindeki Pofinyo menüsünden **Öğrenme ekranını aç** seçeneğine gir.
4. **◫ 10.000 kelime → 5 kelime öğren** ile önce karşılıkları gör, sonra hatırlamayı dene.
5. **Bu havuzla çalış** ana kelime havuzunu değiştirir. **Ders havuzuna dön** mevcut derslere döndürür.

Kediyi tepsideki **Masaüstü kedisi** seçeneğiyle açıp kapatabilirsin. Öğrenme penceresinin gizle düğmesi eğitim ekranını kapatır; uygulamayı tamamen kapatmak için tepsi menüsünden **Çıkış** seçilir. Windows ile başlatma ayarlardan isteğe bağlıdır.

## 10.000 kelime, küçük bir veri paketi

<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/screenshots/pofinyo-wordbank.png" width="300" alt="Türkçe karşılıklı 10.000 kelime, arama, favoriler ve beş kelimelik öğrenme turu"></p>

- **10.000 farklı İngilizce kelime**, en fazla üç kısa Türkçe karşılıkla gelir. İngilizce veya Türkçe arayabilir, favorilerine ekleyebilir ve tek kelimeyle çalışabilirsin.
- **Beşer kelimelik tur:** önce bütün karşılıklar gösterilir; ardından İngilizcesini yazman istenir. Çalışmalar mevcut FSRS tekrar kayıtlarına bağlanır.
- **218.033 bayt (~218 KB) kullanım verisi.** Sıkıştırılmış düzenlenebilir kaynak, lisanslar ve yeniden üretim betiğiyle tüm sözlük klasörü **491.011 bayt (~491 KB)**. Bunlar kelime verisinin boyutlarıdır; Electron uygulamasının toplam boyutu değildir.
- Sözlük ihtiyaç anında açılır. Aramada en fazla **40 sonuç**, çalışma havuzunda en fazla **60 kart** oluşturulur. Bütün sözlük kullanıcı ilerleme dosyasına kopyalanmaz.
- Öğrenme ekranı kullanılana kadar oluşturulmaz. Kedi kapatıldığında veya sistem kilitlendiğinde/askıya alındığında offscreen çizim durur.
- İlerleme sıkıştırılmış profil dosyasına kaydedilir. Kayıt sınırı **20.000 öğrenilmiş kart**, JSON yedek sınırı **32 MiB**’dir; önceki kayıtlar okunur.

Büyük havuz **İngilizce–Türkçe** içindir. Kelimelere CEFR seviyesi atanmaz. Sıralama altyazı kullanım sıklığına dayanır; kelimeler örnek cümle içermez, bu havuzda cümle kurma oyunu kapalıdır. Ayrıntılı bağlam çalışması için temel rota kullanılır.

## Masaüstünün kedisi

Pofinyo dört ayağıyla yürür, kısa koşular yapar, oturup etrafa bakar ve bir köşede kıvrılıp uyur. Uyandığında esneyip dolaşır. Ön, arka ve yan görünüşü hareket yönüne göre değişir; başını iki yana çevirir. Uyku pozunda aynı karakter yüzü, kapalı gözlerle kullanılır.

<table><tr><td align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/screenshots/pofinyo-cat-walk.png" width="180" alt="Pofinyo’nun dört ayaklı yürüyüşü"><br>Yürür ve koşar</td><td align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/screenshots/pofinyo-cat-sleep.png" width="180" alt="Aynı yüzle kıvrılıp uyuyan Pofinyo"><br>Kıvrılıp uyur</td></tr></table>

- **Kedi yalnız masaüstü katmanındadır:** simge ve klasörlerin önünde, normal uygulamaların arkasında. Masaüstü bağlantısı yoksa gizli kalır.
- **Öğrenme ekranı**, sen açtığında normal pencere olarak görünür. Üstte tutma kapalıdır.
- Fare kedinin üzerine geldiğinde bekler; tıklayınca tepki verir. Yalnız kendi penceresindeki etkileşimleri alır.
- Düşünce baloncukları hazırlanmış kısa cümlelerdir. Ekranı veya mikrofonu dinleyip düşünce üretmez.
- Kedi penceresi **180 × 165 DIP** boyutundadır. Hareket/çizim hedefi yaklaşık **60 güncelleme/saniye**; gerçekleşen hız donanıma ve sistem yüküne bağlıdır.

Animasyonlar özgün, stilize SVG/CSS çizimleridir. [Masaüstü katmanı, hareketler ve test sınırları](https://github.com/snansrin/Pofinyo/blob/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/DESKTOP-CAT-2.0.md).

## Nasıl öğretiyor?

**Tanış → anlamı hatırla → yardımsız yaz → farklı bağlamda kullan → zamanı gelince tekrar et.**

- **İngilizce temel rotası:** 8 iletişim ünitesi, 48 kalıp; açıklamalı öğretim, yazma ve yeni bağlam soruları. Bu sıra temel rotaya aittir; geniş sözlük havuzunun öğretimi tanışma ve hatırlama alıştırmalarıyla sınırlıdır.
- **FSRS-6:** tanıma, yazma, bağlam, dinleme ve cümle kurma becerileri ayrı kaydedilir. Bir kelimeyi seçenekten tanımak, onu yazabildiğin şeklinde değerlendirilmez.
- **Dört oyun:** anlam eşleştirme, dinleme, akıldan yazma ve örnek cümleyi parçalarıyla kurma. Cümle oyunu, örnek cümle içeren derslerde kullanılır.
- **Kişisel defter:** arama, favoriler, kelime/örnek ekleme, arşivleme ve geri alma. Geniş havuzun kendi arama ve favori görünümü de vardır.
- **Günlük hedef ve hata atölyesi:** ilerleme, XP ve aksesuarlar. İpucu, erken tekrar ve aynı turdaki düzeltme gecikmeli başarı kanıtı üretmez. Kediyi sevmek XP kazandırmaz.
- **Sesli okuma:** 49 İngilizce başlangıç ses kaydı pakettedir. Diğer kelimeler için cihazda uygun dil sesi gerekir. Konuşma veya telaffuz puanlaması yapılmaz.

## Hangi dilde ne var?

| Dil | Temel ders kartı | Geniş kelime havuzu |
|---|---:|---:|
| İngilizce | 97 | 10.000 |
| Almanca | 30 | — |
| Fransızca | 30 | — |
| İspanyolca | 30 | — |
| İtalyanca | 30 | — |
| Rusça | 30 | — |
| Japonca | 30 | — |
| **Toplam** | **277** | **10.000** |

İngilizce temel kart sayısına 48 kalıplık rota dahildir. Temel havuz 137 kelime/kelime grubu, 97 cümle/kalıp ve 43 dil bilgisi kartından oluşur. Havuzlar arasında ortak ifadeler bulunabilir; kart toplamı benzersiz kelime toplamı değildir. Kendi eklediğin kartlar bu sayılara dahil değildir.

Diğer altı dil küçük başlangıç havuzlarıdır. Yapılandırılmış rota şu anda İngilizce temelidir; tam A1–C2 kursu veya CEFR sertifikası değildir.

## Gizlilik, kaynaklar ve lisanslar

Hesap, abonelik veya API anahtarı gerekmez. Öğrenme kayıtları bu cihazda kalır; JSON olarak yedeklenip geri yüklenebilir. Uygulamanın renderer dış ağ istekleri engellenir; kelime paketi uygulamayla gelir. Sistem genelinde klavye, fare, ekran veya mikrofon kaydı yapılmaz.

Kelime anlamları **English–Turkish FreeDict 0.3**, sıralama **FrequencyWords / OpenSubtitles 2018** kaynaklıdır. Sık kullanılan bazı karşılıklar düzeltildi. Bütün 10.000 çeviri bağımsız öğretmen incelemesinden geçmiş değildir; eski veya bağlama göre değişen karşılıklar bulunabilir. [Veri kaynağı, lisanslar ve yeniden üretim](https://github.com/snansrin/Pofinyo/blob/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/WORDBANK-10000.md).

**Uygulama kodu ve özgün karakter çizimleri MIT; geniş kelime verisinin uyarlaması GPL-3.0-only lisanslıdır.** FreeDict ve FrequencyWords atıfları, özgün veri lisansları ve düzenlenebilir kaynak korunur. Veri lisansları uygulama kodunun MIT lisansından ayrıdır. [Veri bildirimleri](https://github.com/snansrin/Pofinyo/blob/ec9b0bef66cc123230e2c6d837195e5b9ec43935/ui/lexicon/NOTICE.txt) · [FSRS lisansı](https://github.com/snansrin/Pofinyo/blob/ec9b0bef66cc123230e2c6d837195e5b9ec43935/ui/vendor/ts-fsrs.LICENSE).

FSRS başlangıç parametreleri kişisel geçmişe göre eğitilmez; hedef hatırlama oranı bir model ayarıdır. Bağımsız öğretmen değerlendirmesi ve karşılaştırmalı öğrenme etkisi çalışması henüz yapılmadı. [Pedagojik araştırma ve sınırlar](https://github.com/snansrin/Pofinyo/blob/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/EDUCATION-RESEARCH-2026-10-27.md).

## Kaynaktan çalıştırma

Güncel 2.3 uygulama kodu **feat/mochi-living-language** dalındadır. **Node.js 24** ve Git ile:

```sh
git clone --branch feat/mochi-living-language https://github.com/snansrin/Pofinyo.git Pofinyo
cd Pofinyo
npm ci
npm start
```

Doğrulama ve Windows paketi:

```sh
npm run check
npm run test:desktop
npm run test:studio
npm run test:wordbank
npm run test:education
npm run test:companion
npm run dist:win
```

2.3.0 için **56 model/veri testi** ve beş Electron akışı geçti; [Windows CI doğrulaması ve paketleri](https://github.com/snansrin/Pofinyo/actions/runs/40487072942) başarılı. Gerçek Explorer testi etkileşimli Windows masaüstünde çalıştırılır. CI sunucusunda gizli kalma ve poz/uygulama akışları kontrol edilir. `POFINYO_REAL_DESKTOP=1` yalnız gerçek masaüstü olan test oturumunda kullanılır.

Masaüstü kedisi Windows Explorer gerektirir; macOS/Linux desteği yoktur. Tüm Windows kabukları ve çoklu monitör/DPI kombinasyonları denenmedi. Electron'un temel disk ve bellek maliyeti devam eder; yukarıdaki küçük boyutlar yalnız kelime verisine aittir.
