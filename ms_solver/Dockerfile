FROM python:3.10 AS build

WORKDIR /usr/src/app
RUN python -m venv /usr/src/app/venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install -r requirements.txt

FROM node:20

RUN apt update && apt install -y wget \
    && wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tgz \
    && tar -xvzf Python-3.10.0.tgz \
    && cd Python-3.10.0 \
    && ./configure --enable-optimizations \
    && make altinstall

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/venv /venv

ENV PATH="/venv/bin:$PATH"
ENV NODE_ENV=container

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3004
CMD [ "node", "app.js" ]
