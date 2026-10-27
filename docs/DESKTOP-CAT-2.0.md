# Pofinyo 2.0 masaüstü kedisi

Yüzen ada üzerindeki eski gezinti, dört ayaklı kedi ve Windows masaüstü alt-pencere düzeniyle değiştirildi. Yürüyüşte çapraz bacaklar; koşuda ön/arka çiftler; oturma, bakma, köşeye gitme, kıvrılma, uyku ve uyanış durumları vardır. Uyku bir köşe yolculuğunun ardından gelir. Hazır düşünce cümleleri kullanılır. Platform ve zıplama görünümü kaldırıldı.

Microsoft'un SetParent belgesindeki WS_CHILD / WS_POPUP kuralı uygulanır. Kedi, Explorer'a ait Progman/WorkerW içindeki SHELLDLL_DefView altına bağlanır ve SysListView32 simgelerinin önünde yer alır. Önce gizli oluşturulur; ebeveyn ve stiller doğrulanmadan gösterilmez. WS_EX_TOPMOST temizlenir; odak almadan, masaüstü alt-pencere sırası korunarak taşınır. Geçerli masaüstü bağlantısı yoksa gizli kalır. Öğrenme penceresi de üretim sürümünde aynı masaüstü katmanında açılır. Test modunda öğrenme UI otomasyonu için ayrı normal pencere kullanılır; kedi katman testi gerçek ebeveynliği ayrıca doğrular.

Windows native katmana erişim Koffi 3.3.4 / Node-API ile yalnız ana süreçtedir. Yalnız Pofinyo'ya ait pencere stilleri değiştirilir; Explorer'ın stilleri, dosyaları veya masaüstü simgeleri değiştirilmez. Global giriş kancaları yoktur. Kedi renderer'ının IPC yüzeyi durum okuma, kendi hover'ı ve sevme ile sınırlıdır. Ekran, mikrofon veya diğer uygulama içerikleri okunmaz.

47 model/veri/yerleşim testi geçti; bunların sekizi yeni kedi davranışlarını, yedisi korunan eski hareket modelini kapsar. Yeni model koşu/yürüyüş hızını, köşede otur-kıvrıl-uyu-uyan zincirini, sınırları, negatif koordinatları, durdurmayı ve zamanlayıcı temizliğini kontrol eder. Dört Electron test komutu katman/pozlar, mevcut oyunlar, defter ve eğitim rotasını doğrular. Gerçek Windows testinde attached=true, parentClass=SHELLDLL_DefView, aboveIcons=true, topmost=false, childStyle=true görüldü. Gerçek konum değişimi ve sabit boyut ayrıca ölçüldü. Explorer olmayan ortam için gizli kalma kontrolü vardır.

Kurulu 2.0.0.0 paketi üzerinde kedi katmanı ve öğrenme kontrolleri geçti. Normal kullanıcı oturumundaki ayrı salt-okunur Win32 kontrolünde masaüstü ebeveyni ve simge üstü sıra doğru, topmost kapalı, görünür normal üst-seviye pencere sayısı sıfırdı; konum değişti ve boyut sabit kaldı. Eğitim profili kurulumdan önce yedeklendi. Bu dosya geniş donanım örneklemi veya tüm Windows sürümleri için garanti değildir; bağlantı bulunamayan durumda overlay kullanılmaz.

Poz önizlemesi ayrı ve görünmeyen offscreen render işleminde üretildi. Kullanıcının masaüstü görüntüsü kaydedilmedi. Yürüyüş, koşu, oturma ve kıvrılıp uyuma görüntüleri görsel olarak incelendi.

Kaynaklar: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setparent ; https://learn.microsoft.com/en-us/windows/win32/winmsg/window-features ; https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowpos ; https://koffi.dev/ .

2.0.1: SetParent öncesinde ebeveyn ve çocuk pencerenin DPI awareness modları karşılaştırılır; uyumsuz modlarda bağlantı kurulmaz. GitHub Windows Server test oturumu gerçek etkileşimli Explorer oturumu olarak değerlendirilmez. CI gizli-kalma ve poz DOM kontrollerini yapar; gerçek masaüstü entegrasyonu yerel Windows oturumunda ve kurulu pakette ayrıca doğrulanır.

## 2.1 — siyah dikdörtgen ve karakter tutarlılığı

Kullanıcı 2.0.1 üzerinde siyah alan bildirdi. HWND ebeveynliği, konum ve boyut testleri geçse de bunlar görsel alfa birleşimini doğrulamıyordu. Kedi artık gizli, yazılımsal offscreen Electron çizicisinden BGRA kareleri üretir. Görünen pencere Explorer altında `WS_CHILD | WS_EX_LAYERED | WS_EX_NOACTIVATE` kullanan ayrı bir yerel yüzeydir. `UpdateLayeredWindow` premultiplied alpha ile çizimi aktarır; boş veya opak dikdörtgen kareler reddedilir. Gizli çizici hiçbir zaman gösterilmez.

Yerel Electron testi artık layered stilini, başarılı alfa yüklemesini, birden fazla kareyi, saydam/görünür piksel sayısını ve çizicinin gizli kalmasını da kontrol eder. Katman bağlanması tek başına görsel doğrulama sayılmaz. Önceki Pofinyo yüzü, yanakları, yaprak ve yeşil fular dört ayaklı karaktere geri taşındı.

Kaynaklar: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatelayeredwindow ve https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering

## 2.2 — kullanıcı açıklaması ve hareket geliştirmesi

Kullanıcı kedinin göründüğünü, siyah pencerenin öğrenme ekranı açıldığında oluştuğunu netleştirdi. Bu nedenle öğrenme ekranının Explorer altına bağlanması kaldırıldı. Eğitim ekranı artık yalnız açıkça çağrıldığında normal, opak zeminli, topmost olmayan bir pencere olarak açılır. Masaüstü katmanı yalnız gezinen kediye aittir. Yukarıdaki 2.0/2.1 notları tarihsel uygulamayı anlatır.

Kedi penceresi 240×220 DIP yerine 180×165 DIP oldu (%25 küçülme). Konum adımları 50 ms yerine 16 ms aralık hedefler. Çizici hedefi 30'dan 60 FPS'e çıktı. Konum aktarımında her adımda Explorer/top-level pencere taraması yapılmaz; kendi geçerli masaüstü ebeveyni kullanılır. Gerçek kare hızı donanım ve sistem yüküne bağlıdır.

Dikey/çapraz yukarı hareket ayrı arka görünüşü, aşağı hareket ön görünüşü kullanır; yana kayıyormuş gibi görünen sabit yan siluet kaldırıldı. Ayaklarda basma ve kaldırma fazı, dönüş geçişi ve iki yana baş bakışı eklendi. Hareketler özgün stilize SVG animasyonlarıdır; gerçek bir kedinin motion-capture kaydı değildir.

Testler: 50 model/eğitim testi; yön seçimi ve yaklaşık 60 Hz model adımları; gerçek Explorer'da küçük boyut, devam eden alfa kareleri ve yer değiştirme; ön/arka/yan görünüşlerin ayrı görünürlüğü; öğrenme ekranının masaüstü çocuğu olmadan açılması.
