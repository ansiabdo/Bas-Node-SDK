var express = require("express")
var userinfo = require('./userinfo.js');
var payment = require('./payment.js');
var cors = require('cors');
var morgan = require('morgan');
// var dotevnv = require("dotenv");

require('dotenv').config();

// dotevnv.config();


const app = express();
app.use(cors());
app.options('*', cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny')) //* Only used for print the action URL

// Use routers
app.use('/auth', userinfo);
app.use('/order', payment);
app.use('/callback/:orderid', payment);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use('/', (req, res) => {
    res.send("hello");
})