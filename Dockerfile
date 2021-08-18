from node

WORKDIR /app

copy . .

expose 8080
run rm -rf node_modules/
run npm update
run npm install
run npm install mongoose
run npm install bcrypt
run npm install cors --save

CMD [ "echo", "hello world!" ]

CMD [ "node", "server.js" ]