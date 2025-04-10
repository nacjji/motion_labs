1. Git Clone
```bash
git clone https://github.com/nacjji/motion_labs.git
```


2. 프로젝트 이동 
```bash
cd motion_labs
```

3. 패키지 설치
```bash 
yarn install
```

4. .env 생성
```bash 
touch .env
```

5. mail에 첨부한 env 작성
```bash
DB_USER=
DB_PASSWORD=
DB_NAME=

DB_HOST=
DB_PORT=


ROOT_PASSWORD=
ROOT_DATABASE=
```

6. Docker-compose 구동
```bash 
 docker-compose up -d --build 
```

7. 서버 구동
```bash
yarn run start
```

8. swagger: http://localhost:3000/docs

