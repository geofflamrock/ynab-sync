FROM node:16 as build

# Install pnpm
RUN curl -f https://get.pnpm.io/v6.14.js | node - add --global pnpm

WORKDIR /src

COPY pnpm-lock.yaml pnpm-lock.yaml
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY package.json package.json
COPY packages/cli/package.json packages/cli/package.json
COPY packages/core/package.json packages/core/package.json
COPY packages/puppeteer/package.json packages/puppeteer/package.json
COPY packages/st-george-au/package.json packages/st-george-au/package.json
COPY packages/westpac-au/package.json packages/westpac-au/package.json

RUN pnpm install

COPY tsconfig.base.json tsconfig.base.json
COPY packages packages/

RUN pnpm build

RUN pnpm run pkg -- -- --target node16-alpine-x64 --output /src/build/ynab-sync

FROM zenika/alpine-chrome as runner

# Install chrome to get dependencies
# ARG CHROME_VERSION="91.0.4472.164-1"
# RUN apt-get update \
#     && apt-get install -y wget gnupg \
#     && wget --no-verbose -O /tmp/chrome.deb http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_91.0.4472.164-1_amd64.deb \
#     && apt install -y /tmp/chrome.deb \
#     && rm /tmp/chrome.deb
# RUN apt-get update \
#     && apt-get install -y wget gnupg \
#     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable_91.0.4469.0-1 fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
#     --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*
# ARG DEBIAN_FRONTEND=noninteractive
# ENV TZ=Australia/Sydney
# RUN apt-get update && \
#     apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
#     libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
#     libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
#     libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
#     ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# RUN apt-get update && \
#     apt-get install -yq libgbm-dev

# # Add user so we don't need --no-sandbox.
# RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#     && mkdir -p /home/pptruser/Downloads \
#     && chown -R pptruser:pptruser /home/pptruser

# # Run everything after as non-privileged user.
# USER pptruser

# RUN sysctl -w kernel.unprivileged_userns_clone=1

# RUN apt-get update && \
#     apt-get install -yq chromium-browser libnss3

# RUN apt-get install -yq libatk1.0-0

# RUN apk add --no-cache \
#     chromium \
#     nss \
#     freetype \
#     harfbuzz \
#     ca-certificates \
#     ttf-freefont

# # Add user so we don't need --no-sandbox.
# RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
#     && mkdir -p /home/pptruser/Downloads /app \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /app

# # Run everything after as non-privileged user.
# USER pptruser

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=build /src/build/ynab-sync /app/

ENTRYPOINT [ "/app/ynab-sync" ]