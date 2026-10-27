# Pofinyo 2.4 · Yedi küçük dil paketi

27 Ekim 2026. Her dilde 10.000 ayrı sözlük başlığı ve Türkçe karşılıklar bulunur: toplam 70.000 başlık. İngilizcenin eski kimlikleri ve ilerlemesi korunur. 277 temel ders kartı ve İngilizce 48 kalıplık yapılandırılmış rota değişmez. Bu genişleme, altı yeni tam dil kursu veya 70.000 bağımsız öğretmen onaylı çeviri anlamına gelmez.

## Boyut

| Dil | Başlık | Çalışma paketi, bayt | Veri uyarlama lisansı |
|---|---:|---:|---|
| İngilizce | 10.000 | 218.033 | GPL-3.0-only |
| Almanca | 10.000 | 146.009 | GPL-3.0-only |
| Fransızca | 10.000 | 135.316 | CC-BY-SA-4.0 |
| İspanyolca | 10.000 | 111.819 | CC-BY-SA-4.0 |
| İtalyanca | 10.000 | 114.040 | CC-BY-SA-4.0 |
| Rusça | 10.000 | 135.040 | CC-BY-SA-4.0 |
| Japonca | 10.000 | 122.722 | CC-BY-SA-4.0 |
| **Toplam** | **70.000** | **982.979** | |

Altı ek çalışma paketi 764.946 bayttır. Düzenlenebilir sıkıştırılmış kaynak, bildirimler, lisanslar ve yeniden üretim betiği dahil sözlük klasörü yaklaşık 1,94 MiB'dir. Bunlar veri boyutlarıdır; Electron uygulamasının toplam boyutu değildir. Büyük kaynak arşivleri, Python, çeviri modeli veya indirici çalışma zamanına eklenmez.

## Kaynak seçimi ve kalite

İngilizce önceki FreeDict 0.3 / FrequencyWords uyarlamasıdır; dosyasının SHA-256 değeri değişmedi. Almanca Ferheng/FreeDict 0.2.2, Fransızca/İtalyanca/İspanyolca FreeDict–WikDict, Rusça/Japonca WikDict ve Türkçe Vikisözlük'ün Kaikki/Wiktextract çıktısı kullanılır. Bazı ek karşılıklar, açık Türkçe → hedef dil çeviri bağlantısının tersinden alınır; araya İngilizce sokularak makine çevirisi yapılmaz.

İçe aktarıcı NFC ve boşlukları normalleştirir; kaynakta işaretlenmiş çekimleri, ekleri ve özel adları eler. Büyük/küçük harf çeşitleri ve Rusça vurgu işaretleriyle oluşan tekrarlar ayrı başlık sayılmaz. En çok üç kısa karşılık tutulur. Sık kullanılan işlev sözcükleri için açık bir editoryal düzeltme listesi vardır. Kaynakta yeterli sözcük yoksa betik hata verir; sayı uydurma biçimlerle doldurulmaz.

Başlıklar arasında birleşik ifadeler ve farklı yazım çeşitleri bulunabilir; tümünün ayrı kök olduğu iddia edilmez. Kaynak etiketleri her zaman eksiksiz olmadığından bazı çekimler veya bağlama bağımlı anlamlar kalabilir. Çevirilerin tamamı bağımsız öğretmen incelemesinden geçmedi. CEFR düzeyi veya örnek cümle uydurulmaz. FrequencyWords/OpenSubtitles sıklığında bulunan başlıklar önce gelir; sıklıkta bulunmayanlar sonra alfabetik sıralanır. Bu sıra pedagojik etki araştırması değildir.

- [FreeDict kaynak kataloğu](https://freedict.org/freedict-database.json)
- [WikDict doğrudan sözlükleri](https://download.wikdict.com/dictionaries/tei/recommended/)
- [Türkçe Vikisözlük / Kaikki kaynak açıklaması](https://kaikki.org/trwiktionary/rawdata.html)
- [FrequencyWords](https://github.com/hermitdave/FrequencyWords)

Tam sürümler, kaynak adresleri ve indirilen dosyaların SHA-256 değerleri `ui/lexicon/SOURCES.json` ve `MULTILINGUAL-SOURCES.json` içindedir. Karl Bartel, Erdal Ronahi, Wiktionary yazarları, DBnary, Tatu Ylönen ve Hermit Dave atıfları `NOTICE.txt` içinde korunur. CC BY-SA 3.0 kaynaklarının uyarlamaları sonraki BY-SA 4.0 ile dağıtılır; Almanca GPLv3 uyarlamasında CC BY-SA 4.0 → GPLv3 uyumluluğu kullanılır. Uygulama kodu ayrı MIT lisanslıdır.

## Bellek ve işlemci

Öğrenme ekranı açılmadan sözlük yüklenmez. Ekranda da yalnız seçilen dilin bir paketi tutulur. Dil değişince önceki paket referansı bırakılır ve bekleyen okuma iptal edilir; eski yanıtın yeni dilin üstüne yazması engellenir. Çöpten toplamanın tam zamanı JavaScript motoruna bağlıdır. Yedi paketi biriktiren önbellek, yeni arka plan süreci, zamanlayıcı veya ağ indirmesi eklenmez.

Ana süreç yalnız izinli yedi yerel paketi açar; sıkıştırılmış boyut ve SHA-256 kontrolü yapar, açılmış veriyi 4 MiB ile sınırlar. Arama sayfası en fazla 40, çalışma havuzu en fazla 60 karttır. 180 ms arama geciktirmesi vardır. Bahçede en fazla 100 filiz çizilir. Kedi hareket/çizim kodu bu değişiklikte değiştirilmedi.

Bu bilgisayarda Node v24.19.0, Windows ve zorlanmış GC ile sıralı ölçüm (`node --expose-gc tools/benchmark-wordbanks.cjs`):

| Dil | Paket açma + doğrulama, ms | Arama ortalaması, ms | Başlangıca göre JS heap, MiB |
|---|---:|---:|---:|
| en | 18,87 | 11,77 | 3,12 |
| de | 10,96 | 8,98 | 2,73 |
| fr | 9,54 | 7,74 | 2,66 |
| es | 8,35 | 6,54 | 2,53 |
| it | 9,15 | 7,06 | 2,58 |
| ru | 10,69 | 11,03 | 2,70 |
| ja | 9,26 | 10,11 | 2,56 |

Her dilde 20 adet `su` aramasının ortalamasıdır; UI çizimi ve Electron süreç toplamı dahil değildir. Ölçümler bu oturuma aittir; sıfır işlemci/bellek kullanımı veya her cihazda aynı hız garantisi değildir. Paket kullanılırken açma ve arama kısa süreli iş yapar. Öğrenme geçmişi büyüdükçe profil belleği/kaydetme maliyeti ayrıca artar.

## İlerleme ve ses

70.000 kelimelik kullanımda geçmişin 20.000'de kesilmemesi için kayıt, favori ve FSRS sınırı 80.000'e çıkarıldı. Profil ve JSON geri yükleme sınırı 256 MiB; bu bir ayrılan bellek miktarı değildir. Mevcut gzip profil ve atomik dosya yenileme korunur. Sözlük verisi ilerlemeye kopyalanmaz.

Beş kelimelik tur önce anlamları öğretir, sonra seçilen dilde yazma ister; mevcut beceriye göre FSRS kaydına bağlanır. Örnek içermeyen geniş havuzda cümle kurma oyunu kapalıdır. Ses yalnız aynı dilde kurulu yerel ses varsa kullanılır. Bu içerik paketleri Windows ses/dil paketi kurmaz; uygun ses yoksa Türkçe varsayılanla yanlış okuma yapılmaz.

## Doğrulama ve yeniden üretim

65 model/veri testi: yedi dilde tam 10.000 başlık, Unicode, çeviri örnekleri, SHA-256, sayfa/havuz sınırları, eski İngilizce kimlikleri ve 70.000 kaydın/favorinin/FSRS geçmişinin gzip kaydı ve geri yüklenmesi. Electron testi yedi dilde arama → Türkçe karşılık → yazma → FSRS kaydı, favoriler, yeniden başlatma ve hızlı dil değişimini doğrular. Öğrenme, ses ve gerçek Explorer masaüstü katmanı regresyonları da yerelde geçmiştir.

Kurulumda `resources/app.asar.unpacked/ui/lexicon/` içindeki `*-source.tsv.gz` dosyaları uyarlamaların tam düzenlenebilir tercih edilen kaynağıdır. `python build-pack.py` yedi çalışma paketini ve manifesti ağ olmadan yeniden üretir. Ham kaynaklardan içe aktarma `tools/import-multilingual.py SOURCE_DIR ui/lexicon` ile yapılır; bu betik sadece geliştirme içindir. Gerekli TEI dosyaları lisanslı arşivlerden alınır; kaynak listesi dosya isimlerini ve hashlerini belirtir.
