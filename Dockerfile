# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 Nginx로 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
