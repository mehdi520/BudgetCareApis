const https = require('https');
const express = require('express');
const fs = require('fs');
const app = express();
const app_router = require('./routes/app_route');
const connectDB = require('./config/db_connection');
require("dotenv").config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(require("./middlewares/errormiddleware"));


app.use('/api',app_router);
app.use('/',(req,res)=>{
    res.send('API is running');
});
const PORT = process.env.PORT;

const options = {
    key: fs.readFileSync('./cert/private.key'),
    cert: fs.readFileSync('./cert/certificate.cert'),
    // ca: fs.readFileSync('/path/to/ca_bundle.crt') // Combine intermediate certs if you have any
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
  
// app.listen(PORT,() => {
//     console.log(`Server is running on port: ${PORT}`);
// })