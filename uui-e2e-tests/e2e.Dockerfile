# The version of the base image must be in sync with the version of "@playwright/test" NPM package
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package.json ./
RUN yarn

ENV UUI_IS_DOCKER=true

ENTRYPOINT [ "yarn" ]
CMD [ "<param>" ]
