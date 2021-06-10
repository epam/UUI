FROM node:14-slim
WORKDIR /app

COPY app app
COPY public public
COPY server server
COPY changelog.md changelog.md
COPY package.json package.json
#RUN cd app && yarn && cd ../server && yarn

ENTRYPOINT ["yarn"]
CMD ["start-server"]
