const express = require('express');
const app = express();
const app_router = require('./routes/app_route');
const connectDB = require('./config/db_connection');
require("dotenv").config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(require("./middlewares/errormiddleware"));


app.use('/api',app_router);
const PORT = process.env.PORT;

app.listen(PORT,() => {
    console.log(`Server is running on port: ${PORT}`);
})