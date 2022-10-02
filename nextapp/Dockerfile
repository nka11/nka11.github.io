FROM node

ARG DEV_UID=1000

RUN useradd -u $DEV_UID devuser || sed -i 's/^[a-z]*\(:x:1000:.*\)$/devuser\1/g' /etc/passwd

USER devuser

WORKDIR /app
