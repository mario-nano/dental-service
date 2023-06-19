const mongoose = require('mongoose');
const { mongo, env, dbName } = require('./vars');

// set mongoose Promise
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
    mongoose.set('debug', true);
}

exports.connect = () => {
    mongoose
        .connect(mongo.uri, {
            keepAlive: 1,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: dbName,
        })
        .then(() => console.log('mongoDB connected...'));
    return mongoose.connection;
};
