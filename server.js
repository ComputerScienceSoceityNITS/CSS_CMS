const app = require('./app');
const cloudinary = require("cloudinary");
const mongoose = require('mongoose')

const connectDataBase = require("./config/database");

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({ path: "./config/.env" });
}

//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//connecting to the database then with server
connectDataBase().then(() => {
    app.listen(3000, () => {
        console.log(`server is working...`)
    })
})
