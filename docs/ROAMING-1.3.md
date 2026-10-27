# Pofinyo 1.3 - masaüstü gezintisi

Küçük arkadaş moduna açılıp kapanabilen bir gezinti eklendi. Yerel pencere, geçerli monitörün çalışma alanında yumuşak geçişlerle hareket eder. Altında yüzen adası kalır; karakter yürüyüşte hafifçe salınır. Hedefler, kısa beklemeler ve hareket adımları yerel ve deterministik sınırlar içindedir; sürekli yapay zekâ isteği veya global giriş kaydı yoktur.

Gezintideki düşünce baloncuğu sakin, yazılmış cümleler ve tanışılan kelimelerden çağrışımlar gösterir. Bu içerik puanlanmaz. İsteğe bağlı açılır; açık tercih yeniden başlatmada korunur. Üzerine gelme, manuel taşıma, gizleme, kilit, uyku ve hareket azaltma durumlarında hareket bekler. Monitör çalışma alanı değişirse sınırlar yeniden hesaplanır. Çoklu monitörde geçiş yapılmaz.

Küçük modda Gezintiye çık / Burada dinlen, ayarlarda Masaüstü gezintisi ve sistem tepsisinde gezinme / öğrenmeye dönüş seçenekleri vardır. Gezinti süresince üstte tutulur; kapatılınca önceki üstte tutma tercihi geri gelir. Keşfe dön ile widget konumuna geri dönülür. Eski profil, origin ve eğitim kayıtları korunur.

38 model/veri/yerleşim testi geçti. Gezinti modeli negatif koordinatlar, dar alan, yumuşak adımlar, bekleme, durdurma, hover, gizleme, hareket azaltma, uyku ve alan değişimini kapsar. Dört gerçek Electron akış grubu geçti: mevcut oyunlar, defter/aksesuarlar, eğitim rotası ve gezinti. Gezinti testinde gerçek pencere koordinatlarının değiştiği ölçüldü; düşünce değişimi, sıfır pasif XP, kayıt tercihi, renderer yeniden yükleme, durdurma, üstte tutmayı geri alma ve widget dönüşü kontrol edildi. Windows çerçevesiz pencere yuvarlaması dönüşte iki piksel toleransla değerlendirildi.

Önizleme GIF'i gerçek test penceresinin 18 karesinden oluşturuldu; kullanıcının masaüstü kaydedilmedi. PNG ve GIF görsel olarak incelendi. Geniş donanım örneklemi veya gerçek çok monitörlü kullanıcı deneyi yapılmadı; sınırlama mantığı model testleriyle doğrulandı.
