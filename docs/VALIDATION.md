# 0.3.0 doğrulama — 26 Ekim 2026

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

## Güvenlik

IPC doğru ana frame ve tam URL gerektirir. Tek model isteği, gerçek akış boyutu sınırı, sabit yerel uç nokta, yönlendirme yasağı ve zaman aşımı vardır. Konum toplu yazılır; ikinci açılış mevcut pencereyi getirir. Başlangıç kaydı, sistem ayarı değişikliği, shell komutu veya uzak kod yürütme eklenmedi. Model için işletim sistemi seviyesinde CPU/RAM/GPU kotası uygulanmaz.
