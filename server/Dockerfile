# 1. 환경 설정
FROM node:20-alpine
WORKDIR /app

# 2. 의존성 설치
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
RUN npm install

# 3. 소스 복사 및 '빌드' (가장 중요!)
COPY . .
RUN npx prisma generate
RUN npm run build  
# 💡 tsc를 실행해서 src(.ts)를 dist(.js)로 바꿉니다.

# 4. 실행 (dev가 아닌 start!)
ENV NODE_ENV=production
CMD ["npm", "run", "start"]