FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
RUN mkdir /app/data
COPY --from=build-stage /app/public/data /app/data
COPY nginx.conf /etc/nginx/nginx.conf