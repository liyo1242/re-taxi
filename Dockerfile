FROM node:14.17-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
ARG GOOGLE_KEY
RUN echo 'REACT_APP_GOOGLE_KEY=${GOOGLE_KEY}' >> .env
RUN npm run build

FROM macbre/nginx-brotli as final
COPY --from=build /app/build /var/www/html/
COPY ./nginx_http.conf /etc/nginx/conf.d/

CMD sed -i -e s/HEROKU_PORT/"$PORT"/g /etc/nginx/conf.d/nginx_http.conf && nginx -g 'daemon off;'
