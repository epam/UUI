FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./

RUN yarn

CMD [ "<param-1>", "<param-2>" ]
