/*const mongoose = require('mongoose');
const DB_URI = 'mongodb+srv://edge:edge@cluster0.5ym33.mongodb.net/edge?retryWrites=true&w=majority';


function connect() {
    return new Promise((resolve, reject) => {

        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose; //added to readme steps
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
                .then(() => {
                    mongoose.connect(DB_URI, { useNewUrlParser: true, useCreateIndex: true })
                        .then((response, err) => {
                            if (err) return reject(err);
                            resolve();
                        })
                })
        } else {
            mongoose.connect(DB_URI, { useNewUrlParser: true, useCreateIndex: true })
                .then((response, err) => {
                    if (err) return reject(err);
                    resolve();
                })
        }
    });
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };*/