## 스크롤 애니메이션 적용 순서

1. 섹션을 웹 컴포넌트로 분기 후 CSS로 스크롤 적용
2. 섹션에 파라미터 적용 후 url 업데이트
  - 메뉴 클릭 시 섹션으로 스크롤 이동
  - 스크롤로 섹션 이동 시 url 업데이트
  - 브라우저 새로고침 시 해당 섹션으로 스크롤 이동
  - 섹션 url로 직접 접속 시 해당 섹션으로 스크롤 이동
3. 3D 공간 추가 후 glb, 라이팅, 카메라 적용
4. glb가 움직일 위치 설정 (커브, 점, 모델 박스 영역을 디버깅으로 설정)
5. 각 섹션별로 스크롤 시 glb의 포지션, 회전, 스케일 설정
6. 각 섹션별로 스크롤 시 라벨 표시 설정


***

## [1] 로컬에 기본 프로젝트 설치

1. 기본 파일
```
index.html // 웹 컴포넌트
404.html   // 404 페이지
styles.css // 스타일 모아두는 파일
scripts.js // 컴포넌트 모아두는 파일
```

2. 폴더 구조
```
styles/
  - reset.css
  - global.css
  - header.css
  - footer.css
  - section01.css
  - section02.css
  - section03.css
  - section04.css
  - section05.css
components/
  - footer.js
  - header.js
  - section01.js
  - section02.js
  - section03.js
  - section04.js
  - section05.js
public/
  - 이미지 파일
```

3. 빌드 도구 설치 및 실행
- 설치 : `pnpm add vite`
- 설정 : `package.json`
  ```
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build"
    },
    "dependencies": {
      "vite": "^5.4.10"
    }
  }
  ```
- 빌드 : `pnpm build`
- 실행 : `pnpm dev`

***

## [2] 깃허브 리포 만들고 로컬에 연결

***

## [3] 깃허브 페이지 배포
- private 에서 actions로 빌드하고 public 리포지토리에 배포
  ```

  1. 조직에서 토큰 활성화 (한번만 활성화하면 됨)
  organization > Settings > Personal access tokens > continue ~ done

  2. 개인 프로필에 토큰 발급
  개인 프로필 > Settings > Developer Settings > personal access tokens > Generate new token > Resource owner 에 방금 설정한 조직이 나오면 성공 > Token name 토큰 이름 작성, Expiration 날짜 설정, Permissions 설정 > Generate token 버튼 클릭 후 생성 > 발급된 토큰 클립보드에 복사

  3. yml 리포에 토큰 추가
  리포지토리 > Settings > Secrets and variables > Actions > New repository secret > Name 에 DEPLOY_TOKEN, Secret 에 발급된 토큰 입력 > Add secret 버튼 클릭

  4. 커밋하면 actions 자동으로 실행되면서 배포됨
  ```

- actions 설정 예시
  ```yml
  name: Deploy dist to another repo # actions에 보여질 이름

  permissions:
    contents: write

  on:
    push:
      branches:
        - main # 배포할 브랜치 이름

  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      
      steps:
        # 1. 리포지토리 체크아웃
        - name: Checkout repository
          uses: actions/checkout@v3
          
        # 2. Node.js 설치 및 의존성 설치
        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '16'
            
        - run: npm install
        
        # 3. Vite로 프로젝트 빌드
        - name: Build with Vite
          run: npm run build

        # 4. 유저 이름, 이메일, 커밋 메시지
        - name: Commit changes
          run: |
            git config --local user.email "wfedev+build@gmail.com"
            git config --local user.name "webgldev"
            git add -f dist
            git commit -m "Update"

        # 5. 커밋 후 dist 폴더 배포
        - name: Pushes to another repository
          uses: cpina/github-action-push-to-another-repository@main
          env:
            API_TOKEN_GITHUB: ${{ secrets.DEPLOY_TOKEN }}
          with:
            # 배포 받을 리포지토리 경로
            source-directory: 'dist'
            destination-github-username: 'webgldev'
            destination-repository-name: 'scroll'
            user-email: wfedev+build@gmail.com
            target-branch: main
  ```

## [4] 빌드 도구 옵션
- 파일 생성 : `vite.config.js`
- 설치 : `pnpm add html-minifier-terser vite-plugin-html terser`
```js
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import { promises as fs } from 'fs';
import { minify } from 'html-minifier-terser';

export default defineConfig({
  server: {open: true,},

  base: '/scroll/', // GitHub Pages의 리포지토리 이름에 맞게 base 경로 설정
  build: {
    minify: 'terser', // 자바스크립트 및 CSS 압축
    terserOptions: {
      compress: {
        drop_console: true,  // console.log 제거
        drop_debugger: true, // debugger 제거
      },
      mangle: true, // 난독화
    },
  },
  plugins: [
    createHtmlPlugin({
      minify: true,
    }),
    {
      name: 'copy-and-minify-404-html',
      closeBundle: async () => {
        const distDir = resolve(__dirname, 'dist');
        const sourcePath = resolve(__dirname, '404.html');
        const destPath = resolve(distDir, '404.html');
        await fs.access(sourcePath);
        const html = await fs.readFile(sourcePath, 'utf-8');
        const minifiedHtml = await minify(html, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          minifyCSS: true,
          minifyJS: true,
        });
        await fs.writeFile(destPath, minifiedHtml);
      }
    }
  ],
});
```

## [5] public 리포에서 깃허브 페이지 설정
1. 리포지토리 > Settings > Pages > Source > Branch > main > /(root) > Save
2. Actions 탭에서 빌드 확인 및 배포 확인



## [6] WebGL 추가
- 설치 : `pnpm add three gsap`







### 참고 사항
- [scroll-snap-type](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Post (ScrollTrigger and Threejs)](https://gsap.com/community/forums/topic/25016-scrolltrigger-and-threejs/)
- [Docs Example (threejs curve)](https://threejs.org/examples/?q=curve#webgl_modifier_curve)


