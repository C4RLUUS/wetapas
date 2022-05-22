const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;

router.get("/", async (req, res, next) => {

    if(req.session.user){
        res.redirect("/")
    }
    // req.session.email = "hola"
    // console.log("Login")
    // console.log(req.session)
    // req.session.save(function(err) {
        // session saved
        res.render("login"); 
    //   })

}); 

router.post("/", async (req, res, next) => {
    let email = req.body.email; 
    let password = req.body.password; 

    let url_login = "";
    const response = await axios.get(url_login); 
    let usuarios = response.data.usuario; 
    
    let valido = false; 
    let emailCorrecto = false

    for (let i = 0; i < usuarios.length; i++) {
        if(usuario[i].email == email ){
            emailCorrecto = true
            if(usuarios[i].password == password){
                valido = true; 
                req.session.user.id = usuario[i].id
            }
        }
        
        if(valido == true){
            break; 
        }

    }

    if(valido == true){

        url_userId = `${req.session.user.id}`
        let responseUser = await axios.get(url_userId); 
        req.session.user = responseUser.data.usuario
    
        req.session.save(() =>{
            res.redirect("/");  
        })
    }else{
        let error;
        if(emailCorrecto == false){

            error = "El email es incorrecto"
            res.redirect("/login/?error=" + error); 
        }else{
            error = "La contraseña es incorrecta"; 
            res.redirect("/login/?error=" + error); 
        }
    }
   
}); 


module.exports = router;