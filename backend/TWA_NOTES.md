# TWA(Android) 배포 개요

이 문서는 Chan-i PWA를 안드로이드용 TWA(Trusted Web Activity)로 감싸서 구글 플레이스토어에 배포하기 위한 큰 흐름을 정리한 것입니다.

## 1. 선행 조건

- PWA가 HTTPS 도메인에서 안정적으로 서비스될 것
  - 예: https://chanii.example.com
  - 서비스 워커 정상 동작, manifest 등록, `display: standalone` 설정
- 웹 앱의 start_url이 TWA에서 사용할 루트 경로와 일치

## 2. 기본 흐름

1. 웹 도메인 준비 및 배포
   - Vite 빌드를 통해 정적 파일 생성 후, 호스팅(예: Vercel, Netlify, Cloudflare Pages 등)에 올립니다.
   - `/.well-known/assetlinks.json`을 통해 안드로이드 패키지와 도메인 간 신뢰 연결을 구성해야 합니다.

2. Android TWA 프로젝트 생성
   - `Bubblewrap` CLI 또는 Android Studio TWA 템플릿 사용.
   - 주요 설정:
     - 앱 이름, 패키지명(ex: `com.example.chanii`)
     - startUrl: Chan-i PWA의 루트 URL
     - 앱 아이콘 및 스플래시 이미지

3. Digital Asset Links 설정
   - TWA 앱의 `asset_statements`에 웹 도메인을 명시.
   - 웹 서버에 `https://your-domain/.well-known/assetlinks.json` 파일 배포.

4. 빌드 & 서명
   - 릴리즈 키스토어 생성.
   - 릴리즈 빌드(.aab 또는 .apk) 생성.

5. 구글 플레이 콘솔 업로드
   - 앱 스토어 정보(설명, 스크린샷, 카테고리 등) 입력.
   - 개인정보처리방침 URL 등록.
   - 심사 요청 후 배포.

