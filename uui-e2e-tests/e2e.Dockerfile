# The version of the base image must be in sync with the version of "@playwright/test" NPM package
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

COPY package.json ./
RUN yarn

ENV UUI_IS_DOCKER=true

ENTRYPOINT [ "yarn" ]
CMD [ "<param>" ]
