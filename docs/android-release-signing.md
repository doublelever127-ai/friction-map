# Android release 서명 준비

작성일: 2026-04-29  
대상 버전: v0.3.0 Google Play closed test

## 1. 왜 필요한가

Google Play에 Android App Bundle을 올리려면 release AAB가 업로드 키로 서명되어 있어야 합니다.

현재 프로젝트는 `bundleRelease`를 실행해 AAB를 만들 수 있지만, 키스토어가 없으면 서명되지 않은 AAB가 생성됩니다.

## 2. 현재 프로젝트에서 준비된 것

아래 파일을 추가했습니다.

```text
android/keystore.properties.example
```

실제 비밀번호가 들어가는 파일은 아래 이름으로 만들되 Git에 올리지 않습니다.

```text
android/keystore.properties
```

아래 파일들은 Git에서 무시됩니다.

```text
android/*.jks
android/*.keystore
android/keystore.properties
```

## 3. 키스토어 만들기

가장 쉬운 방법은 아래 준비 스크립트를 사용하는 것입니다.

```powershell
cd "C:\Users\ilove\OneDrive\문서\New project 3\friction-map"
powershell -ExecutionPolicy Bypass -File .\scripts\create-signed-aab.ps1
```

이 스크립트는 다음 작업을 한 번에 처리합니다.

- upload key 키스토어 생성
- `android/keystore.properties` 생성
- `pnpm.cmd build`
- `pnpm.cmd exec cap sync android`
- `gradlew.bat bundleRelease`
- `jarsigner` 서명 확인

스크립트 실행 중 비밀번호를 물어보면 직접 입력합니다. 비밀번호는 채팅이나 문서에 적지 말고 안전한 곳에 따로 보관합니다.

아래는 수동으로 진행할 때의 명령입니다.

PowerShell에서 아래 명령을 실행합니다.

```powershell
cd "C:\Users\ilove\OneDrive\문서\New project 3\friction-map\android"
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"

keytool -genkeypair `
  -v `
  -keystore release-upload-key.jks `
  -alias friction-map-upload `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000
```

명령 실행 중 비밀번호, 이름, 조직 등을 물어봅니다.

주의:

- 비밀번호는 잃어버리면 안 됩니다.
- `release-upload-key.jks`는 Git에 올리지 않습니다.
- 비밀번호를 문서나 채팅에 그대로 적지 않습니다.
- 키스토어 파일은 안전한 위치에 별도로 백업합니다.

## 4. keystore.properties 만들기

`android/keystore.properties.example`을 복사해 `android/keystore.properties`를 만듭니다.

```powershell
Copy-Item keystore.properties.example keystore.properties
```

그다음 `android/keystore.properties`를 열어 실제 값으로 바꿉니다.

```properties
storeFile=release-upload-key.jks
storePassword=여기에-직접-정한-비밀번호
keyAlias=friction-map-upload
keyPassword=여기에-직접-정한-비밀번호
```

## 5. 서명된 AAB 만들기

```powershell
cd "C:\Users\ilove\OneDrive\문서\New project 3\friction-map"
pnpm.cmd build
pnpm.cmd exec cap sync android

cd android
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\gradlew.bat bundleRelease
```

생성 파일:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

## 6. 서명 확인

```powershell
jarsigner -verify -verbose -certs app\build\outputs\bundle\release\app-release.aab
```

성공 기준:

```text
jar verified.
```

`jar is unsigned`가 나오면 Play Console 업로드 전 다시 서명 설정을 확인해야 합니다.

## 7. Play Console 업로드 전 확인

- 앱 ID: `com.doublelever.frictionmap`
- 버전 이름: `0.3.0`
- versionCode: `1`
- 개인정보처리방침 URL 확인
- Data Safety 작성
- 폐쇄 테스트 테스터 이메일 준비
