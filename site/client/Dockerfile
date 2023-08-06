FROM node:latest AS build-step
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /app/dist/* /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
