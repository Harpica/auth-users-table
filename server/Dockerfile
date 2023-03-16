FROM node:16 as build-stage

WORKDIR /server
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2
FROM node:16-alpine

COPY --from=build-stage /server/dist ./dist
COPY --from=build-stage /server/package.json ./
COPY --from=build-stage /server/prisma ./
RUN npm install --omit=dev && npx prisma generate

CMD npx prisma migrate deploy && npm run start