# build environment
FROM node:14.15.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
ARG APP_VER
ARG DOCKER_VER
RUN echo 'REACT_APP_VERSION=${APP_VER}' >> .env
RUN cat .env
RUN npm run build:${DOCKER_VER}

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]