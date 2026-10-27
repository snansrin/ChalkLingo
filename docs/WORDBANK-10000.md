# Pofinyo 2.3 · İlk İngilizce paketinin arşiv raporu

**Güncel yedi dil / 70.000 başlık sürümü için [2.4 paket raporu](LANGUAGE-PACKS-2.4.md).** Aşağıdaki boyut ve sınırlar 2.3 sürümüne aittir.

10.000 farklı, tek sözcükten oluşan İngilizce başlık ve Türkçe karşılıkları içerir. Mevcut yedi dilin 277 ders kartı ve İngilizce 48 hedeflik temel rotası korunur. Büyük paket ilk aşamada İngilizce–Türkçedir; diğer altı dilin 10.000 kelimeye çıktığı iddia edilmez.

## Kaynak ve kalite

Anlamlar English–Turkish FreeDict 0.3'ten gelir. Kaynak, 1999–2017 çeşitli yazarların çalışmasıdır; GPL-2.0-or-later lisanslıdır. Kullanım sırası Hermit Dave/FrequencyWords İngilizce 2018 altyazı sıklığından (CC BY-SA 4.0) alınır. Sıklık CEFR seviyesi veya doğrulanmış pedagojik sıra değildir.

Başlıklar küçük harfli 2–24 İngilizce harften oluşur. Tekrar başlıklar birleştirilir, en fazla üç kısa karşılık tutulur; bozuk, eski/argo etiketli, uzun veya gönderme niteliğindeki bazı karşılıklar elenir. Sık kullanılan işlev sözcükleri ve bazı çok anlamlı sözcükler açık bir düzeltme listesiyle düzenlenir. Bütün 10.000 çeviri bağımsız öğretmen incelemesinden geçmiş değildir. Sözlükte eski veya bağlama göre değişen karşılıklar bulunabilir. Sahte örnek cümle veya A1–C2 etiketi üretilmez.

Uyarlanmış veri GPL-3.0-only olarak dağıtılır. FreeDict'in sonraki sürüm lisans seçeneği ve CC BY-SA 4.0'ın GPLv3 uyumluluğu kullanılır. Kaynakların özgün atıf/lisans bildirimleri korunur. Uygulama kodunun MIT lisansı ile veri lisansları ayrıdır.

- FreeDict: https://github.com/freedict/fd-dictionaries/blob/dc426dbe79483dc1c020bffca532470557cd94b9/eng-tur/eng-tur.tei
- FrequencyWords: https://github.com/hermitdave/FrequencyWords/blob/master/content/2018/en/en_50k.txt
- Uyumluluk: https://creativecommons.org/compatible-licenses/

## Boyut ve çalışma şekli

`ui/lexicon/manifest.json` gerçek kart sayısını, sıkıştırılmış/açılmış boyutu ve SHA-256 değerini içerir. Kullanım paketi yaklaşık 213 KiB gzip'tir. Düzenlenebilir kaynak, lisanslar ve betiklerle birlikte tüm sözlük klasörü 0,5 MiB altındadır. Paket tüm uygulamanın boyutu değildir; Electron'un mevcut kurulum maliyeti devam eder.

Sözlük ancak kütüphane istendiğinde veya kayıtlı havuz tercihiyle öğrenme ekranı açıldığında yüklenir. Yalnız yerel `mochi://app/lexicon/en.json` kaynağı kullanılır. Ana süreç sıkıştırılmış dosyanın SHA-256 ve boyutunu doğrular, en fazla 4 MiB çıktı sınırıyla açar. Dış ağ erişimi engeli devam eder.

Başlangıçta 10.000 kart nesnesi oluşturulmaz. Çeviriler kısa diziler halinde tutulur; arama sayfası en fazla 40, çalışma havuzu en fazla 60 kart nesnesi üretir. İlgili çalışma kayıtları ve favoriler gerektiğinde çözümlenir. Ders bahçesi de en fazla 100 filiz çizer; toplam ilerleme sayısı korunur.

Öğrenme ekranı üretim sürümünde kullanıcı isteyene kadar oluşturulmaz. Kedi kapatıldığında veya sistem askıya alındığında offscreen çizim durdurulur. Bu, bütün oyun/üst pencere durumlarında otomatik görünürlük kısması bulunduğu anlamına gelmez.

## Öğrenme ve kayıt

Kütüphanede İngilizce/Türkçe arama, favoriler, kelimeye özel tanışma ve yazma kontrolü vardır. Beş kelimelik tur önce bütün karşılıkları gösterir, sonra hatırlama ister. Havuz, mevcut anlam eşleştirme/dinleme/yazma oyunlarına ve beceriye göre FSRS kayıtlarına bağlanır. Örnek cümle içermeyen havuzda cümle kurma oyunu devre dışıdır. Ayrıntılı yeni bağlamlı öğretim için mevcut 48 kalıplık rota kullanılır.

Eski tarayıcı kayıtları okunur. Bundan sonraki ilerleme ayrıca sabit profil dosyası `learning-progress.json.gz` içinde sıkıştırılıp geçici dosyadan atomik olarak yenilenir. Yerel depolama kotası dolsa da dosya kaydı devam eder. Öğrenilmiş kart/FSRS kayıt sınırları 20.000'e, yedek sınırı 32 MiB'ye çıkarıldı; bütün sözlük kopyası kullanıcı ilerleme dosyasına yazılmaz.

## Yeniden üretim

Kurulumda lisans ve tam düzenlenebilir kaynak `resources/app.asar.unpacked/ui/lexicon/` içinde bulunur. Yalnız bu kaynakla, ağ kullanmadan:

```sh
python ui/lexicon/build-pack.py
```

Orijinal kaynaklardan yeniden içe aktarma için `tools/import-wordbank.py SOURCE_DIR ui/lexicon` kullanılır. SOURCE_DIR, `eng-tur.tei`, `en_50k.txt`, `GPL-3.0.txt`, `CC-BY-SA-4.0.txt` dosyalarını içerir. Orijinal girdi hash'leri `SOURCES.json` içinde kayıtlıdır. Dağıtılan tercih edilen düzenlenebilir kaynak `en-source.tsv.gz`'dir; uygulamanın Python'a ihtiyacı yoktur.

## Doğrulama

Model/veri testleri gerçek 10.000 tekil başlığı, Türkçe karşılıkları, digest'i, boyutu, sınırlı aramayı, bilinen temel kelimeleri, bozuk girdileri ve 10.020 kartlık kayıt/FSRS geri yüklemesini kapsar. Electron testi sözlüğün başlangıçta yüklenmemesini, arama ve 40 sonuç sınırını, gerçek yazma/FSRS kaydını, profil dosyasına kaydetme ve yeniden açmayı, havuz/ders geçişini, beş kelimenin testten önce gösterilmesini ve lisans ekranını doğrular.
