param($v,$q)
$S=$PSScriptRoot
$logo=[Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path "C:\Users\luisr\OneDrive\Documents\TITULACI*N_VEMOS\img\logo.jpg").Path))
$h='<!doctype html><meta charset=utf-8><canvas id=c width=1280 height=720></canvas><pre id=o></pre><script>const LOGO="data:image/jpeg;base64,'+$logo+'";'+[IO.File]::ReadAllText("$S\escenas.js")+[IO.File]::ReadAllText("$S\motor.js")+'</script>'
[IO.File]::WriteAllText("$S\render.html",$h,(New-Object Text.UTF8Encoding $false))
$edge="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$fs=[IO.File]::Create("$S\$v.mjpeg");$n=0
& $edge --headless=new --disable-gpu --user-data-dir="$S\prof3" --allow-file-access-from-files --virtual-time-budget=10000 --dump-dom ("file:///" + ($S -replace '\\','/') + "/render.html?v=$v&$q") | ForEach-Object { if($_ -match 'ERROR_JS'){$_.Substring(0,[Math]::Min(400,$_.Length))} elseif($_.Length -gt 1000 -and $_.StartsWith('/9j/')){ $b=[Convert]::FromBase64String($_.Trim()); $fs.Write($b,0,$b.Length);$n++ } }
$fs.Close(); "$v cuadros=$n"
