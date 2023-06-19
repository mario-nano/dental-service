const express = require('express');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const axios = require('axios');
const mongoose = require('./config/mongoose');
const AmqpController = require("./controllers/amqp.controller");
const morgan = require('morgan');
const path = require('path');
const ENV = process.env.NODE_ENV || "development";
const HOST = "dental-service.azurewebsites.net";
const PORT = 80;
const serviceName = process.env.SERVICE_NAME || "dental-service";
const apiGatewayHostname = process.env.API_GATEWAY_HOSTNAME;
const apiGatewayPort = process.env.API_GATEWAY_PORT;
const dentalController = require('./controllers/dental.controller')

// Create Express service
const service = express();

// Parse requests of content-type 'application/json'
service.use(express.urlencoded({ extended: true }));
service.use(express.json());
// HTTP request logger
service.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
service.options('*', cors());
service.use(cors());

// Connect to database
mongoose.connect();

// Import entity models
const db = require("./models");

// Import routes
service.get('/', function(req, res) {
    res.json({'message': 'Welcome to Dental-service'});
});
require("./routes/dental.routes")(service);

// Catch all non-error handler for api (i.e., 404 Not Found)
service.use('/*', function (req, res) {
    res.status(404).json({ 'message': 'Endpoint not found!' });
});

AmqpController.InitConnection(() => {
    console.log('Connection to RabbitMQ broker was successful.');

    // start consumer worker when the connection to rabbitmq has been made
    AmqpController.StartConsumer('dental-service/add-doctor', amqpAddDoctor);
    // start Publisher when the connection to rabbitmq has been made
    AmqpController.StartPublisher();
});

function amqpAddDoctor(msg, callback) {
    dentalController.addDoctor(msg);
    // we tell rabbitmq that the message was processed successfully
    callback(true);
}

service.listen(PORT, function(err) {
    axios({
        method: "POST",
        url: `http://${apiGatewayHostname}:${apiGatewayPort}/register`,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            serviceName: serviceName,
            protocol: "http",
            host: HOST,
            port: PORT,
            enabled: true
        },
    }).then((response) => {
        console.log(response.data);
    });

    if (err) throw err;
    console.log(`${serviceName} started on port ` + PORT);
});

module.exports = service;
