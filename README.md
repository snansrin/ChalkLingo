# ChalkLingo · Küçük kara tahta dil öğretmeni

**ChalkLingo v0.3.1** — Windows masaüstünde Yapışkan Notlar kadar küçük, etkileşimli ve tepsiye gizlenebilen dil öğrenme widget’ı. Bağımsızdır; DendroGeo ile ilişkili değildir.

## Gerçek uygulama ekran görüntüleri

**Önemli:** Masaüstünde sürekli görünen normal widget yalnızca **360 × 340 piksel**. Aşağıdaki ilk görüntü bu **gerçek normal boyuta** aittir. Diğer üç ekran **yalnızca ayarlar veya Çalış açılınca geçici olarak 520 × 640 piksele büyür**. README’deki küçük fotoğraflar sunum için ölçeklendirilmiştir; uygulamanın pencere boyutunu değiştirmez.

### Normal görünüm — küçük masaüstü widget'ı

<a href="docs/screenshots/widget-compact.png" title="Orijinal 360×340 ekran görüntüsünü aç">
  <img src="docs/screenshots/widget-compact.png" width="280" alt="ChalkLingo küçük masaüstü widget'ı, gerçek pencere boyutu 360 × 340 piksel" />
</a>

**Pencere: 360 × 340 px** · Yapışkan not benzeri kara tahta · Sol tıkla yeni kelime · Görev çubuğunda düğme yok · Sistem tepsisinden açılır.

### Yalnızca açıldığında büyüyen paneller

| Sağ tık → Ayarlar | Telaffuz & başlangıç | ✎ Çalış → Öğretmen |
| :---: | :---: | :---: |
| <a href="docs/screenshots/widget-settings.png"><img src="docs/screenshots/widget-settings.png" width="168" alt="Ayar paneli, geçici 520×640 pencere" /></a> | <a href="docs/screenshots/widget-voice.png"><img src="docs/screenshots/widget-voice.png" width="168" alt="Ses seçimi, geçici 520×640 pencere" /></a> | <a href="docs/screenshots/widget-practice.png"><img src="docs/screenshots/widget-practice.png" width="168" alt="Etkileşimli öğretmen, geçici 520×640 pencere" /></a> |
| Geçici **520×640** | Geçici **520×640** | Geçici **520×640** |

Küçük resimlere tıklayarak orijinal PNG'leri açabilirsin. Görüntüler gerçek Windows/Electron pencerelerinden otomatik alınmıştır; çizim veya temsili tasarım değildir.

**Kullanım:** Widget normalde 360×340 kalır. ⚙ / sağ tık veya **✎ Çalış** düğmesi geçici genişletir; pencere kapatıldığında küçük hâline döner. **− / ×** widget'ı tepsiye gizler; çıkış için sistem tepsisi → **Uygulamadan çık**.

## Özellikler ve gerçek sınırlar

| Konu | v0.3.1 davranışı |
| --- | --- |
| Görev çubuğu | Normal pencere düğmesi yok (`skipTaskbar: true`); tepside küçük simge |
| Windows açılışı | **Kurulu sürümde** ilk açılışta yalnızca mevcut kullanıcı için girişe eklemeyi dener; sağ tık → **Windows ile başlat** üzerinden kapatılabilir |
| Konum | Widget’ın ekrandaki yeri cihazda saklanır |
| Dil | İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Rusça, Japonca |
| Seviye | A1–C2 *örnek içerik bantları*; resmî yeterlilik veya tam müfredat değil |
| Ders | 212 başlangıç kartı; kelime, cümle ve dil bilgisi |
| Etkileşim | Türkçe açıklama, aktif hatırlama, cevap yazma/seçme, ipuçları ve aralıklı tekrar |
| Telaffuz | Seçilen dille eşleşen sistem seslerinden seçim; **İngilizce ses yoksa Türkçe aksana düşmez, uyarı verir** |
| Ses kalitesi | Windows’ta kurulu ses motoruna bağlıdır; insan sesi veya tüm kelimelerde kusursuz aksan garanti edilmez |
| Otomatik ders | Kapalı veya 30 saniye–2 saat; gizliyken ve ayarlar/alıştırma açıkken zamanlayıcı duraklatılır |
| Yapay zekâ | İsteğe bağlı yerel Ollama; internetten model indirmek ayrıca gerekir, model kapalıyken hizmet çağrılmaz |
| Kaynak kullanımı | Gizliyken animasyon/ses/timer durdurulur; Electron arka planda bir miktar RAM tüketir |

Windows girişine ekleme işletim sisteminin **Electron `app.setLoginItemSettings`** API’siyle yapılır. Yönetici izni istemez, Defender veya güvenlik duvarını kapatmaz, ayrı servis kurmaz. **Taşınabilir EXE başka klasöre taşınırsa** açılış kaydı yeniden ayarlanmalıdır. Geliştirme modunda girişe ekleme kapalıdır.

**Telaffuz:** Sesli oku (♫) ya da **R** ile dinle. Sağ tık → **TELAFFUZ SESİ** altında hedef dilin uygun seslerini seç. Uygun ses görünmüyorsa Windows dil/konuşma paketlerine bak. Sesin doğru dil etiketine sahip olması doğal veya kusursuz telaffuz garantisi değildir. Başka dildeki sistem sesiyle yanlış telaffuza otomatik geçiş yapılmaz.

## Kurulum ve kullanım

Windows’ta **Node.js 24+** ve Git kuruluysa:

```powershell
git clone https://github.com/snansrin/ChalkLingo.git
cd ChalkLingo
npm ci
npm run check
npm start
```

Kurulabilir ve taşınabilir **imzasız** Windows EXE dosyalarını üretmek için:

```powershell
npm run dist:win
```

[GitHub Actions → Verify and package](https://github.com/snansrin/ChalkLingo/actions/workflows/ci.yml) başarılı tamamlandığında **ChalkLingo-Windows** artifact’ını indir. Windows SmartScreen uyarısında korumayı devre dışı bırakma. Temiz fiziksel cihazda kurulum/kaldırma ve bütün sistem sesleri henüz topluca doğrulanmadı.

### Kontroller

- **Tahtaya sol tık / Space:** yeni ders (tebeşir silinme animasyonu)
- **Sağ tık / ⚙ / S:** öğretim dili, A1–C2 seviyesi, gramer/kelime/cümle, ses, otomatik başlangıç ve diğer seçenekler
- **✎ Çalış:** etkileşimli aktif hatırlama oturumu; panel açılınca genişler
- **↶ / 1:** tekrar gerek; **✓ Öğrendim / 2:** öğrendim
- **♫ / R:** telaffuz; yalnızca hedef dilin sesi bulunursa çalışır
- **− / ×:** tepsiye gizle; tepsiden tekrar aç veya çıkış yap

## Güvenlik ve gizlilik

Electron `contextIsolation:true`, `sandbox:true`, `nodeIntegration:false` kullanır. IPC yalnızca beklenen ana pencerenin isteğini kabul eder, dış gezinme ve açılır pencere engellenir. CSP ağdan script yüklenmesini yasaklar. Ders geçmişi cihazda saklanır. İsteğe bağlı Ollama, yalnızca kullanıcı etkinleştirip soru gönderirse sabit yerel `127.0.0.1:11434` adresine bağlanır. Uygulamanın amacı masaüstünü öğretim alanına çevirmektir, Windows güvenlik ayarlarıyla oynamak değildir.

## Mimari ve kalite kontrol

```text
main.cjs                     Electron pencere, tepsi, Windows oturum başlatma ve IPC
preload.cjs                  Kısıtlı masaüstü API köprüsü
ui/index.html                Tahta, öğretmen SVG, ayarlar ve alıştırmalar
ui/styles.css,ui/studio.css  Widget ölçüleri ve temalar
ui/app.js                    Ders akışı, form, telaffuz ve pencere geçişleri
ui/speech.js                 Dil uyumlu ses seçimi / yanlış aksan engeli
ui/rhythm.js,ui/audio.js     Tek zamanlayıcı ve hafif bildirim sesleri
ui/engine.js,ui/lessons.js   7 dilde temel içerik ve tekrar planı
ui/tutor.js,ui/tutor-ui.js   Aktif hatırlama ve ipuçları
ui/ollama-bridge.cjs         İsteğe bağlı yerel model erişimi
tests/                       Birim, güvenlik, Electron ve gerçek ekran görüntüsü testleri
.github/workflows/           Windows CI + otomatik README ekran görüntüleri
```

```powershell
npm run check             # Sözdizimi + tüm birim testleri
npm run test:widget       # Gerçek Electron’da küçük/geniş pencere ve gizleme
npm run test:desktop      # Ayrıntılı ders/ritim regresyonu
npm run test:screenshots  # Windows'tan dört gerçek PNG üret
```

Ekran görüntüleri `tests/screenshots.cjs` tarafından Windows üzerinde üretilir ve yalnızca ilgili GitHub Actions işi başarılıysa repoya eklenir. Her ekran görüntüsü görünür widget penceresinden alınır. Kaynak görseller değiştirilmiş taslaklar değildir.

**Test notu:** [0.3.0 doğrulama raporu](docs/VALIDATION.md) önceki sürüme aittir; oradaki CPU/RAM gözlemleri yeni küçük widget'ın bağımsız performans ölçümü değildir. CI sonucu için güncel [Actions](https://github.com/snansrin/ChalkLingo/actions) sayfasını esas al.

## Araştırma dayanağı ve sınırlar

Öğretim akışı, aralıklı tekrar, geri çağırma ve düzeltici geribildirim araştırmalarından esinlenmiştir. ChalkLingo’nun öğrenme başarısına dair bağımsız bilimsel doğrulama yapılmamıştır. 212 örnek kart tam A1–C2 kursu değildir; cevap eşleştirme deterministik olduğu için anlamdaş doğru cevapları bazen kabul etmeyebilir.

- [Belardi et al., 2021 — Spacing, feedback, and testing](https://pubmed.ncbi.nlm.nih.gov/34867656/)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Ollama API](https://docs.ollama.com/api)

MIT lisanslı açık kaynak.
