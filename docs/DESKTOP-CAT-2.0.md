# Pofinyo 2.0 masaüstü kedisi

Yüzen ada üzerindeki eski gezinti, dört ayaklı kedi ve Windows masaüstü alt-pencere düzeniyle değiştirildi. Yürüyüşte çapraz bacaklar; koşuda ön/arka çiftler; oturma, bakma, köşeye gitme, kıvrılma, uyku ve uyanış durumları vardır. Uyku bir köşe yolculuğunun ardından gelir. Hazır düşünce cümleleri kullanılır. Platform ve zıplama görünümü kaldırıldı.

Microsoft'un SetParent belgesindeki WS_CHILD / WS_POPUP kuralı uygulanır. Kedi, Explorer'a ait Progman/WorkerW içindeki SHELLDLL_DefView altına bağlanır ve SysListView32 simgelerinin önünde yer alır. Önce gizli oluşturulur; ebeveyn ve stiller doğrulanmadan gösterilmez. WS_EX_TOPMOST temizlenir; odak almadan, masaüstü alt-pencere sırası korunarak taşınır. Geçerli masaüstü bağlantısı yoksa gizli kalır. Öğrenme penceresi de üretim sürümünde aynı masaüstü katmanında açılır. Test modunda öğrenme UI otomasyonu için ayrı normal pencere kullanılır; kedi katman testi gerçek ebeveynliği ayrıca doğrular.

Windows native katmana erişim Koffi 3.3.4 / Node-API ile yalnız ana süreçtedir. Yalnız Pofinyo'ya ait pencere stilleri değiştirilir; Explorer'ın stilleri, dosyaları veya masaüstü simgeleri değiştirilmez. Global giriş kancaları yoktur. Kedi renderer'ının IPC yüzeyi durum okuma, kendi hover'ı ve sevme ile sınırlıdır. Ekran, mikrofon veya diğer uygulama içerikleri okunmaz.

47 model/veri/yerleşim testi geçti; bunların sekizi yeni kedi davranışlarını, yedisi korunan eski hareket modelini kapsar. Yeni model koşu/yürüyüş hızını, köşede otur-kıvrıl-uyu-uyan zincirini, sınırları, negatif koordinatları, durdurmayı ve zamanlayıcı temizliğini kontrol eder. Dört Electron test komutu katman/pozlar, mevcut oyunlar, defter ve eğitim rotasını doğrular. Gerçek Windows testinde attached=true, parentClass=SHELLDLL_DefView, aboveIcons=true, topmost=false, childStyle=true görüldü. Gerçek konum değişimi ve sabit boyut ayrıca ölçüldü. Explorer olmayan ortam için gizli kalma kontrolü vardır.

Kurulu 2.0.0.0 paketi üzerinde kedi katmanı ve öğrenme kontrolleri geçti. Normal kullanıcı oturumundaki ayrı salt-okunur Win32 kontrolünde masaüstü ebeveyni ve simge üstü sıra doğru, topmost kapalı, görünür normal üst-seviye pencere sayısı sıfırdı; konum değişti ve boyut sabit kaldı. Eğitim profili kurulumdan önce yedeklendi. Bu dosya geniş donanım örneklemi veya tüm Windows sürümleri için garanti değildir; bağlantı bulunamayan durumda overlay kullanılmaz.

Poz önizlemesi ayrı ve görünmeyen offscreen render işleminde üretildi. Kullanıcının masaüstü görüntüsü kaydedilmedi. Yürüyüş, koşu, oturma ve kıvrılıp uyuma görüntüleri görsel olarak incelendi.

Kaynaklar: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setparent ; https://learn.microsoft.com/en-us/windows/win32/winmsg/window-features ; https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowpos ; https://koffi.dev/ .

2.0.1: SetParent öncesinde ebeveyn ve çocuk pencerenin DPI awareness modları karşılaştırılır; uyumsuz modlarda bağlantı kurulmaz. GitHub Windows Server test oturumu gerçek etkileşimli Explorer oturumu olarak değerlendirilmez. CI gizli-kalma ve poz DOM kontrollerini yapar; gerçek masaüstü entegrasyonu yerel Windows oturumunda ve kurulu pakette ayrıca doğrulanır.
