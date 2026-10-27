(function(root){
'use strict';
// Original Turkish-supported foundation material. CEFR-informed goals, not a complete A1 syllabus.
// Fields: target, meaning, teaching example, new-context gap, situation cue, explanation.
const rows=[
['meet','İlk karşılaşma','Selam verip kısa bir karşılaşmayı nazikçe bitirebilirim.','Selamlaşma kalıpları tek tek kelimelerden çok birer iletişim aracıdır.',[
 ['hello','merhaba','Hello, I am Ada.','___, my name is Deniz.','Yeni komşuna selam ver.','Hello günün her saatinde kullanılabilir.'],
 ['good morning','günaydın','Good morning, everyone.','___, Mum! Breakfast is ready.','Sabah ailene selam ver.','Morning sabah demektir; kalıbı birlikte hatırla.'],
 ['thank you','teşekkür ederim','Thank you for the tea.','This gift is lovely. ___!','Hediye için teşekkür et.','Thank you ardından for + isim gelebilir.'],
 ['please','lütfen','A coffee, please.','Close the door, ___.','Kapının kapatılmasını nazikçe iste.','Please isteğin başında veya sonunda olabilir.'],
 ['sorry','özür dilerim','Sorry, I am late.','Oh, your bag! I am so ___.','Birinin çantasına çarptın.','Sorry bir hata için özür bildirebilir.'],
 ['see you','görüşürüz','See you tomorrow.','It is time to go. ___ on Monday!','Pazartesi yeniden buluşacaksınız.','See you samimi bir vedalaşmadır.']
]],
['identity','Ben kimim?','Kendimi, adımı ve nereli olduğumu basit kalıplarla anlatabilirim.','I ile am, you ile are kullanılır. Kısaltmalar konuşmada yaygındır.',[
 ['my name is','benim adım','My name is Ece.','Hello! ___ Ali.','Adının Ali olduğunu söyle.','My name is + ad: kendini tanıtmanın bir yolu.'],
 ['I am','ben …-im','I am a student.','___ a teacher at this school.','Bu okulda öğretmensin.','I am = I’m. Mesleklerden önce a/an kullanılır.'],
 ['I am from','…-liyim / …-den geliyorum','I am from Turkey.','___ Italy, but I live here.','İtalya’dan geldiğini söyle.','From köken belirtir; ülkenin kendisi kalıbın parçası değildir.'],
 ['what is your name','adın ne','What is your name?','Nice to meet you. ___?','Tanıştığın kişinin adını sor.','Your karşıdaki kişiye ait olanı belirtir.'],
 ['nice to meet you','tanıştığıma memnun oldum','Hello, Bora. Nice to meet you.','You must be Lina. ___!','Lina ile ilk kez tanışıyorsun.','Bu kalıp ilk tanışmada kullanılır.'],
 ['I live in','…-de yaşıyorum','I live in Ankara.','___ a small town near London.','Londra yakınında küçük bir kasabada yaşıyorsun.','Live in bir yerde yaşamak; from köken, in burada yer bildirir.']
]],
['help','Anlamadığımda','Anlamadığımı söyleyip tekrar, yardım veya açıklama isteyebilirim.','Can you + yalın fiil ile nazik bir rica kurulabilir.',[
 ['I do not understand','anlamıyorum','I do not understand this word.','Sorry, ___. Can you help?','Söyleneni anlayamadın.','I do not understand = I don’t understand.'],
 ['can you repeat that','tekrar eder misin','Can you repeat that, please?','The room is noisy. ___?','Gürültü yüzünden duymadın; tekrar iste.','Repeat yeniden söylemek; can you ardından fiil yalın kalır.'],
 ['more slowly','daha yavaş','Please speak more slowly.','You speak very fast. Please read ___.','Metnin daha yavaş okunmasını iste.','Slowly bir işin nasıl yapıldığını anlatır.'],
 ['can you help me','bana yardım eder misin','Can you help me with this?','This bag is heavy. ___, please?','Ağır çanta için yardım iste.','Help me: bana yardım et; burada me eylemden etkilenen kişidir.'],
 ['what does it mean','bu ne anlama geliyor','This word is new. What does it mean?','I see a new sign. ___?','Yeni gördüğün işaretin anlamını sor.','Soru kalıbında does vardır; mean yalın kalır.'],
 ['I do not know','bilmiyorum','I do not know the answer.','Where is Tom? Sorry, ___.','Tom’un nerede olduğunu bilmiyorsun.','I do not know = I don’t know; bilmemeyi ifade eder.']
]],
['cafe','Küçük bir kafe','Yiyecek ve içecek isteyip fiyat ve hesap sorabilirim.','I would like + isim nazik bir istektir. A/an tek bir sayılabilen nesneyle kullanılır.',[
 ['I would like','istiyorum / rica ediyorum','I would like a sandwich.','___ some soup, please.','Nazikçe çorba iste.','I would like = I’d like; like tek başına beğenmek anlamına da gelir.'],
 ['a glass of water','bir bardak su','A glass of water, please.','I am thirsty. May I have ___?','Bir bardak su iste.','Water burada sayılamaz; ölçü için a glass of kullanılır.'],
 ['without sugar','şekersiz','Tea without sugar, please.','I prefer my coffee ___.','Kahveni şekersiz istediğini belirt.','Without bir şeyin yokluğunu belirtir.'],
 ['how much is it','fiyatı ne kadar','This sandwich looks good. How much is it?','I like this cake. ___?','Pastanın fiyatını sor.','Tek bir ürün için is it; birden fazla üründe are they gerekir.'],
 ['the bill','hesap','The bill, please.','We are ready to pay. Can we have ___?','Yemeğin sonunda hesabı iste.','Britanya İngilizcesinde the bill; Amerikan İngilizcesinde the check de yaygındır.'],
 ['that is all','hepsi bu','A tea, please. That is all.','No dessert for me. ___, thank you.','Siparişinin bittiğini belirt.','That is all = that’s all; başka bir şey istemediğini anlatır.']
]],
['town','Şehirde yol bul','Bir yeri sorup basit yön tariflerini anlayabilirim.','Go/turn ile başlayan yönergelerde özne çoğunlukla söylenmez.',[
 ['where is','… nerede','Where is the station?','Excuse me, ___ the museum?','Müzenin yerini sor.','Where is + tekil yer; çoğul yerlerde where are kullanılır.'],
 ['turn left','sola dön','Turn left at the bank.','At the next street, ___. The park is there.','Bir sonraki sokakta sola dönmesini söyle.','Turn left bir eylem; on the left ise solda konumudur.'],
 ['turn right','sağa dön','Turn right at the café.','Go past the school, then ___.','Okuldan sonra sağa dönmesini söyle.','Sağ ve solu kendi el hareketinle ilişkilendirmeyi deneyebilirsin.'],
 ['go straight','düz git','Go straight to the bridge.','Do not turn here. ___ for two minutes.','İki dakika düz ilerlemesini söyle.','Go straight bir yönergedir; düzlüğü straight sözcüğü belirtir.'],
 ['next to','yanında','The café is next to the bank.','The library is ___ the school.','Kütüphane okulun hemen yanında.','Next to iki yerin yan yana olduğunu anlatır.'],
 ['opposite','karşısında','The hotel is opposite the park.','The bank is ___ the station, across the road.','Banka istasyonun yolun öte tarafındaki karşısında.','Opposite karşı karşıya; next to yan yana demektir.']
]],
['routine','Bir günüm','Rutinimi, zamanı ve sıklığı basit ifadelerle anlatabilirim.','I/you ile geniş zamanda fiil yalın kalır. Saatlerde at, günlerde on kullanılır.',[
 ['I get up','kalkarım / uyanıp yataktan kalkarım','I get up at seven.','On school days, ___ at six.','Okul günlerinde altıda kalktığını söyle.','Get up yataktan kalkmak; wake up uyanmak anlamındadır.'],
 ['I go to work','işe giderim','I go to work by bus.','Every weekday, ___ by train.','Hafta içi trenle işe gittiğini söyle.','Work bu kalıpta the almaz.'],
 ['every day','her gün','I read every day.','She walks in the park ___.','Her gün parkta yürüdüğünü belirt.','Every day iki sözcüktür; everyday ise gündelik anlamında sıfattır.'],
 ['at seven','saat yedide','Dinner is at seven.','The lesson starts ___. It is 7:00.','Dersin yedide başladığını belirt.','At belirli saatlerde kullanılır.'],
 ['on Monday','pazartesi günü','I have a lesson on Monday.','The shop opens ___. That is the first day of our work week.','Dükkânın pazartesi açıldığını belirt.','Haftanın günleri büyük harfle başlar ve on alır.'],
 ['in the evening','akşam / akşamleyin','I cook in the evening.','After dinner, I read ___.','Akşam kitap okuduğunu belirt.','In the morning/afternoon/evening; gece için at night kullanılır.']
]],
['home','İnsanlar ve ev','Ailemi ve evimde bulunan şeyleri basitçe anlatabilirim.','There is tek bir varlığın bulunduğunu; I have sahipliği anlatır.',[
 ['my family','ailem','My family lives here.','I spend Sundays with ___.','Pazar günlerini ailenle geçirdiğini söyle.','My benim demektir; Türkçedeki iyelik eki İngilizcede ayrı sözcüktür.'],
 ['my friend','arkadaşım','My friend is a nurse.','This is ___. Her name is Ada.','Ada’yı arkadaşın olarak tanıt.','Friend cinsiyet belirtmez; my friend hem kadın hem erkek için kullanılabilir.'],
 ['I have','benim … var','I have a small room.','___ two brothers.','İki erkek kardeşin olduğunu söyle.','I have sahipliği belirtir; I am ile karıştırma.'],
 ['there is','… var / bulunuyor','There is a table in the kitchen.','___ a lamp by the bed.','Yatağın yanında bir lamba bulunduğunu söyle.','There is + tekil, there are + çoğul.'],
 ['under','altında','The bag is under the chair.','The cat is ___ the table, below its top.','Kedi masanın altında.','Under konum bildirir. Bir masanın altını zihninde canlandırmayı deneyebilirsin.'],
 ['between','arasında','The chair is between two windows.','The desk is ___ the bed and the door.','Masa yatak ile kapının arasında.','Between A and B: A ile B arasında.']
]],
['plans','Birlikte plan yap','Tercihimi söyleyip bir etkinlik önererek basit bir plan yapabilirim.','Let us / let’s + yalın fiil bir öneridir. Would you like …? nazik bir davettir.',[
 ['I like','severim / hoşlanırım','I like music.','___ swimming in the sea.','Denizde yüzmeyi sevdiğini söyle.','I like ardından isim veya -ing biçimi gelebilir.'],
 ['I do not like','sevmem / hoşlanmam','I do not like cold weather.','___ loud music. It hurts my ears.','Yüksek sesli müziği sevmediğini söyle.','I do not like = I don’t like; like yalın kalır.'],
 ['let us','haydi / … yapalım','Let us go to the park.','The sun is out. ___ walk to the beach.','Sahile yürümeyi öner.','Let us = let’s. Lets farklı bir yapıdır; kesme işaretini koru.'],
 ['would you like','ister misin','Would you like some tea?','___ to join us for lunch?','Birini öğle yemeğine davet et.','Would you like + isim veya to + fiil kullanılabilir.'],
 ['tomorrow','yarın','See you tomorrow.','Today is busy. We can meet ___.','Bugün yerine yarın buluşmayı öner.','Tomorrow genellikle önüne in/on/at almadan kullanılır.'],
 ['at the weekend','hafta sonunda','I visit my family at the weekend.','I am free ___. Saturday is good for me.','Hafta sonunda boş olduğunu söyle.','Britanya İngilizcesinde at the weekend; Amerikan İngilizcesinde on the weekend de kullanılır.']
]]
];
const aliases={'I am':["I'm"],'I am from':["I'm from"],'I do not understand':["I don't understand"],'I do not know':["I don't know"],'I would like':["I'd like"],'that is all':["that's all"],'let us':["let's"],'I do not like':["I don't like"],'at the weekend':['on the weekend'],'the bill':['the check']};
const course={id:'en-foundation-1',language:'en',level:'A1 temeli',title:'Küçük dünyadan gerçek hayata',units:rows.map(([id,title,goal,grammar,items],index)=>({id,index,title,goal,grammar,cards:items.map(([front,answer,example,context,cue,note],i)=>({id:`course:en:${id}:${i+1}`,unit:id,language:'en',level:'A1',mode:'sentence',front,answer,example,context,cue,note,accepted:[front,...(aliases[front]||[])]}))}))};
const api={course,cards:course.units.flatMap(u=>u.cards)};root.MochiCurriculum=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
