<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/ec9b0bef66cc123230e2c6d837195e5b9ec43935/assets/icon.svg" width="96" alt="Pofinyo ikonu"></p>
<h1 align="center">Pofinyo</h1>
<p align="center"><strong>Masaüstünde küçük bir kedi. Her gün birkaç yeni kelime.</strong></p>
<p align="center">Windows x64 · Çevrimdışı kelime havuzu · Türkçe açıklamalar · Yerel ilerleme kaydı</p>
<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/screenshots/pofinyo-desktop-cat.gif" width="240" alt="Pofinyo’nun yönüne göre yürümesi, koşması, oturması ve kıvrılıp uyuması"></p>

Pofinyo, **masaüstünde yaşayan animasyonlu bir kedi** ile **yedi dilde toplam 70.000 sözlük başlığını** bir araya getirir. Kelimeleri küçük gruplarla tanı, yardımsız hatırla ve FSRS ile zamanı geldiğinde tekrar et.

**Güncel sürüm: 2.4.0.** [Windows paketleri](https://github.com/snansrin/Pofinyo/actions/runs/40539911001) · [Güncel uygulama kaynakları](https://github.com/snansrin/Pofinyo/tree/feat/mochi-living-language) · [Kelime kaynağı ve doğrulama](https://github.com/snansrin/Pofinyo/blob/d342d44306662a5c12875baf92cb2d3d886138a1/docs/LANGUAGE-PACKS-2.4.md)

## Hemen başla

1. [Başarılı 2.4.0 Windows çalışmasındaki](https://github.com/snansrin/Pofinyo/actions/runs/40539911001) **Pofinyo-Windows** çıktısını aç. **Pofinyo-Setup-2.4.0.exe** kurulumlu, **Pofinyo-Portable-2.4.0.exe** taşınabilir sürümdür. Artifakt indirmek için GitHub oturumu gerekebilir.
2. Pofinyo’yu çalıştır. Kedi masaüstünde dolaşır; **Win + D** ile görebilirsin.
3. Sistem tepsisindeki Pofinyo menüsünden **Öğrenme ekranını aç** seçeneğine gir.
4. **◫ 10.000 kelime** bölümünde dil paketini seç. **5 kelime öğren** ile önce karşılıkları gör, sonra hatırlamayı dene.
5. **Bu havuzla çalış** ana kelime havuzunu değiştirir. **Ders havuzuna dön** mevcut derslere döndürür.

Kediyi tepsideki **Masaüstü kedisi** seçeneğiyle açıp kapatabilirsin. Öğrenme penceresinin gizle düğmesi eğitim ekranını kapatır; uygulamayı tamamen kapatmak için tepsi menüsünden **Çıkış** seçilir. Windows ile başlatma ayarlardan isteğe bağlıdır.

## 7 dil × 10.000 kelime, küçük dil paketleri

<p align="center"><img src="https://raw.githubusercontent.com/snansrin/Pofinyo/d342d44306662a5c12875baf92cb2d3d886138a1/docs/screenshots/pofinyo-seven-packs.png" width="300" alt="Türkçe karşılıklı 10.000 kelime, arama, favoriler ve beş kelimelik öğrenme turu"></p>

- **Her dilde 10.000 ayrı sözlük başlığı**, en fazla üç kısa Türkçe karşılıkla gelir. Bazı başlıklar birleşik ifadeler veya yazım çeşitleridir. Seçtiğin dilde veya Türkçe arayabilir, favorilerine ekleyebilir ve tek kelimeyle çalışabilirsin.
- **Beşer kelimelik tur:** önce bütün karşılıklar gösterilir; ardından öğrendiğin dilde yazman istenir. Çalışmalar mevcut FSRS tekrar kayıtlarına bağlanır.
- **982.979 bayt (~983 KB) toplam kullanım verisi.** Altı yeni paketin toplamı 764.946 bayttır. Sıkıştırılmış düzenlenebilir kaynak, lisanslar ve yeniden üretim betiğiyle tüm sözlük klasörü yaklaşık **1,94 MiB**. Bunlar kelime verisinin boyutlarıdır; Electron uygulamasının toplam boyutu değildir.
- Yalnız seçilen dil paketi ihtiyaç anında açılır; dil değişince önceki paket bırakılır. Aramada en fazla **40 sonuç**, çalışma havuzunda en fazla **60 kart** oluşturulur. Bütün sözlük kullanıcı ilerleme dosyasına kopyalanmaz.
- Yerel paket ölçümünde seçilen sözlük yaklaşık **2,5–3,1 MiB ek JavaScript belleği** kullandı. Bu, uygulamanın toplam belleği değildir; donanıma ve kullanım geçmişine göre değişir.
- Öğrenme ekranı kullanılana kadar oluşturulmaz. Kedi kapatıldığında veya sistem kilitlendiğinde/askıya alındığında offscreen çizim durur.
- İlerleme sıkıştırılmış profil dosyasına kaydedilir. Kayıt sınırı **80.000 öğrenilmiş kart**, JSON yedek sınırı **256 MiB**’dir; önceki kayıtlar okunur.

Büyük havuzlar **İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Rusça ve Japonca → Türkçe** içindir. Kelimelere CEFR seviyesi atanmaz. Sıralama altyazı kullanım sıklığına dayanır; kelimeler örnek cümle içermez, bu havuzda cümle kurma oyunu kapalıdır. Ayrıntılı bağlam çalışması için temel rota kullanılır.

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
- **Sesli okuma:** 49 İngilizce başlangıç ses kaydı pakettedir. Örnekler ve diğer kelimeler yalnız doğru dildeki yerel sesle okunur; Electron sesi göremezse kurulu Windows sesine başvurulur. Uygun ses yoksa farklı dilin varsayılan sesi kullanılmaz. Konuşma veya telaffuz puanlaması yapılmaz. [Ses dili düzeltmesi ve doğrulama](https://github.com/snansrin/Pofinyo/blob/d342d44306662a5c12875baf92cb2d3d886138a1/docs/SPEECH-LANGUAGE.md).

## Hangi dilde ne var?

| Dil | Temel ders kartı | Geniş kelime havuzu |
|---|---:|---:|
| İngilizce | 97 | 10.000 |
| Almanca | 30 | 10.000 |
| Fransızca | 30 | 10.000 |
| İspanyolca | 30 | 10.000 |
| İtalyanca | 30 | 10.000 |
| Rusça | 30 | 10.000 |
| Japonca | 30 | 10.000 |
| **Toplam** | **277** | **70.000** |

İngilizce temel kart sayısına 48 kalıplık rota dahildir. Temel havuz 137 kelime/kelime grubu, 97 cümle/kalıp ve 43 dil bilgisi kartından oluşur. Havuzlar arasında ortak ifadeler bulunabilir; kart toplamı benzersiz kelime toplamı değildir. Kendi eklediğin kartlar bu sayılara dahil değildir.

Her dilde 10.000 başlıklı sözlük havuzu ve küçük başlangıç dersleri vardır. Yapılandırılmış rota şu anda İngilizce temelidir; tam A1–C2 kursu veya CEFR sertifikası değildir.

## Gizlilik, kaynaklar ve lisanslar

Hesap, abonelik veya API anahtarı gerekmez. Öğrenme kayıtları bu cihazda kalır; JSON olarak yedeklenip geri yüklenebilir. Uygulamanın renderer dış ağ istekleri engellenir; kelime paketi uygulamayla gelir. Sistem genelinde klavye, fare, ekran veya mikrofon kaydı yapılmaz.

İngilizce anlamlar **English–Turkish FreeDict 0.3**; diğer diller **FreeDict/WikDict, Ferheng ve Türkçe Vikisözlük/Kaikki**, sıralama **FrequencyWords / OpenSubtitles 2018** kaynaklıdır. Sık kullanılan bazı karşılıklar düzeltildi. Bütün çeviriler bağımsız öğretmen incelemesinden geçmiş değildir; eski veya bağlama göre değişen karşılıklar bulunabilir. [Veri kaynağı, lisanslar ve yeniden üretim](https://github.com/snansrin/Pofinyo/blob/d342d44306662a5c12875baf92cb2d3d886138a1/docs/LANGUAGE-PACKS-2.4.md).

**Uygulama kodu ve özgün karakter çizimleri MIT; İngilizce/Almanca veri uyarlamaları GPL-3.0-only, diğer beş dil CC-BY-SA-4.0 lisanslıdır.** FreeDict ve FrequencyWords atıfları, özgün veri lisansları ve düzenlenebilir kaynak korunur. Veri lisansları uygulama kodunun MIT lisansından ayrıdır. [Veri bildirimleri](https://github.com/snansrin/Pofinyo/blob/d342d44306662a5c12875baf92cb2d3d886138a1/ui/lexicon/NOTICE.txt) · [FSRS lisansı](https://github.com/snansrin/Pofinyo/blob/ec9b0bef66cc123230e2c6d837195e5b9ec43935/ui/vendor/ts-fsrs.LICENSE).

FSRS başlangıç parametreleri kişisel geçmişe göre eğitilmez; hedef hatırlama oranı bir model ayarıdır. Bağımsız öğretmen değerlendirmesi ve karşılaştırmalı öğrenme etkisi çalışması henüz yapılmadı. [Pedagojik araştırma ve sınırlar](https://github.com/snansrin/Pofinyo/blob/ec9b0bef66cc123230e2c6d837195e5b9ec43935/docs/EDUCATION-RESEARCH-2026-10-27.md).

## Kaynaktan çalıştırma

Güncel 2.4 uygulama kodu **feat/mochi-living-language** dalındadır. **Node.js 24** ve Git ile:

```sh
git clone --branch feat/mochi-living-language https://github.com/snansrin/Pofinyo.git Pofinyo
cd Pofinyo
npm ci
npm start
```

Doğrulama ve Windows paketi:

```sh
npm run check
npm run test:speech
npm run test:desktop
npm run test:studio
npm run test:wordbank
npm run test:education
npm run test:companion
npm run dist:win
```

2.4.0 için yerel doğrulamada **65 model/veri testi** ve altı Electron akışı geçti; [Windows CI sonuçları ve paketleri](https://github.com/snansrin/Pofinyo/actions/runs/40539911001) buradan izlenebilir. Gerçek Explorer testi etkileşimli Windows masaüstünde çalıştırılır. CI sunucusunda gizli kalma ve poz/uygulama akışları kontrol edilir. `POFINYO_REAL_DESKTOP=1` yalnız gerçek masaüstü olan test oturumunda kullanılır.

Masaüstü kedisi Windows Explorer gerektirir; macOS/Linux desteği yoktur. Tüm Windows kabukları ve çoklu monitör/DPI kombinasyonları denenmedi. Electron'un temel disk ve bellek maliyeti devam eder; yukarıdaki küçük boyutlar yalnız kelime verisine aittir.
