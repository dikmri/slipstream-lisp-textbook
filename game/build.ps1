$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$taskSbcl = (Get-Command sbcl -ErrorAction SilentlyContinue).Source
if (-not $taskSbcl) { $taskSbcl = Join-Path $env:ProgramFiles 'Steel Bank Common Lisp\sbcl.exe' }
if (-not (Test-Path -LiteralPath $taskSbcl)) { throw 'Install SBCL first: winget install --id SBCL.SBCL --exact --silent' }
$taskGcc = (Get-Command gcc -ErrorAction SilentlyContinue).Source
if (-not $taskGcc) { throw 'A 64-bit MinGW GCC compiler is required to rebuild the native renderer.' }
New-Item -ItemType Directory -Force -Path 'artifacts','dist\Slipstream' | Out-Null
if (-not (Test-Path -LiteralPath 'vendor\raylib\libraylib.a')) {
    $taskZip = Join-Path $env:TEMP 'slipstream-raylib-5.5.zip'
    $taskExtract = Join-Path $env:TEMP 'slipstream-raylib-5.5'
    Invoke-WebRequest -Uri 'https://github.com/raysan5/raylib/releases/download/5.5/raylib-5.5_win64_mingw-w64.zip' -OutFile $taskZip
    Expand-Archive -LiteralPath $taskZip -DestinationPath $taskExtract -Force
    $taskLibrary = Join-Path $taskExtract 'raylib-5.5_win64_mingw-w64\lib\libraylib.a'
    Copy-Item -LiteralPath $taskLibrary -Destination 'vendor\raylib\libraylib.a'
}
& $taskGcc -shared -O2 -static-libgcc -Ivendor/raylib native/bridge.c vendor/raylib/libraylib.a -lopengl32 -lgdi32 -lwinmm -o dist/Slipstream/arena.dll
if ($LASTEXITCODE -ne 0) { throw 'Native renderer compilation failed.' }
& $taskSbcl --noinform --disable-debugger --script build.lisp
if ($LASTEXITCODE -ne 0) { throw 'Common Lisp build or gameplay checks failed.' }
$taskExe = Join-Path $PSScriptRoot 'dist\Slipstream\Slipstream.exe'
Copy-Item -LiteralPath 'vendor\raylib\LICENSE' -Destination 'dist\Slipstream\raylib-LICENSE'
Copy-Item -LiteralPath 'vendor\SBCL-COPYING' -Destination 'dist\Slipstream\SBCL-COPYING'
Write-Output "Built: $taskExe"
