# Typescript-Express.js-Node.js 스터디

>[Opensource Groupware Funwork API Project.](https://github.com/changhwa/funwork-api)를 보고 직접 실습한 내용을 정리.<br>
> API 란 프로그램을 쉽게 제작할 수있게 미리 만들어 놓은 것들의 모음.



#### 프로젝트 구조
```
project-name/
│
├── bin/www
├── dist
├── node_module
├── src
│   ├── config/data-source.ts
│   ├── models
│   │   ├── index.ts
│   │   └── domain/*.ts
│   ├── routes
│   │   ├── _index.ts
│   │   └── *.routes.ts
│   ├── resources/db.json
│   ├── utils/db-utils.ts
│   └── server.ts
├── test
│   └── spec/models/*.integration.ts
│
├── package.json
└── gulpfile.js
```

#### Development Guidelines
```
  $ npm install            // pakage.json에 있는 라이브러리 설치
  $ npm install -g gulp    // gulp(Javascript 빌드 자동화 툴) 설치
  $ npm run start:dev      // 서버 실행하기
  $ npm test               // 테스트 코드 실행하기
```
