from node

WORKDIR /app

copy . .

expose 8080

run npm install

CMD [ "echo", "hello world!" ]

CMD [ "npm", "start" ]