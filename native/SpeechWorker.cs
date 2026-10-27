// MIT. One request on stdin; WAV bytes on stdout as JSON. No microphone or network.
using System;
using System.IO;
using System.Linq;
using System.Speech.Synthesis;
using System.Speech.AudioFormat;
using System.Web.Script.Serialization;
using System.Text;
class SpeechWorker {
 public class Request { public string text {get;set;} public string lang {get;set;} }
 static int Main() {
  var json=new JavaScriptSerializer();
  Console.InputEncoding=new UTF8Encoding(false);Console.OutputEncoding=new UTF8Encoding(false);
  try {
   var input=Console.In.ReadToEnd();if(input.Length>8192)throw new Exception("invalid-request");
   var request=json.Deserialize<Request>(input);
   if(request==null||String.IsNullOrWhiteSpace(request.text)||request.text.Length>500||String.IsNullOrWhiteSpace(request.lang))throw new Exception("invalid-request");
   var target=System.Globalization.CultureInfo.GetCultureInfo(request.lang);
   var primary=target.TwoLetterISOLanguageName;
   if(!new[]{"en","de","fr","es","it","ru","ja"}.Contains(primary))throw new Exception("unsupported-language");
   using(var synth=new SpeechSynthesizer()) {
    var voice=synth.GetInstalledVoices().Where(v=>v.Enabled&&v.VoiceInfo.Culture.TwoLetterISOLanguageName==primary)
     .OrderByDescending(v=>v.VoiceInfo.Culture.Name.Equals(target.Name,StringComparison.OrdinalIgnoreCase))
     .ThenByDescending(v=>v.VoiceInfo.Name.IndexOf("Zira",StringComparison.OrdinalIgnoreCase)>=0).FirstOrDefault();
    if(voice==null)throw new Exception("missing-voice");
    synth.SelectVoice(voice.VoiceInfo.Name);
    if(synth.Voice.Culture.TwoLetterISOLanguageName!=primary)throw new Exception("voice-language-mismatch");
    synth.Rate=0;synth.Volume=100;
    using(var stream=new MemoryStream()) {
     synth.SetOutputToWaveStream(stream);synth.Speak(request.text);synth.SetOutputToNull();
     var data=stream.ToArray();if(data.Length>1500000)throw new Exception("audio-too-large");
     Console.Write(json.Serialize(new{ok=true,voice=synth.Voice.Name,lang=synth.Voice.Culture.Name,audio=Convert.ToBase64String(data)}));
    }
   }
   return 0;
  } catch(Exception error) {Console.Write(json.Serialize(new{ok=false,error=error.Message}));return 1;}
 }
}
