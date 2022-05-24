const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;

router.get("/", async (req, res, next) => {

    console.log(req.query)
    if(req.session.user){
        res.redirect("/")
    }
    if(req.query.error){
        let error = req.query.error
        res.render("login", {mensaje: error}); 
    }else{
        res.render("login")
    }
   

}); 

router.post("/", async (req, res, next) => {
    try{
        let email = req.body.email; 
        let password = req.body.password; 
        let usuarios = []
      
    
        let url_login = "http://127.0.0.1:8000/api/usuarios/listar";
        const response = await axios.get(url_login);
        usuarios = response.data.usuario; 
        
        let valido = false; 
        let emailCorrecto = false

        console.log(usuarios)
    
        for (let i = 0; i < usuarios.length; i++) {
            console.log(usuarios[i].id)
            if(usuarios[i].email == email ){
                emailCorrecto = true
                if(usuarios[i].password == password){
                    valido = true; 
                    req.session.user = usuarios[i].id
                    break; 

                }
            }
            
        }
        console.log("llega a hacer antes de la validación")
        if(valido == true){
    
            url_userId = `http://127.0.0.1:8000/api/usuarios/mostrar/${req.session.user}`
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

    }catch(err){

    }
    
}); 


module.exports = router;