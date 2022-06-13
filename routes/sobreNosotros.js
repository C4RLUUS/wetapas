const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;
const nodemailer = require('nodemailer')

router.get("/", async (req, res) => {

    

    res.render("sobrenosotros")
})

router.post("/sendEmail", async (req, res) => {

    let smtpTransport = nodemailer.createTransport({
        host:"smtp-mail.outlook.com", 
        port:587, 
        secure:false, 
        auth:{
            user:"icarluus@outlook.com", 
            pass:"Imagar@2022"
        }, 
        tls:{
            rejectUnauthorized:false
        }
    })

    let contentHTML = `
    <h1>HolaMundilloo</h1>    `

    const info = await smtpTransport.sendMail({
        from:"icarluus@outlook.com",
        to:"icarluus@outlook.com", 
        subject:"Prueba de Email",
        text:"Hola mundoo"

    })

    console.log("info email")
    console.log(info)

    res.redirect("/")

})

module.exports = router;    