const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
let app = express();
// import the CORS system
var cors = require('cors');
let http = require('http').createServer(app);
let io = require('socket.io')(http);


// enable CORS for all routes
app.use(cors());


var port = process.env.PORT || 4041;

app.use(express.static(__dirname + '/public'));

const adminRoutes = require("./routes/adminRoutes");
const practitionerRoutes = require("./routes/practitionerRoutes");
const userRoutes = require("./routes/userRoutes");


//const connectionString = "mongodb+srv://medicine:test123@sit737.jj6ox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectionString = "mongodb://mongo:27017/sit780";
//const connectionString = "mongodb://localhost:27017/sit780";
// "mongodb+srv://CovidTrackingRecord:test123@sit737.jj6ox.mongodb.net/ctr?retryWrites=true&w=majority";
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(passport.initialize());

// set passport to use our passport config file
require("./config/passport")(passport);

//Load the routes for the different databases
app.use("/api", adminRoutes);
app.use("/api", practitionerRoutes);
app.use("/api", userRoutes);

mongoose.connect(connectionString).catch((e) => {
    console.error(`Cannot connect to MongoDB.  Error Message: `, e.message);
}, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
});
// END OF MONGO CONNECT

//socket test
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    setInterval(() => {
        socket.emit('number', parseInt(Math.random() * 10));
    }, 1000);

});



// Start the backend listener
// This needs to be the last thing that server.js does, otherwise it hangs here listening for events
var server = app.listen(port, function() {
    var host = server.address().address;
    console.log("Website is listening at", host, port);
});


//this is only needed for Cloud foundry 
require("cf-deployment-tracker-client").track();