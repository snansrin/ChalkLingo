# Pofinyo 1.3.1 - yürüyüş tercihi düzeltmesi

Kurulu 1.3.0 sürümünde gerçek kullanıcı profili incelendi: animasyon açık ve sistem hareket azaltma kapalıydı, fakat window.json içindeki roaming tercihi false idi. Öğrenme ekranına dönüş, aktif yürüyüşü durdururken kalıcı gezinti tercihini de kapatıyordu.

İstenen gezinti ile o anda yürümek ayrı tutuluyor. Ders sırasında hareket bekler, tercih korunur; küçük arkadaş moduna dönünce yürüyüş sürer. Yeniden açılış aynı tercihi uygular. Burada dinlen, ayarlar veya tepsi üzerinden açıkça kapatmak tercihi kalıcı olarak kapatır. Eski roaming true/false alanı geriye uyumludur.

İlk yürüyüş ve bir beklemeden dönüş yaklaşık 0,9 saniyede başlar. Normal turlar arasında düşünme molaları sürer. Aynı hareket/görünürlük/hover sinyalinin tekrar gelmesi bekleme sayacını sürekli başa almıyor. Eski IPC durum yanıtları daha yeni durumu ezmiyor. Fare üzerindeyken veya hareket azaltma açıkken baloncuk bunun neden beklediğini açıklıyor.

39 model testi geçti. Dört masaüstü test komutu ve ek tam yeniden başlatma regresyonu geçti. Yeni regresyon gerçek pencerenin yer değiştirdiğini, ders ekranında tercihin açık kaldığını, küçük modda devam ettiğini, uygulama tamamen kapanıp açıldığında yeniden yürüdüğünü ve açıkça durdurmanın yeniden açılışta korunduğunu doğrular. Bu regresyonda native hover durumu zorla kapatılmaz. Mevcut oyunlar, eğitim, defter ve aksesuarlar da doğrulandı.

Gerçek kullanıcı profili incelemeden önce yedeklendi. Tanılama yalnız sürüm, hareket ayarı ve pencere/gezinti durumunu okudu; eğitim cevabı veya XP üretmedi. Kurulu düzeltmenin gerçek profildeki hareket sonucu ayrı teslim doğrulamasına eklenir.
