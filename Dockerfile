# FIXME: formatowanie kodu, wersje

FROM node:22.8.0-alpine3.19

RUN apk --no-cache add curl
RUN npm install -g http-server

# ADD     ./entrypoint.sh    /

EXPOSE  8080

ENTRYPOINT ["/bin/sh"]
# ENTRYPOINT ["/entrypoint.sh"]