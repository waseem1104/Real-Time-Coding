# Real time coding

Real time coding est une plateforme développée principalement en _React js_ permettant à un grand groupe de motos de mettre en place un système d'échange instantané afin de renforcer sa communication avec ses clients.

## Installation
 
Pour installer le projet :

```sh
cd server/src
npm i
docker compose up -d --build 
docker compose exec server node migrate.js
docker compose exec server npm start
```
Aller ensuite sur http://localhost:3000 !

## Technos

- ReactJS
- Node JS
- Socket.io
- Postgres