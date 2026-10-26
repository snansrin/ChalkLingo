# Build-time only. Requires Windows SAPI's English Microsoft Zira Desktop voice.
# Does not install a voice, alter system settings, or run inside the widget.
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$lessonFile = Join-Path $repo 'ui/lessons.js'
$raw = & node -e "process.stdout.write(JSON.stringify(require(process.argv[1]).lessons.filter(x=>x.language==='en').map(x=>({id:x.id,text:x.front,file:x.id.replaceAll(':','-')+'.wav'}))))" $lessonFile
if ($LASTEXITCODE -ne 0) { throw 'Cannot read English lessons' }
$cards = $raw | ConvertFrom-Json
$destination = Join-Path $repo 'ui/pronunciation'
New-Item -ItemType Directory -Path $destination -Force | Out-Null
Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
    $speaker.SelectVoice('Microsoft Zira Desktop')
    $speaker.Rate = 0
    foreach ($card in $cards) {
        if ($card.file -notmatch '^en-(vocab|sentence|grammar)-\d{3}\.wav$') { throw 'Unexpected lesson ID' }
        $speaker.SetOutputToWaveFile((Join-Path $destination $card.file))
        $speaker.Speak($card.text)
        $speaker.SetOutputToNull()
    }
    [IO.File]::WriteAllText((Join-Path $destination 'manifest.json'),$raw)
} finally { $speaker.Dispose() }
