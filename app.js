import express from "express"
import dotenv from "dotenv"
import conn from "./db.js";
import cookieParser from "cookie-parser";
import pageRoute from "./routes/pageRoute.js" 
//  router değişkenini default olarak export ettiğimiz için direkt böyle import edebildik.
import photoRoute from "./routes/photoRoute.js";
import userRoute from "./routes/userRoute.js";
import {checkUser} from "./middlewares/authMiddleware.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

dotenv.config(); //  .env içerisinde oluşturduğumuz değişkenlere ulaşabiliriz.
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
}); 
// * connection to the DB 
conn();
const app = express(); // express modülünü değişkene atarak başlatıyoruz
const port = process.env.PORT;



// * ejs template engine -->
//  views dosyası içerisindeki html dosyaları içerisinde js kodları çalıştırabileceğiz.
app.set("view engine", "ejs");

// * static files middleware(arayazılımlar) 
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}));

// * routes
app.use("*",checkUser)
app.use("/",pageRoute);
app.use("/about",pageRoute);
app.use('/photos',photoRoute);
app.use('/users',userRoute);


app.listen(port, () => {
    console.log(`Application running on:${port}`);
})