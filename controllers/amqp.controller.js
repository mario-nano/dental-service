const amqp = require('amqplib/callback_api');
const amqpServer = process.env.AMQP_SERVER
const amqpUser = process.env.AMQP_USER
const amqpPassword = process.env.AMQP_PASSWORD
// Declare amqp connections
let amqpConn = null;
let pubChannel = null;

module.exports = {
    InitConnection: (fnFinish) => {
        // Start connection with Rabbitmq
        console.log('Trying to connect to RabbitMQ ...')
        console.log(amqpServer)
        console.log(amqpUser)
        console.log(amqpPassword)

        const amqpOpt = { credentials: require('amqplib').credentials.plain(amqpUser, amqpPassword) };

        amqp.connect(amqpServer, amqpOpt, (err, conn) => {
            // If connection error
            if (err) {
                console.error("[AMQP]", err.message);
                return setTimeout(this, 1000);
            }
            conn.on("error", function(err) {
                console.log("ERROR", err);
                if (err.message !== "Connection closing") {
                    console.error("[AMQP] conn error", err.message);
                }
            });
            conn.on("close", function() {
                // Reconnect when connection was closed
                console.error("[AMQP] reconnecting");
                return setTimeout(() => { module.exports.InitConnection(fnFinish) }, 1000);
            });
            // Connection OK
            console.log("[AMQP] connected");
            amqpConn = conn;
            // Execute finish function
            fnFinish();
        });
    },
    StartConsumer: (queue, amqpAddDoctor) => {
        // Create a channel for queue
        amqpConn.createChannel(function(err, ch) {
            if (closeOnErr(err)) return;

            ch.on("error", function(err) {
                console.error("[AMQP] channel error", err.message);
            });

            ch.on("close", function() {
                console.log("[AMQP] channel closed");
            });

            // Set prefetch value
            ch.prefetch(process.env.CLOUDAMQP_CONSUMER_PREFETCH ? process.env.CLOUDAMQP_CONSUMER_PREFETCH : 10);

            // Connect to queue
            ch.assertQueue(queue, { durable: true }, function(err, _ok) {
                if (closeOnErr(err)) return;
                // Consume incoming messages
                ch.consume(queue, processMsg, { noAck: false });
                console.log("[AMQP] Worker is started");
            });
            function processMsg(msg) {
                // Process incoming messages and send them to fnConsumer
                // Here we need to send a callback(true) for acknowledge the message or callback(false) for reject them
                amqpAddDoctor(msg, function(ok) {
                    try {
                        ok ? ch.ack(msg) : ch.reject(msg, true);
                    } catch (e) {
                        closeOnErr(e);
                    }
                });
            }
        });
    },
    StartPublisher: () => {
        // Init publisher
        amqpConn.createConfirmChannel(function(err, ch) {
            if (closeOnErr(err)) return;

            ch.on("error", function(err) {
                console.error("[AMQP] channel error", err.message);
            });

            ch.on("close", function() {
                console.log("[AMQP] channel closed");
            });

            // Set publisher channel in a var
            pubChannel = ch;
            console.log("[AMQP] Publisher started");
        });
    },
    PublishMessage: (queue, routingKey, content, options = {}) => {
        // Verify if pubChannel is started
        if (!pubChannel) {
            console.error("[AMQP] Can't publish message. Publisher is not initialized. You need to initialize them with StartPublisher function");
            return;
        }
        // convert string message in buffer
        const message = Buffer.from(content, "utf-8");
        try {
            // Publish message to queue
            pubChannel.sendToQueue(queue, message,
                (err) => {
                    if (err) {
                        console.error("[AMQP] publish", err);
                        pubChannel.connection.close();
                        return;
                    }
                    console.log("[AMQP] message delivered");
                });
        } catch (e) {
            console.error("[AMQP] publish", e.message);
        }
    }
};

function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
}
