FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

COPY package.json ./

RUN yarn

ENTRYPOINT [ "yarn" ]

CMD [ "<param>" ]
