param(
    [string]$KeyAlias = "friction-map-upload",
    [string]$KeystoreFileName = "release-upload-key.jks"
)

$ErrorActionPreference = "Stop"

function ConvertTo-PlainText {
    param([System.Security.SecureString]$SecureValue)

    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    try {
        [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$androidDir = Join-Path $repoRoot "android"
$keystorePath = Join-Path $androidDir $KeystoreFileName
$keystorePropertiesPath = Join-Path $androidDir "keystore.properties"
$javaHome = "C:\Program Files\Android\Android Studio\jbr"

if (-not (Test-Path $javaHome)) {
    throw "Android Studio JBR was not found: $javaHome"
}

$env:JAVA_HOME = $javaHome
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

Write-Host ""
Write-Host "Friction Map Android signed release AAB helper" -ForegroundColor Cyan
Write-Host "Keystore file: $keystorePath"
Write-Host ""

if (-not (Test-Path $keystorePath)) {
    Write-Host "No keystore found. keytool will create a new upload key." -ForegroundColor Yellow
    Write-Host "Important: save the password somewhere safe. Do not paste it into chat." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Suggested answers for keytool prompts:" -ForegroundColor Cyan
    Write-Host "  First and last name: freemann"
    Write-Host "  Organizational unit: personal"
    Write-Host "  Organization: friction-map"
    Write-Host "  City: Seoul"
    Write-Host "  State: Seoul"
    Write-Host "  Country code: KR"
    Write-Host "  Confirm: y"
    Write-Host ""

    & keytool -genkeypair `
        -v `
        -keystore $keystorePath `
        -alias $KeyAlias `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000
}
else {
    Write-Host "Existing keystore found. The script will reuse it." -ForegroundColor Green
}

Write-Host ""
Write-Host "Now enter the same passwords for Gradle signing." -ForegroundColor Cyan
Write-Host "Input is hidden. Values are saved only to android/keystore.properties." -ForegroundColor Yellow
Write-Host "android/keystore.properties is ignored by Git."
Write-Host ""

$storePasswordSecure = Read-Host "Keystore password" -AsSecureString
$keyPasswordSecure = Read-Host "Key password" -AsSecureString

$storePassword = ConvertTo-PlainText $storePasswordSecure
$keyPassword = ConvertTo-PlainText $keyPasswordSecure

try {
    @"
storeFile=$KeystoreFileName
storePassword=$storePassword
keyAlias=$KeyAlias
keyPassword=$keyPassword
"@ | Set-Content -Path $keystorePropertiesPath -Encoding UTF8 -NoNewline
}
finally {
    $storePassword = $null
    $keyPassword = $null
}

Write-Host ""
Write-Host "Running Next.js build..." -ForegroundColor Cyan
Set-Location $repoRoot
& pnpm.cmd build

Write-Host ""
Write-Host "Syncing Capacitor Android project..." -ForegroundColor Cyan
& pnpm.cmd exec cap sync android

Write-Host ""
Write-Host "Building signed release AAB..." -ForegroundColor Cyan
Set-Location $androidDir
& .\gradlew.bat bundleRelease

$aabPath = Join-Path $androidDir "app\build\outputs\bundle\release\app-release.aab"

Write-Host ""
Write-Host "Verifying AAB signature..." -ForegroundColor Cyan
$verifyOutput = & jarsigner -verify -verbose -certs $aabPath 2>&1
$verifyOutput | Select-Object -First 80

if ($verifyOutput -match "jar verified") {
    Write-Host ""
    Write-Host "Signed AAB is ready:" -ForegroundColor Green
    Write-Host $aabPath
}
else {
    throw "AAB signature verification failed. Check the jarsigner output above."
}
