const app = require('./app');
const cloudinary = require("cloudinary");
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000

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
    app.listen(PORT, () => {
        console.log(`server is working on port ${PORT}`)
    })
})
