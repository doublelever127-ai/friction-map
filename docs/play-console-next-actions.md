# 마찰지도 Play Console 다음 진행 순서

작성일: 2026-04-29  
대상 버전: v0.3.0 Android closed test 준비

## 1. 현재 상태

- GitHub `main` 브랜치에 v0.3 Android/Play Store 준비 코드가 올라가 있습니다.
- Android release AAB가 생성되어 있습니다.
- 개인정보처리방침 페이지는 앱 안에 `/privacy/` 경로로 구현되어 있습니다.
- GitHub Pages 배포 워크플로도 준비되어 있습니다.

현재 막힌 지점은 저장소가 `Private` 상태라 GitHub Pages를 무료로 켤 수 없다는 점입니다.

GitHub Pages 화면에 아래 문구가 보이면 정상적으로 같은 상황입니다.

```text
Upgrade or make this repository public to enable Pages
```

## 2. 먼저 해야 할 일: 저장소 공개 전환

GitHub 저장소에서 아래 순서로 진행합니다.

1. `friction-map` 저장소로 이동합니다.
2. 상단 `Settings`를 엽니다.
3. 왼쪽 `General`을 선택합니다.
4. 맨 아래 `Danger Zone`까지 스크롤합니다.
5. `Change repository visibility`를 선택합니다.
6. `Change to public`을 선택합니다.
7. GitHub가 요구하는 확인 문구를 입력하고 공개 전환을 완료합니다.

공개 전환 전 점검 결과:

- `.env` 파일 없음
- 키스토어 파일 없음
- 비밀번호, 토큰, API 키로 보이는 파일 없음
- 앱은 서버, 로그인, 광고 SDK, 분석 SDK, AI API를 사용하지 않음

## 3. GitHub Pages 켜기

저장소가 Public으로 바뀐 뒤 아래 순서로 진행합니다.

1. `Settings`로 이동합니다.
2. 왼쪽 `Pages`를 선택합니다.
3. `Build and deployment` 섹션에서 `Source`를 확인합니다.
4. `GitHub Actions`를 선택합니다.
5. 저장합니다.
6. 상단 `Actions` 탭에서 Pages 배포가 초록색 체크로 끝나는지 확인합니다.

배포가 끝나면 아래 URL이 열려야 합니다.

```text
https://doublelever127-ai.github.io/friction-map/privacy/
```

이 URL은 Play Console의 개인정보처리방침 URL로 사용합니다.

## 4. Play Console 앱 만들기 입력값

Play Console 첫 화면에서 `앱 만들기`를 눌렀을 때 아래 값으로 입력합니다.

| 항목 | 입력값 |
| --- | --- |
| 앱 이름 | 마찰지도 |
| 기본 언어 | 한국어 |
| 앱 또는 게임 | 앱 |
| 무료 또는 유료 | 무료 |

선언 항목은 화면 문구를 읽고 현재 앱 상태에 맞게 선택합니다.

현재 마찰지도는 다음 방향으로 설명합니다.

```text
자꾸 막히는 순간을 한 줄로 남기고, 반복되는 패턴을 보는 개인 기록 앱
```

## 5. 스토어 등록정보 추천값

### 짧은 설명

```text
자꾸 막히는 순간을 한 줄로 남기고, 반복되는 패턴을 보는 앱
```

### 긴 설명

긴 설명 초안은 아래 문서를 사용합니다.

```text
docs/playstore-listing.md
```

### 개인정보처리방침 URL

GitHub Pages가 켜진 뒤 아래 URL을 사용합니다.

```text
https://doublelever127-ai.github.io/friction-map/privacy/
```

## 6. AAB 업로드 파일

현재 생성된 release AAB 위치는 아래입니다.

```text
C:\Users\ilove\OneDrive\문서\New project 3\friction-map\android\app\build\outputs\bundle\release\app-release.aab
```

주의:

- Play Console 업로드 중 서명 관련 오류가 나면 Android Studio에서 `Generate Signed Bundle / APK` 흐름으로 업로드 키를 만들어야 합니다.
- 키스토어 비밀번호는 사용자가 직접 정하고 안전한 곳에 보관해야 합니다.
- 키스토어 파일과 비밀번호는 Git에 커밋하지 않습니다.

## 7. Play Console에서 피해야 할 표현

마찰지도는 치료나 진단 앱으로 설명하지 않습니다.

피할 표현:

- 불안 치료
- 우울 개선
- 정신건강 치료
- 심리 진단
- 의학적 조언
- 처방
- 증상 완화

권장 표현:

- 개인 기록 앱
- 자꾸 막히는 순간
- 반복되는 패턴
- 다음에 덜 버겁게
- 기기 안에 저장
- 서버로 전송하지 않음

## 8. 다음 확인 순서

1. 저장소를 Public으로 전환합니다.
2. GitHub Pages Source를 `GitHub Actions`로 설정합니다.
3. 개인정보처리방침 URL이 열리는지 확인합니다.
4. Play Console에서 앱을 만듭니다.
5. 스토어 등록정보를 입력합니다.
6. Data Safety 항목은 `docs/playstore-data-safety.md`를 참고해 작성합니다.
7. AAB를 업로드합니다.
8. 폐쇄 테스트 트랙을 만들고 테스터 이메일을 등록합니다.

