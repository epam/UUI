# The version of the base image must be in sync with the version of "@playwright/test" NPM package
FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /e2e

COPY package.json ./
RUN yarn

ENV UUI_IS_DOCKER=true

ENTRYPOINT [ "yarn" ]
CMD [ "<param>" ]
