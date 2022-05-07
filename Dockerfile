FROM nginx:latest
COPY ./index.html /usr/share/nginx/html/index.html
RUN npm install
CMD "npm run start" 