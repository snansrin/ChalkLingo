# Pofinyo 2.3.1 · Örnek sesi ve telaffuz dili

Kullanıcı, Örneği dinle düğmesinde İngilizce örneğin Türkçe okunmasını bildirdi. Kaynak metin `Hello, I am Ada.` idi; Türkçe çeviri `merhaba` ses motoruna gönderilmiyordu. Sorun ses seçimiydi: kullanıcının Windows SAPI listesinde Microsoft Zira Desktop (en-US) ve Microsoft Tolga (tr-TR) bulunurken Electron Web Speech yalnız Tolga'yı bildiriyordu. Önceki uygulama yalnız `utter.lang` atıyor, sesi açıkça seçmiyordu.

## Çözüm

1. Paketteki 49 İngilizce başlangıç kaydı uygun kartlarda kullanılmaya devam eder; bu kayıtlar Microsoft Zira ile üretilmiştir.
2. Diğer metinlerde Web Speech listesi hazır değilse `voiceschanged` olayı kısa süre beklenir. Yalnız hedef dili eşleşen yerel ses açıkça seçilir; farklı dildeki varsayılan sese düşülmez. Hız/pitch normal değerdedir.
3. Electron hedef sesi göremiyorsa küçük yerel Windows yardımcısı kurulu `System.Speech` seslerini sorgular. Aynı dili bulur, sesi adıyla seçer ve ürettiği sesin dilini tekrar kontrol eder. Sadece metin okuma yapılır; SSML, komut veya ağ servisi çalıştırılmaz.
4. İngilizce örnekte hedef en-US'dir. Cihazdaki gerçek doğrulamada Microsoft Zira Desktop (en-US) ile WAV üretildi ve gerçek örnek düğmesi bu sese yöneldi.
5. Uygun ses yoksa kullanıcıya bilgi verilir; Türkçe veya başka dil sesiyle devam edilmez. Sesin doğallığı cihazda kurulu sese bağlıdır; bu değişiklik neural ses modeli eklemez.

## Kompakt çalışma ve yetkiler

Yardımcının kaynak kodu `native/SpeechWorker.cs`, derleme betiği `scripts/build-speech.cjs` içindedir. Windows .NET Framework konuşma kütüphaneleri kullanılır; ek ses modeli indirilmez veya sistem ses ayarları değiştirilmez. Derlenmiş yardımcı yaklaşık 9 KiB'dir. `npm start`, `test:speech` ve Windows paketlemesi gereken derlemeyi yapar.

Yardımcı yalnız istek sırasında, gizli pencereyle başlar ve WAV üretiminden sonra çıkar. Metin JSON ile stdin üzerinden gider; metin shell komutuna veya komut satırına eklenmez. İstek uzunluğu 500 karakter, dil listesi yedi öğrenme diliyle sınırlıdır. Tek aktif yardımcı, 10 saniye zaman aşımı ve en fazla 2 MiB / 16 kayıtlık bellek önbelleği vardır. Sesler diskte biriktirilmez. Renderer yalnız yetkili kendi ana çerçevesinden konuşma isteği gönderebilir.

Yeni örneğe geçmek, pencereyi gizlemek veya uygulamadan çıkmak eski sesi/üretimi iptal eder. Geç kalan eski istek oynatılmaz. Blob ses adresleri bitişte/iptalde bırakılır. Kullanıcının ekranı, mikrofonu veya genel klavyesi okunmaz.

## Doğrulama

- Dil eşleme: Türkçe varsayılan, İngilizce yerel ses, yalnız Türkçe ses, uzak ses ve gecikmeli ses listesi.
- Yerel yardımcı: gerçek en-US ses seçimi, RIFF/WAVE çıktısı, yanlış dil ve sınır dışı isteklerin reddi.
- Gerçek Electron düğmesi: Türkçe-only Web Speech durumu altında İngilizce örnek metnin değişmeden Windows İngilizce sesine ulaşması.
- İptal: geç tamamlanan sesin çalınmaması.
- CI sunucusunda yerel İngilizce ses bulunmazsa gerçek SAPI ses üretimi açıkça atlanır; dil/iptal birim testleri zorunludur. Kullanıcının bilgisayarında gerçek ses testi atlanmadan geçirilir.

Kaynaklar: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices ve https://learn.microsoft.com/en-us/dotnet/api/system.speech.synthesis.speechsynthesizer?view=netframework-4.8
