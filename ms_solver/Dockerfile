FROM python:3.10 AS build

WORKDIR /usr/src/app
RUN python -m venv /usr/src/app/venv
ENV PATH="/usr/src/app/venv/bin:$PATH"

RUN . /usr/src/app/venv/bin/activate

COPY requirements.txt .
RUN pip install -r requirements.txt

FROM node:20

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/venv /usr/src/app/venv

ENV PATH="/usr/src/app/venv/bin:$PATH"
ENV NODE_ENV=container

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3004
CMD [ "node", "app.js" ]
