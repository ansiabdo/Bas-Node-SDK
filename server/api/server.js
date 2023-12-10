
var express = require("express")
var basAuth = require('./server-sdk/bas_auth.js');
var basPayment = require('./server-sdk/bas_payment.js');
var cors = require('cors');
var morgan = require('morgan');
var dotevnv = require("dotenv");


dotevnv.config();


const app = express();
app.use(cors());
app.options('*', cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny')) //* Only used for print the action URL

// Use routers
app.use('/auth', basAuth);
app.use('/order', basPayment);
app.use('/callback/:orderid', basPayment);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use('/', (req, res) => {
    res.send("hello");
})