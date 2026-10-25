/* Offline starter curriculum: illustrative CEFR placements, not certified. */
(function(root){
'use strict';
const LEVELS=['A1','A2','B1','B2','C1','C2'];
const LANGS={en:['İngilizce','en-US'],de:['Almanca','de-DE'],fr:['Fransızca','fr-FR'],es:['İspanyolca','es-ES'],it:['İtalyanca','it-IT'],ru:['Rusça','ru-RU'],ja:['Japonca','ja-JP']};
/* Words: 12 everyday A1 entries followed by A2/B1/B2/C1/C2.
   Sentence and grammar entries: one for each level in sequence. */
const packs={
en:{
w:[
'hello|merhaba|Hello! Nice to meet you.','thank you|teşekkür ederim|Thank you for your help.','please|lütfen|Please, come in.','water|su|Can I have some water?','book|kitap|This is my book.','friend|arkadaş|She is my friend.','home|ev|I am going home.','today|bugün|Today is Monday.','tomorrow|yarın|See you tomorrow.','family|aile|My family is here.','food|yemek|The food is delicious.','school|okul|I go to school.',
'appointment|randevu|I have an appointment tomorrow.','improve|geliştirmek|Practice will improve your English.','sustainable|sürdürülebilir|We need sustainable solutions.','scrutinize|titizlikle incelemek|We must scrutinize the data.','ubiquitous|her yerde bulunan|Smartphones are ubiquitous.',
'good morning|günaydın|Good morning, everyone.','good night|iyi geceler|Good night, see you tomorrow.','yes|evet|Yes, I understand.','no|hayır|No, thank you.','help|yardım|I need help.','coffee|kahve|I drink coffee.','city|şehir|This city is beautiful.','happy|mutlu|I am happy.','beautiful|güzel|It is a beautiful day.'
],
s:[
'How are you?|Nasılsın?|I am fine, thank you.','Could you help me?|Bana yardım edebilir misiniz?|A polite request.','I have been learning English for a year.|Bir yıldır İngilizce öğreniyorum.|For: süre; since: başlangıç.','If I had more time, I would travel.|Daha çok zamanım olsa seyahat ederdim.|Second conditional.','Had I known, I would have called.|Bilseydim arardım.|Inverted third conditional.','Rarely have I encountered such clarity.|Böylesine bir açıklıkla nadiren karşılaştım.|Negative-adverb inversion.'
],
g:[
'am / is / are|Olmak fiili; özneye göre değişir.|She is a teacher.','Past simple|Geçmişte tamamlanmış olaylar.|I visited London yesterday.','Present perfect|Geçmişin şimdiyle bağlantısı.|I have finished the task.','Passive voice|Eylemin alıcısını öne çıkarır.|The report was written.','Inversion|Vurgu için devrik cümle kurulur.|Never have I seen this.','Formal subjunctive|Resmî gerekliliklerde yalın fiil.|It is vital that he be present.'
]},
de:{
w:[
'hallo|merhaba|Hallo, wie geht es dir?','danke|teşekkürler|Danke für deine Hilfe.','bitte|lütfen; buyurun|Ein Wasser, bitte.','Wasser|su|Ich trinke Wasser.','Buch|kitap|Das Buch ist neu.','Freund|arkadaş|Er ist mein Freund.','Haus|ev|Das Haus ist groß.','heute|bugün|Heute ist Montag.','morgen|yarın|Bis morgen!','Familie|aile|Meine Familie ist hier.','Essen|yemek|Das Essen ist lecker.','Schule|okul|Die Schule beginnt um acht.',
'Termin|randevu|Ich habe einen Termin.','verbessern|geliştirmek|Ich möchte mein Deutsch verbessern.','nachhaltig|sürdürülebilir|Wir brauchen nachhaltige Lösungen.','differenziert|çok yönlü değerlendirilmiş|Das ist eine differenzierte Analyse.','nichtsdestotrotz|buna rağmen|Nichtsdestotrotz machen wir weiter.'
],
s:[
'Wie heißt du?|Adın ne?|Ich heiße Ayşe.','Könnten Sie mir helfen?|Bana yardımcı olabilir misiniz?|Kibar soru.','Ich lerne seit einem Jahr Deutsch.|Bir yıldır Almanca öğreniyorum.|Seit + zaman ifadesi.','Wenn ich Zeit hätte, würde ich reisen.|Zamanım olsa seyahat ederdim.|Konjunktiv II.','Hätte ich es gewusst, hätte ich angerufen.|Bilseydim arardım.|Devrik koşul.','Ungeachtet der Umstände blieb er gelassen.|Koşullara rağmen sakin kaldı.|Resmî üslup.'
],
g:[
'der / die / das|İsimlerin eril, dişil ve nötr tanımlıkları.|Der Tisch, die Lampe, das Buch.','Perfekt|Konuşma dilinde geçmiş zaman.|Ich habe gelernt.','Nebensätze|Yan cümlede çekimli fiil sonda.|Weil ich müde bin.','Konjunktiv II|Gerçek olmayan koşul ve kibar istek.|Ich würde gern kommen.','Nominalstil|Resmî metinlerde isimleştirme.|Nach Abschluss der Prüfung.','Partizipialattribute|Sıfat-fiil grupları.|Die gestern veröffentlichten Daten.'
]},
fr:{
w:[
'bonjour|merhaba; günaydın|Bonjour, madame.','merci|teşekkürler|Merci beaucoup.','s’il vous plaît|lütfen|Un café, s’il vous plaît.','eau|su|Je bois de l’eau.','livre|kitap|C’est mon livre.','ami|arkadaş|C’est mon ami.','maison|ev|La maison est grande.','aujourd’hui|bugün|Aujourd’hui, il fait beau.','demain|yarın|À demain !','famille|aile|Ma famille est ici.','nourriture|yiyecek|La nourriture est bonne.','école|okul|Je vais à l’école.',
'rendez-vous|randevu|J’ai un rendez-vous.','améliorer|iyileştirmek|Je veux améliorer mon français.','durable|sürdürülebilir|Un développement durable.','approfondir|derinlemesine incelemek|Nous devons approfondir le sujet.','néanmoins|bununla birlikte|Néanmoins, elle a réussi.'
],
s:[
'Comment ça va ?|Nasılsın?|Ça va bien, merci.','Pourriez-vous m’aider ?|Bana yardım edebilir misiniz?|Kibar rica.','J’apprends le français depuis un an.|Bir yıldır Fransızca öğreniyorum.|Depuis: geçmişten beri.','Si j’avais le temps, je voyagerais.|Zamanım olsa seyahat ederdim.|Si + imparfait, conditionnel.','Bien qu’il soit fatigué, il continue.|Yorgun olmasına rağmen devam ediyor.|Bien que + subjonctif.','Encore eût-il fallu le démontrer.|Yine de bunu kanıtlamak gerekirdi.|Edebî ve resmî kullanım.'
],
g:[
'être|Olmak fiili; je suis, tu es, il est.|Je suis étudiant.','Passé composé|Tamamlanmış geçmiş eylem.|J’ai parlé.','Depuis|Geçmişte başlayıp süren eylem.|Je travaille ici depuis deux ans.','Conditionnel|Varsayım veya kibar istek.|Je voudrais partir.','Subjonctif|Duygu, şüphe ve gereklilik.|Il faut que tu viennes.','Passé simple|Edebî anlatımda geçmiş zaman.|Il entra et s’assit.'
]},
es:{
w:[
'hola|merhaba|Hola, ¿cómo estás?','gracias|teşekkürler|Muchas gracias.','por favor|lütfen|Ayúdame, por favor.','agua|su|Quiero agua.','libro|kitap|Este libro es nuevo.','amigo|arkadaş|Él es mi amigo.','casa|ev|Estoy en casa.','hoy|bugün|Hoy hace sol.','mañana|yarın|Hasta mañana.','familia|aile|Mi familia es grande.','comida|yemek|La comida está rica.','escuela|okul|Voy a la escuela.',
'cita|randevu|Tengo una cita mañana.','mejorar|geliştirmek|Quiero mejorar mi español.','sostenible|sürdürülebilir|Es una solución sostenible.','matizar|ayrıntılandırmak|Debemos matizar el argumento.','sin embargo|bununla birlikte|Sin embargo, continuamos.'
],
s:[
'¿Cómo te llamas?|Adın ne?|Me llamo Deniz.','¿Podría ayudarme?|Bana yardım edebilir misiniz?|Kibar rica.','Llevo un año aprendiendo español.|Bir yıldır İspanyolca öğreniyorum.|Llevar + süre + gerundio.','Si tuviera tiempo, viajaría.|Zamanım olsa seyahat ederdim.|Si + imperfecto de subjuntivo.','Aunque sea difícil, lo intentaré.|Zor olsa da deneyeceğim.|Aunque + subjuntivo.','Por más que insistiera, no cedieron.|Ne kadar ısrar etse de boyun eğmediler.|İleri düzey karşıtlık.'
],
g:[
'ser / estar|Kalıcı nitelik ve durum farklılığı.|Soy estudiante. Estoy cansado.','Pretérito perfecto|Şimdiyle ilgili geçmiş olay.|He terminado.','Pretérito imperfecto|Geçmişte alışkanlık veya süreç.|Cuando era niño, jugaba.','Condicional|Varsayımsal ve kibar ifadeler.|Me gustaría viajar.','Subjuntivo|Dilek, gereklilik ve belirsizlik.|Espero que vengas.','Oraciones concesivas|Gelişmiş karşıtlık yapıları.|Por mucho que estudie...'
]},
it:{
w:[
'ciao|merhaba; hoşça kal|Ciao, come stai?','grazie|teşekkürler|Grazie mille.','per favore|lütfen|Aiutami, per favore.','acqua|su|Bevo acqua.','libro|kitap|Questo libro è nuovo.','amico|arkadaş|Lui è mio amico.','casa|ev|Sono a casa.','oggi|bugün|Oggi è lunedì.','domani|yarın|A domani!','famiglia|aile|La mia famiglia è qui.','cibo|yiyecek|Il cibo è buono.','scuola|okul|Vado a scuola.',
'appuntamento|randevu|Ho un appuntamento.','migliorare|iyileştirmek|Vorrei migliorare il mio italiano.','sostenibile|sürdürülebilir|Una scelta sostenibile.','approfondire|derinlemesine incelemek|Vorrei approfondire la questione.','ciononostante|buna rağmen|Ciononostante, abbiamo continuato.'
],
s:[
'Come ti chiami?|Adın ne?|Mi chiamo Ada.','Potrebbe aiutarmi?|Bana yardım edebilir misiniz?|Kibar rica.','Studio italiano da un anno.|Bir yıldır İtalyanca öğreniyorum.|Da + süre.','Se avessi tempo, viaggerei.|Zamanım olsa seyahat ederdim.|Se + congiuntivo imperfetto.','Benché sia difficile, ci proverò.|Zor olmasına rağmen deneyeceğim.|Benché + congiuntivo.','Qualora fosse necessario, interverremmo.|Gerekirse müdahale ederdik.|Resmî koşul yapısı.'
],
g:[
'essere|Olmak fiili; sono, sei, è.|Sono a casa.','Passato prossimo|Tamamlanmış geçmiş olay.|Ho studiato.','Imperfetto|Geçmişte alışkanlık veya arka plan.|Da piccolo giocavo.','Condizionale|Kibar istek ve varsayım.|Vorrei un caffè.','Congiuntivo|Şüphe ve duygu ifadesi.|Penso che sia giusto.','Periodo ipotetico|Karmaşık varsayımsal koşul.|Se l’avessi saputo...'
]},
ru:{
w:[
'привет|merhaba|Привет, как дела?','спасибо|teşekkürler|Большое спасибо.','пожалуйста|lütfen; buyurun|Помогите, пожалуйста.','вода|su|Я пью воду.','книга|kitap|Это моя книга.','друг|arkadaş|Он мой друг.','дом|ev|Я дома.','сегодня|bugün|Сегодня понедельник.','завтра|yarın|До завтра!','семья|aile|Моя семья здесь.','еда|yemek|Еда вкусная.','школа|okul|Я иду в школу.',
'встреча|buluşma|У меня важная встреча.','улучшать|iyileştirmek|Я хочу улучшать свой русский.','устойчивый|sürdürülebilir; dayanıklı|Нужно устойчивое развитие.','осмыслить|derinlemesine kavramak|Нужно осмыслить результаты.','тем не менее|bununla birlikte|Тем не менее мы продолжили.'
],
s:[
'Как тебя зовут?|Adın ne?|Меня зовут Дениз.','Не могли бы вы мне помочь?|Bana yardım edebilir misiniz?|Kibar rica.','Я учу русский язык уже год.|Bir yıldır Rusça öğreniyorum.|Уже + süre.','Если бы у меня было время, я бы путешествовал.|Zamanım olsa seyahat ederdim.|Если бы + бы.','Несмотря на трудности, мы продолжили.|Zorluklara rağmen devam ettik.|Несмотря на + винительный.','Как бы то ни было, решение принято.|Her hâlükârda karar verildi.|İleri düzey söylem.'
],
g:[
'Род|İsimler eril, dişil ve nötr olabilir.|Дом, книга, окно.','Прошедшее время|Geçmiş zaman ekleri cinsiyetle değişir.|Она читала книгу.','Падежи|Hâl ekleri cümledeki görevi belirtir.|Я читаю книгу.','Вид глагола|Bitmiş ve sürmekte olan eylem ayrımı.|Я читал / Я прочитал.','Причастия|Ortaçlar isimleri niteler.|Человек, читающий книгу.','Деепричастие|Zarf-fiil yapısı.|Прочитав письмо, он ушёл.'
]},
ja:{
w:[
'こんにちは|merhaba|こんにちは、元気ですか。','ありがとう|teşekkürler|ありがとうございます。','お願いします|lütfen|よろしくお願いします。','水|su|水を飲みます。','本|kitap|これは私の本です。','友達|arkadaş|彼は私の友達です。','家|ev|家に帰ります。','今日|bugün|今日は月曜日です。','明日|yarın|また明日。','家族|aile|家族は元気です。','食べ物|yiyecek|この食べ物はおいしいです。','学校|okul|学校に行きます。',
'約束|söz; randevu|友達と約束があります。','改善する|iyileştirmek|方法を改善します。','持続可能|sürdürülebilir|持続可能な社会。','精査する|titizlikle incelemek|資料を精査します。','にもかかわらず|buna rağmen|雨にもかかわらず出発した。'
],
s:[
'お名前は何ですか。|Adınız nedir?|私は田中です。','手伝っていただけますか。|Bana yardım edebilir misiniz?|Kibar rica.','日本語を一年間勉強しています。|Bir yıldır Japonca öğreniyorum.|～ています: sürmekte olan eylem.','時間があれば、旅行したいです。|Zamanım olsa seyahat etmek isterdim.|～ば: koşul.','難しいものの、試してみます。|Zor olmakla birlikte deneyeceğim.|～ものの: karşıtlık.','検討の余地がないわけではない。|Değerlendirme olanağı tümden yok değil.|Çifte olumsuzluk.'
],
g:[
'です / ます|Kibar cümle sonları.|私は学生です。','て形|Fiilleri bağlama ve rica oluşturma.|待ってください。','～たことがある|Deneyim bildirme.|日本へ行ったことがあります。','～ば / ～たら|Koşul yapıları.|時間があれば、行きます。','～わけではない|Tamamen öyle değil ifadesi.|嫌いなわけではない。','～に至るまで|Kapsamın son sınırını belirtir.|細部に至るまで確認する。'
]}
};
const cards=[];
for(const [lang,pack] of Object.entries(packs)){
  const voice=LANGS[lang][1];
  for(let i=0;i<pack.w.length;i++){
    const [front,answer,example]=pack.w[i].split('|');
    const level=i<12?'A1':i<17?LEVELS[i-11]:'A1';
    cards.push({id:lang+':v:'+i,lang,level,kind:'vocab',front,answer,example:example||'',note:'Örnek cümleyi sesli tekrarla.',voice});
  }
  for(const [kind,items] of [['sentence',pack.s],['grammar',pack.g]]){
    items.forEach((row,i)=>{
      const [front,answer,example]=row.split('|');
      cards.push({id:lang+':'+kind+':'+i,lang,level:LEVELS[i],kind,front,answer,example:example||'',note:kind==='grammar'?'Yapıyı örnekte incele.':'Cümleyi tekrar et.',voice});
    });
  }
}
const data=Object.freeze({cards,LANGS,LEVELS});
root.ChalkData=data;
if(typeof module!=='undefined'&&module.exports)module.exports=data;
})(typeof globalThis!=='undefined'?globalThis:this);