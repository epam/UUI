FROM node:14-slim
WORKDIR /app
COPY . .
# COPY app app
# COPY public public
# COPY server server
# COPY changelog.md changelog.md
# COPY package.json package.json

ENTRYPOINT ["yarn"]
CMD ["start-server"]
