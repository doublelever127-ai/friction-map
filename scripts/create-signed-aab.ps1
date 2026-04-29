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
    throw "Android Studio JBR을 찾을 수 없습니다: $javaHome"
}

$env:JAVA_HOME = $javaHome
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

Write-Host ""
Write-Host "마찰지도 Android release 서명 AAB 생성" -ForegroundColor Cyan
Write-Host "키스토어 파일: $keystorePath"
Write-Host ""

if (-not (Test-Path $keystorePath)) {
    Write-Host "키스토어가 아직 없습니다. keytool을 실행해 새 upload key를 만듭니다." -ForegroundColor Yellow
    Write-Host "중요: 지금 입력하는 비밀번호는 잃어버리면 안 됩니다. 안전한 곳에 따로 보관하세요." -ForegroundColor Yellow
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
    Write-Host "기존 키스토어를 사용합니다." -ForegroundColor Green
}

Write-Host ""
Write-Host "Gradle 서명을 위해 키스토어 비밀번호를 입력합니다." -ForegroundColor Cyan
Write-Host "입력값은 화면에 표시되지 않고, android/keystore.properties에만 저장됩니다." -ForegroundColor Yellow
Write-Host "이 파일은 .gitignore에 포함되어 Git에 올라가지 않습니다."
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
Write-Host "웹 정적 빌드를 실행합니다." -ForegroundColor Cyan
Set-Location $repoRoot
& pnpm.cmd build

Write-Host ""
Write-Host "Capacitor Android 동기화를 실행합니다." -ForegroundColor Cyan
& pnpm.cmd exec cap sync android

Write-Host ""
Write-Host "서명된 release AAB를 생성합니다." -ForegroundColor Cyan
Set-Location $androidDir
& .\gradlew.bat bundleRelease

$aabPath = Join-Path $androidDir "app\build\outputs\bundle\release\app-release.aab"

Write-Host ""
Write-Host "AAB 서명을 확인합니다." -ForegroundColor Cyan
$verifyOutput = & jarsigner -verify -verbose -certs $aabPath 2>&1
$verifyOutput | Select-Object -First 80

if ($verifyOutput -match "jar verified") {
    Write-Host ""
    Write-Host "서명된 AAB 생성 완료:" -ForegroundColor Green
    Write-Host $aabPath
}
else {
    throw "AAB 서명 확인에 실패했습니다. jarsigner 출력에서 원인을 확인하세요."
}
