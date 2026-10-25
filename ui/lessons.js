/* ChalkLingo hand-curated starter lessons. CEFR bands are indicative, not certified. */
(function(global){
'use strict';
// Each row: [level, front, meaning in Turkish, example, teaching note, phonetic(optional)]
const packs={
 en:{name:'İngilizce',voice:'en-US',
 vocab:[
 ['A1','hello','merhaba','Hello, my name is Ada.','Selamlaşmak için kullanılır.','/həˈloʊ/'],
 ['A1','thank you','teşekkür ederim','Thank you for your help.','Kibarca teşekkür et.','/ˈθæŋk juː/'],
 ['A1','water','su','Can I have some water?','Sayılamayan isimdir.','/ˈwɔːtər/'],
 ['A1','book','kitap','This is my book.','Book: sayılabilen isim.','/bʊk/'],
 ['A1','friend','arkadaş','She is my friend.','My, iyelik sıfatıdır.','/frɛnd/'],
 ['A1','today','bugün','I am happy today.','Zaman zarfı olarak kullanılır.','/təˈdeɪ/'],
 ['A1','please','lütfen','Please sit down.','Ricaları yumuşatır.','/pliːz/'],
 ['A1','home','ev; yuva','I am going home.','Go home ifadesinde to kullanılmaz.','/hoʊm/'],
 ['A2','appointment','randevu','I have an appointment at three.','Make an appointment: randevu almak.'],
 ['A2','usually','genellikle','I usually walk to work.','Sıklık zarfları çoğunlukla ana fiilden önce gelir.'],
 ['B1','improve','geliştirmek; iyileştirmek','Practice will improve your speaking.','Improve a skill: bir beceriyi geliştirmek.'],
 ['B1','reliable','güvenilir','We need a reliable source.','Reliability: güvenilirlik.'],
 ['B2','sustainable','sürdürülebilir','We need sustainable solutions.','Sustainability: sürdürülebilirlik.'],
 ['B2','although','-e rağmen; her ne kadar','Although it rained, we went out.','Ardından yan cümle gelir.'],
 ['C1','nevertheless','bununla birlikte; yine de','It was difficult; nevertheless, we succeeded.','Karşıtlık belirten bağlaç zarfı.'],
 ['C1','scrutinize','titizlikle incelemek','The team scrutinized the data.','Scrutiny: dikkatli inceleme.'],
 ['C2','notwithstanding','-e rağmen','Notwithstanding the risks, we proceeded.','Resmî ve ileri düzey dilde kullanılır.'],
 ['C2','ubiquitous','her yerde bulunan','Smartphones are ubiquitous today.','Yaygın ve her yerde görülen anlamında.']
 ],
 sentence:[
 ['A1','How are you?','Nasılsın?','I am fine, thank you.','How + be + özne soru kalıbı.'],
 ['A1','What is your name?','Adın ne?','My name is Deniz.','What soru sözcüğüdür.'],
 ['A2','Could you help me?','Bana yardım edebilir misiniz?','Could you help me find the station?','Could you, kibar rica oluşturur.'],
 ['B1','I have been learning English for a year.','Bir yıldır İngilizce öğreniyorum.','I have been studying since January.','For süreyi, since başlangıç noktasını verir.'],
 ['B2','If I had more time, I would travel.','Daha çok zamanım olsa seyahat ederdim.','If I were you, I would ask.','Second conditional: varsayımsal durum.'],
 ['C1','Had I known, I would have called.','Bilseydim arardım.','Had I seen it, I would have told you.','Üçüncü koşulda devrik yapı.'],
 ['C2','Rarely have I encountered such clarity.','Böylesine bir açıklıkla nadiren karşılaştım.','Seldom had they witnessed such precision.','Olumsuz sınırlayıcı zarflardan sonra devriklik.']
 ],
 grammar:[
 ['A1','I am / You are / He is','“Be” fiilinin şimdiki zaman biçimleri.','She is a teacher.','Özneye göre am / is / are seç.'],
 ['A1','a / an','Belirsiz tanımlık; sessiz veya sesli sesle başlayan sözcükler.','An apple · A university','Harfe değil, kelimenin ilk sesine bak.'],
 ['A2','Past simple','Geçmişte tamamlanan eylemler.','I visited London yesterday.','Düzenli fiillere -ed; düzensizlerde ayrı biçim.'],
 ['B1','Present perfect','Geçmişin şimdiyle bağlantısını anlatır.','I have finished my homework.','Have / has + fiilin üçüncü hâli.'],
 ['B2','Passive voice','Edilgen yapı; eylemin alıcısını öne çıkarır.','The report was written yesterday.','Be + V3; zamanı be fiili gösterir.'],
 ['C1','Inversion','Vurgu için özne-yardımcı fiil sırasını değiştirmek.','Never have I seen this before.','Never, rarely gibi sözlerle sık görülür.'],
 ['C2','Subjunctive in formal demands','Resmî istek sonrası yalın fiil kullanımı.','It is essential that he be present.','He be, resmî subjunctive örneğidir.']
 ]},
 de:{name:'Almanca',voice:'de-DE',
 vocab:[
 ['A1','Hallo','merhaba','Hallo, wie geht es dir?','Günlük selamlaşma.'],
 ['A1','Danke','teşekkürler','Danke für deine Hilfe.','Danke schön: çok teşekkürler.'],
 ['A1','das Wasser','su','Ich trinke Wasser.','Wasser nötr artikellidir.'],
 ['A1','das Buch','kitap','Das Buch ist neu.','Çoğul: die Bücher.'],
 ['A1','der Freund','erkek arkadaş / dost','Er ist mein Freund.','Kadın biçimi: die Freundin.'],
 ['A1','heute','bugün','Heute lerne ich Deutsch.','Zaman zarfı.'],
 ['A1','bitte','lütfen; rica ederim','Ein Wasser, bitte.','Ricada ve yanıtta kullanılır.'],
 ['A2','der Termin','randevu','Ich habe morgen einen Termin.','Haben fiiliyle Akkusativ alır.'],
 ['A2','normalerweise','genellikle','Normalerweise stehe ich früh auf.','Cümle başında fiil ikinci sıradadır.'],
 ['B1','verbessern','iyileştirmek','Ich möchte mein Deutsch verbessern.','Dönüşlü biçimi de vardır: sich verbessern.'],
 ['B1','zuverlässig','güvenilir','Sie ist sehr zuverlässig.','Sıfat olarak kullanılır.'],
 ['B2','die Nachhaltigkeit','sürdürülebilirlik','Nachhaltigkeit ist uns wichtig.','Sıfat: nachhaltig.'],
 ['B2','obwohl','-mesine rağmen','Obwohl es regnet, gehen wir raus.','Yan cümlede çekimli fiil sona gider.'],
 ['C1','gleichwohl','yine de; buna rağmen','Das ist schwierig, gleichwohl möglich.','Resmî bağlaç zarfı.'],
 ['C1','die Voraussetzung','ön koşul','Erfahrung ist eine Voraussetzung.','Çoğul: Voraussetzungen.'],
 ['C2','ungeachtet','-e aldırmaksızın','Ungeachtet der Kritik blieb er ruhig.','Genellikle Genitiv ile kullanılır.'],
 ['C2','die Unwägbarkeit','öngörülemeyen güçlük','Wir müssen Unwägbarkeiten beachten.','İleri düzey resmî anlatım.']
 ],
 sentence:[
 ['A1','Wie heißt du?','Adın ne?','Ich heiße Ece.','Heißen: adı ... olmak.'],
 ['A1','Wie geht es dir?','Nasılsın?','Mir geht es gut.','Dir: samimi hitap.'],
 ['A2','Könnten Sie mir helfen?','Bana yardımcı olabilir misiniz?','Könnten Sie das wiederholen?','Sie resmî hitaptır.'],
 ['B1','Ich lerne seit einem Jahr Deutsch.','Bir yıldır Almanca öğreniyorum.','Ich wohne seit 2025 hier.','Seit + Dativ ile süren durum.'],
 ['B2','Wenn ich Zeit hätte, würde ich reisen.','Vaktim olsa seyahat ederdim.','Wenn ich reich wäre, würde ich helfen.','Konjunktiv II ile varsayım.'],
 ['C1','Hätte ich es gewusst, hätte ich angerufen.','Bilseydim arardım.','Wäre ich früher gekommen, wäre das anders.','Gerçekleşmemiş geçmiş varsayımı.'],
 ['C2','Wenngleich dies zutrifft, bleibt die Frage offen.','Bu doğru olsa da soru hâlâ açık.','Wenngleich es schwierig ist, ist es möglich.','Wenngleich: yazı diline özgü ödünleme.']
 ],
 grammar:[
 ['A1','der / die / das','Almancada üç dil bilgisel cinsiyet bulunur.','der Tisch · die Lampe · das Haus','İsimleri artikeliyle öğren.'],
 ['A2','Perfekt','Konuşma dilinde geçmiş zaman.','Ich habe heute gearbeitet.','Haben / sein + Partizip II.'],
 ['B1','Nebensätze mit weil','Weil yan cümlesinde fiil sonda olur.','Ich bleibe, weil ich müde bin.','Weil = çünkü.'],
 ['B2','Konjunktiv II','Dilek, varsayım ve nezaket.','Ich würde das anders machen.','Würde + Infinitiv sık kullanılır.'],
 ['C1','Partizipialattribute','Ortaçla kurulan yoğun sıfat yapıları.','die gestern veröffentlichten Daten','Uzun sıfat öbekleri çekimlenir.'],
 ['C2','Nominalstil','Resmî metinlerde adlaştırılmış anlatım.','Nach Abschluss der Untersuchung …','Akademik yazıda sıktır.']
 ]},
 fr:{name:'Fransızca',voice:'fr-FR',
 vocab:[
 ['A1','bonjour','merhaba / iyi günler','Bonjour, comment ça va ?','Gündüz selamlaşması.'],
 ['A1','merci','teşekkürler','Merci beaucoup !','Merci beaucoup: çok teşekkürler.'],
 ['A1','l’eau','su','Je bois de l’eau.','Dişil isim: une eau; kullanım bağlama bağlıdır.'],
 ['A1','le livre','kitap','Le livre est sur la table.','Eril isim.'],
 ['A1','un ami / une amie','arkadaş','C’est mon ami.','Cinsiyete göre biçim değişir.'],
 ['A1','aujourd’hui','bugün','Aujourd’hui, je travaille.','Zaman zarfıdır.'],
 ['A1','s’il vous plaît','lütfen','Un café, s’il vous plaît.','Kibar / resmî rica.'],
 ['A2','le rendez-vous','randevu','J’ai un rendez-vous demain.','Prendre rendez-vous: randevu almak.'],
 ['A2','d’habitude','genellikle','D’habitude, je lis le soir.','Sıklık bildirir.'],
 ['B1','améliorer','iyileştirmek','Je veux améliorer mon français.','S’améliorer: gelişmek.'],
 ['B1','fiable','güvenilir','Cette source est fiable.','Fiabilité: güvenilirlik.'],
 ['B2','durable','sürdürülebilir; dayanıklı','Nous cherchons une solution durable.','Développement durable: sürdürülebilir kalkınma.'],
 ['B2','bien que','-mesine rağmen','Bien qu’il pleuve, nous sortons.','Çoğunlukla subjonctif kullanılır.'],
 ['C1','néanmoins','yine de; bununla birlikte','Il pleut ; néanmoins, nous partons.','Karşıtlık bağlacı.'],
 ['C1','la pertinence','uygunluk; ilgililik','La pertinence de cette étude est claire.','Akademik kullanıma uygundur.'],
 ['C2','nonobstant','-e rağmen','Nonobstant les obstacles, elle a réussi.','Resmî / hukuk dilinde sık.'],
 ['C2','l’ineffabilité','söze dökülemezlik','L’ineffabilité du sentiment le frappe.','Soyut, edebî sözcük.']
 ],
 sentence:[
 ['A1','Comment tu t’appelles ?','Adın ne?','Je m’appelle Deniz.','Samimi hitap.'],
 ['A1','Comment allez-vous ?','Nasılsınız?','Je vais bien, merci.','Kibar hitap.'],
 ['A2','Pourriez-vous m’aider ?','Bana yardımcı olabilir misiniz?','Pourriez-vous répéter ?','Conditionnel ile kibar rica.'],
 ['B1','J’apprends le français depuis un an.','Bir yıldır Fransızca öğreniyorum.','J’habite ici depuis deux ans.','Depuis devam eden süreye işaret eder.'],
 ['B2','Si j’avais le temps, je voyagerais.','Zamanım olsa seyahat ederdim.','Si j’étais libre, je viendrais.','Si + imparfait, conditionnel présent.'],
 ['C1','Si je l’avais su, je vous aurais appelé.','Bilseydim sizi arardım.','Si j’avais pu, je serais venu.','Geçmişte gerçekleşmemiş koşul.'],
 ['C2','Aussi convaincante soit-elle, la thèse reste discutable.','Ne kadar ikna edici olsa da sav tartışmaya açıktır.','Aussi utile soit-il, cet outil a des limites.','Ödünleme anlamı veren gelişmiş diziliş.']
 ],
 grammar:[
 ['A1','être / avoir','Olmak / sahip olmak yardımcı fiilleri.','Je suis étudiant. · J’ai un livre.','Çok sık kullanılırlar.'],
 ['A2','Passé composé','Tamamlanmış geçmiş eylemler.','J’ai visité Paris.','Avoir / être + participe passé.'],
 ['B1','Imparfait','Geçmişte alışkanlık ya da arka plan.','Quand j’étais petit, je lisais.','Passé composé ile karşılaştır.'],
 ['B2','Subjonctif','İstek, gereklilik, duygu gibi bağlamlar.','Il faut que tu viennes.','Que sonrası belirli yapılarda kullanılır.'],
 ['C1','Pronoms relatifs composés','Birleşik ilgi zamirleri.','le sujet auquel je pense','À + lequel → auquel.'],
 ['C2','Concordance des temps','Yan cümlelerde zaman uyumu.','Il disait qu’il viendrait.','Dolaylı anlatımda zaman kayması.']
 ]},
 es:{name:'İspanyolca',voice:'es-ES',
 vocab:[
 ['A1','hola','merhaba','Hola, ¿cómo estás?','Günlük selamlaşma.'],
 ['A1','gracias','teşekkürler','Muchas gracias.','Muchas gracias: çok teşekkürler.'],
 ['A1','el agua','su','Quiero agua, por favor.','Dişil isimdir; tekilde vurgu nedeniyle el kullanılır.'],
 ['A1','el libro','kitap','Este libro es nuevo.','Eril isim.'],
 ['A1','el amigo / la amiga','arkadaş','Mi amiga es médica.','İsmin cinsiyet biçimleri.'],
 ['A1','hoy','bugün','Hoy estudio español.','Zaman zarfı.'],
 ['A1','por favor','lütfen','Ayúdame, por favor.','Kibar ricada kullanılır.'],
 ['A2','la cita','randevu','Tengo una cita mañana.','Tener una cita: randevusu olmak.'],
 ['A2','normalmente','genellikle','Normalmente desayuno temprano.','Sıklık zarfı.'],
 ['B1','mejorar','iyileştirmek','Quiero mejorar mi español.','Mejorarse dönüşlü biçimdir.'],
 ['B1','fiable','güvenilir','Es una fuente fiable.','Sıfat eril-dişil aynı biçimde.'],
 ['B2','sostenible','sürdürülebilir','Buscamos soluciones sostenibles.','Desarrollo sostenible ifadesinde geçer.'],
 ['B2','aunque','-e rağmen','Aunque llueva, saldremos.','Gerçekleşme belirsizse subjuntivo.'],
 ['C1','sin embargo','ancak; bununla birlikte','Era difícil; sin embargo, lo logramos.','Karşıtlık bildirir.'],
 ['C1','el matiz','ince anlam farkı','Hay un matiz importante.','Çoğul: los matices.'],
 ['C2','no obstante','buna karşın','No obstante, la propuesta prosperó.','Akademik bağlaç.'],
 ['C2','la inefabilidad','ifade edilemezlik','La inefabilidad de la emoción lo sorprendió.','Soyut/edebî sözcük.']
 ],
 sentence:[
 ['A1','¿Cómo te llamas?','Adın ne?','Me llamo Ece.','Dönüşlü llamarse fiili.'],
 ['A1','¿Cómo estás?','Nasılsın?','Estoy bien, gracias.','Estar durum bildirir.'],
 ['A2','¿Podrías ayudarme?','Bana yardım edebilir misin?','¿Podrías repetirlo?','Condicional ile nezaket.'],
 ['B1','Llevo un año aprendiendo español.','Bir yıldır İspanyolca öğreniyorum.','Llevo dos meses trabajando aquí.','Llevar + süre + gerundio.'],
 ['B2','Si tuviera tiempo, viajaría.','Vaktim olsa seyahat ederdim.','Si pudiera, iría contigo.','Si + imperfecto de subjuntivo, condicional.'],
 ['C1','Si lo hubiera sabido, te habría llamado.','Bilseydim seni arardım.','Si hubiese podido, habría ido.','Geçmiş gerçek dışı koşul.'],
 ['C2','Por mucho que insista, no cambiaré de opinión.','Ne kadar ısrar etse de fikrimi değiştirmeyeceğim.','Por más que lo intente, no podré.','Por mucho que + subjuntivo.']
 ],
 grammar:[
 ['A1','ser / estar','İkisi de “olmak”; işlevleri farklıdır.','Soy estudiante. · Estoy cansado.','Kimlik / özellik ve durum / konum ayrımı.'],
 ['A2','Pretérito indefinido','Bitmiş geçmiş olaylar.','Ayer compré un libro.','Tamamlanan olaylara odaklanır.'],
 ['B1','Pretérito imperfecto','Geçmiş alışkanlık / betimleme.','Cuando era niño, jugaba.','Indefinido ile karşılaştır.'],
 ['B2','Subjuntivo presente','İstek ve belirsizlik gibi bağlamlar.','Espero que vengas.','Que öncesi ifadeye dikkat.'],
 ['C1','Estilo indirecto','Dolaylı anlatım.','Dijo que vendría mañana.','Zaman uyumuna dikkat edilir.'],
 ['C2','Construcciones concesivas','Gelişmiş ödünleme yapıları.','Por más que llueva, iremos.','Bir karşıtlığa rağmen sonucu bildirir.']
 ]},
 it:{name:'İtalyanca',voice:'it-IT',
 vocab:[
 ['A1','ciao','merhaba; hoşça kal','Ciao, come stai?','Samimi hitapta kullanılır.'],
 ['A1','grazie','teşekkürler','Grazie mille!','Grazie mille: çok teşekkürler.'],
 ['A1','l’acqua','su','Vorrei dell’acqua.','Dişil isim.'],
 ['A1','il libro','kitap','Il libro è sul tavolo.','Çoğul: i libri.'],
 ['A1','l’amico / l’amica','arkadaş','La mia amica è qui.','Cinsiyet biçimleri değişir.'],
 ['A1','oggi','bugün','Oggi studio italiano.','Zaman zarfı.'],
 ['A1','per favore','lütfen','Un caffè, per favore.','Kibar rica.'],
 ['A2','l’appuntamento','randevu','Ho un appuntamento domani.','Fissare un appuntamento: randevulaşmak.'],
 ['A2','di solito','genellikle','Di solito mi sveglio presto.','Alışkanlık bildirir.'],
 ['B1','migliorare','geliştirmek','Voglio migliorare il mio italiano.','Miglioramento: iyileşme.'],
 ['B1','affidabile','güvenilir','È una fonte affidabile.','Sıfat.'],
 ['B2','sostenibile','sürdürülebilir','Cerchiamo una soluzione sostenibile.','Sostenibilità: sürdürülebilirlik.'],
 ['B2','sebbene','-e rağmen','Sebbene piova, usciamo.','Congiuntivo ile kullanılır.'],
 ['C1','tuttavia','bununla birlikte','È difficile; tuttavia, è possibile.','Karşıtlık bağlacı.'],
 ['C1','la premessa','öncül; başlangıç koşulu','Questa è una premessa importante.','Çoğul: premesse.'],
 ['C2','ciononostante','buna rağmen','Ciononostante, riuscimmo a finire.','Resmî bağlayıcı.'],
 ['C2','l’ineffabilità','söze dökülemezlik','L’ineffabilità del momento era evidente.','Edebî soyut sözcük.']
 ],
 sentence:[
 ['A1','Come ti chiami?','Adın ne?','Mi chiamo Deniz.','Chiamarsi: adı ... olmak.'],
 ['A1','Come stai?','Nasılsın?','Sto bene, grazie.','Samimi hitap.'],
 ['A2','Potresti aiutarmi?','Bana yardımcı olabilir misin?','Potresti ripetere?','Condizionale ile kibar rica.'],
 ['B1','Studio italiano da un anno.','Bir yıldır İtalyanca öğreniyorum.','Vivo qui da due anni.','Da, devam eden süreyi belirtir.'],
 ['B2','Se avessi tempo, viaggerei.','Zamanım olsa seyahat ederdim.','Se potessi, verrei.','Se + congiuntivo imperfetto, condizionale.'],
 ['C1','Se lo avessi saputo, ti avrei chiamato.','Bilseydim seni arardım.','Se fossi partito, sarei arrivato.','Geçmişte gerçekleşmeyen koşul.'],
 ['C2','Per quanto possa sembrare paradossale, è vero.','Ne kadar çelişkili görünse de doğru.','Per quanto ne sappia, è corretto.','Per quanto + congiuntivo.']
 ],
 grammar:[
 ['A1','essere / avere','Olmak / sahip olmak yardımcı fiilleri.','Sono felice. · Ho fame.','Essere ve avere çekimlerini öğren.'],
 ['A2','Passato prossimo','Bitmiş geçmiş eylemler.','Ho studiato ieri.','Avere / essere + participio passato.'],
 ['B1','Imperfetto','Geçmiş alışkanlık ve betimleme.','Da bambino, leggevo molto.','Passato prossimo ile karşılaştır.'],
 ['B2','Congiuntivo presente','Öznel yargı ve kuşku gibi bağlamlar.','Penso che sia utile.','Che ardından belirli fiillerle kullanılır.'],
 ['C1','Periodo ipotetico','Koşul cümlelerinin farklı tipleri.','Se avessi studiato, avrei passato l’esame.','Gerçek dışı geçmiş örneği.'],
 ['C2','Dislocazione a sinistra','Vurgu için ögenin cümle başına alınması.','Questo libro, l’ho già letto.','Nesne zamirle tekrar edilebilir.']
 ]},
 ru:{name:'Rusça',voice:'ru-RU',
 vocab:[
 ['A1','привет','selam','Привет! Как дела?','Samimi selamlaşma.','privyet'],
 ['A1','спасибо','teşekkürler','Спасибо за помощь!','Spasibo diye telaffuz edilir.','spasiba'],
 ['A1','вода','su','Мне нужна вода.','Dişil isim.','vada'],
 ['A1','книга','kitap','Это моя книга.','Dişil isim.','kniga'],
 ['A1','друг / подруга','erkek / kadın arkadaş','Это мой друг.','Cinsiyete göre biçim değişir.'],
 ['A1','сегодня','bugün','Сегодня я учусь.','Zaman zarfı.'],
 ['A1','пожалуйста','lütfen; rica ederim','Чай, пожалуйста.','Rica ve yanıtta kullanılabilir.'],
 ['A2','встреча','görüşme; buluşma','У меня завтра встреча.','Vstrecha: buluşma.'],
 ['A2','обычно','genellikle','Обычно я читаю вечером.','Sıklık zarfı.'],
 ['B1','улучшать','iyileştirmek','Я хочу улучшать свой русский.','Tamamlanmış görünüş: улучшить.'],
 ['B1','надёжный','güvenilir','Это надёжный источник.','Dişil: надёжная.'],
 ['B2','устойчивый','istikrarlı; sürdürülebilir bağlamında kullanılabilir','Нам нужно устойчивое развитие.','Устойчивое развитие: sürdürülebilir kalkınma.'],
 ['B2','хотя','-e rağmen','Хотя идёт дождь, мы гуляем.','Ödünleme bağlacı.'],
 ['C1','тем не менее','yine de','Это трудно, тем не менее возможно.','Karşıtlık bağlayıcısı.'],
 ['C1','предпосылка','ön koşul; öncül','Это важная предпосылка.','Sosyal bilimlerde sık.'],
 ['C2','невзирая на','-e rağmen','Невзирая на трудности, он продолжал.','Resmî bir ödünleme yapısı.'],
 ['C2','неотъемлемый','ayrılmaz; vazgeçilmez','Это неотъемлемая часть проекта.','Soyut metinlerde sık.']
 ],
 sentence:[
 ['A1','Как тебя зовут?','Adın ne?','Меня зовут Эдже.','Samimi hitap.','kak tibya zavut'],
 ['A1','Как дела?','Nasıl gidiyor?','Хорошо, спасибо!','Günlük kalıp.'],
 ['A2','Вы можете мне помочь?','Bana yardımcı olabilir misiniz?','Вы можете повторить?','Вы kibar / çoğul hitap.'],
 ['B1','Я учу русский уже год.','Bir yıldır Rusça öğreniyorum.','Я живу здесь уже два года.','Уже sürekliliği vurgular.'],
 ['B2','Если бы у меня было время, я бы путешествовал.','Zamanım olsa seyahat ederdim.','Если бы я знал, я бы помог.','Бы ile gerçek dışı koşul.'],
 ['C1','Если бы я знал, я бы позвонил.','Bilseydim arardım.','Если бы я видел это, я бы сказал.','Koşulun bağlamı geçmişi belirler.'],
 ['C2','Как бы то ни было, вывод остаётся прежним.','Her hâlükârda sonuç değişmiyor.','Как бы то ни было, мы продолжим.','İleri düzey kalıplaşmış bağlayıcı.']
 ],
 grammar:[
 ['A1','Я / ты / он / она','Ben / sen / o (eril) / o (dişil).','Я студент. · Она врач.','Şimdiki zamanda быть çoğunlukla kullanılmaz.'],
 ['A2','Винительный падеж','Belirtme durumu; doğrudan nesne için.','Я читаю книгу.','Книга → книгу dönüşümüne dikkat.'],
 ['B1','Вид глагола','Bitmiş / bitmemiş fiil görünüşü.','Я читал. · Я прочитал.','Süreç ile tamamlanma ayrımı.'],
 ['B2','Причастие','Ortaç; fiilden sıfat türetir.','читающий студент','Yazılı dilde yaygındır.'],
 ['C1','Деепричастие','Zarf-fiil; eşzamanlı / önceki eylem.','Читая книгу, он улыбался.','Özne aynı olmalıdır.'],
 ['C2','Безличные конструкции','Öznesiz yapılar.','Мне не спится.','Deneyimleyici dativ biçimde olabilir.']
 ]},
 ja:{name:'Japonca',voice:'ja-JP',
 vocab:[
 ['A1','こんにちは','merhaba / iyi günler','こんにちは、元気ですか。','Gündüz selamlaşması.','konnichiwa'],
 ['A1','ありがとう','teşekkürler','ありがとうございます。','Kibar biçim: ありがとうございます。','arigatō'],
 ['A1','水（みず）','su','水を飲みます。','を, doğrudan nesne parçacığı.','mizu'],
 ['A1','本（ほん）','kitap','これは私の本です。','の, iyelik / niteleme ilişkisi kurar.','hon'],
 ['A1','友達（ともだち）','arkadaş','彼は私の友達です。','Günlük isim.','tomodachi'],
 ['A1','今日（きょう）','bugün','今日は勉強します。','Bağlama göre bugün.','kyō'],
 ['A1','お願いします','lütfen; rica ederim','水をお願いします。','Kibar rica ifadesi.','onegaishimasu'],
 ['A2','予定（よてい）','plan; program','明日は予定があります。','Randevu anlamı bağlama göre değişir.','yotei'],
 ['A2','いつも','her zaman; genellikle','いつも朝ご飯を食べます。','Sıklık zarfı.','itsumo'],
 ['B1','改善する','iyileştirmek','日本語を改善したいです。','Resmî / teknik bağlamlarda doğal.','kaizen suru'],
 ['B1','信頼できる','güvenilir','これは信頼できる情報です。','Sıfat görevi gören ifade.','shinrai dekiru'],
 ['B2','持続可能な','sürdürülebilir','持続可能な社会を目指します。','な ile isim niteler.','jizoku kanō na'],
 ['B2','にもかかわらず','-e rağmen','雨にもかかわらず出発しました。','Ödünleme ifadesi.'],
 ['C1','それにもかかわらず','buna rağmen; yine de','それにもかかわらず彼は続けた。','Cümleler arası karşıtlık.'],
 ['C1','前提（ぜんてい）','öncül; varsayım','この前提を確認しましょう。','Akademik / mantıksal bağlam.','zentei'],
 ['C2','看過できない','göz ardı edilemez','看過できない問題があります。','İleri düzey resmî ifade.','kanka dekinai'],
 ['C2','不可欠（ふかけつ）','vazgeçilmez','協力は不可欠です。','Soyut metinlerde kullanılır.','fukaketsu']
 ],
 sentence:[
 ['A1','お名前は何ですか。','Adınız nedir?','私の名前はエジェです。','は konu belirtir.'],
 ['A1','お元気ですか。','Nasılsınız?','はい、元気です。','Kibar soru.'],
 ['A2','手伝っていただけますか。','Bana yardım edebilir misiniz?','もう一度言っていただけますか。','Kibar rica yapısı.'],
 ['B1','一年間日本語を勉強しています。','Bir yıldır Japonca çalışıyorum.','三年間ここに住んでいます。','〜ています: devam eden durum.'],
 ['B2','時間があれば旅行します。','Zamanım olursa seyahat ederim.','暇があれば行きます。','〜ば koşul yapısı.'],
 ['C1','知っていたら、電話したのに。','Bilseydim arardım.','早く分かっていれば、助けたのに。','〜のに pişmanlık / ters gerçekleşmeyi vurgular.'],
 ['C2','検討したからといって、賛成したわけではない。','Değerlendirmiş olmam onayladığım anlamına gelmez.','有名だからといって正しいわけではない。','〜からといって…わけではない.']
 ],
 grammar:[
 ['A1','です / ます','Kibar cümle sonları.','私は学生です。 · 毎日勉強します。','İsim ve fiil cümlelerinde biçim değişir.'],
 ['A2','て形','Fiilleri bağlayan çok amaçlı biçim.','ドアを開けてください。','〜てください: kibar istek.'],
 ['B1','〜ながら','İki eylemin aynı anda yapılması.','音楽を聞きながら勉強します。','Fiilin ます kökü + ながら.'],
 ['B2','〜わけではない','“Mutlaka öyle değil” anlamı verir.','嫌いなわけではありません。','Kısmi olumsuzlama.'],
 ['C1','〜ざるを得ない','Yapmak zorunda kalmak.','計画を変更せざるを得ない。','Sıkça resmî yazıda.'],
 ['C2','〜に堪えない','Dayanamayacak kadar; derin duygu.','感謝に堪えません。','Sabit / yüksek kayıtlı ifadelerde.']
 ]}
};
const levels=['A1','A2','B1','B2','C1','C2'];
const modes=['vocab','sentence','grammar'];
const lessons=[];
for(const [language,pack] of Object.entries(packs)){
 for(const mode of modes){
  pack[mode].forEach((row,index)=>{
   const [level,front,answer,example,note,phonetic='']=row;
   lessons.push(Object.freeze({id:`${language}:${mode}:${String(index).padStart(3,'0')}`,language,mode,level,front,answer,example,note,phonetic}));
  });
 }
}
const result=Object.freeze({packs:Object.freeze(Object.fromEntries(Object.entries(packs).map(([key,val])=>[key,Object.freeze({name:val.name,voice:val.voice})]))),levels:Object.freeze(levels),modes:Object.freeze(modes),lessons:Object.freeze(lessons)});
global.CHALK_LESSONS=result;
if(typeof module!=='undefined'&&module.exports)module.exports=result;
})(typeof window!=='undefined'?window:globalThis);
