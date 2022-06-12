const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;

router.get("/", async (req, res, next) => {
  
    if(req.session.user){
        res.redirect("/")
    }
    if(req.query.error){
        let error = req.query.error
        if(req.session.cart){
            let totalItems = req.session.cart.totalItems
            res.render('signup', {totalItems, error})
        }else if(!req.session.cart){
            res.render("signup", {error}); 
        }
    }else{
        if(req.session.cart){
            let totalItems = req.session.cart.totalItems
            res.render('signup', {totalItems})
        }else if(!req.session.cart){
            res.render("signup"); 
        }
    }
   

}); 

router.post("/", async (req, res, next) => {

    try{
        let name = req.body.firstName
        let apellido = req.body.lastName
        let email = req.body.email; 
        let password = req.body.password;
        let telefono = req.body.telefono 
    
    
    
        let valido = true;
        //validar
        let url_usuarios = `http://127.0.0.1:8000/api/usuarios/verificar/${email}`;
        const response = await axios.get(url_usuarios); 
        let usuarios = response.data.usuario; 
        let emailCorrecto = false
        if(usuarios.length == 0){
            emailCorrecto = true
        }
        console.log("Longitud del array de usuarios")
        console.log(usuarios.length)
        console.log(emailCorrecto)
        console.log(valido)

        if(valido == true && emailCorrecto==true){
            console.log("Entró en el registro")
            let url_user_registro ="http://127.0.0.1:8000/api/usuarios/crear"; 
           const registroUser = await axios.post(url_user_registro, {
               firstName: name, 
               lastName: apellido, 
               email: email, 
               password: password, 
               rango: 1, 
               telefono: telefono, 
               deleted: 0
           }).then((response) => {
               console.log(response.data.message)
               console.log(response.data.usuario)
               req.session.user = response.data.usuario
               req.session.save( () => {
                    res.redirect("/")
               })
           })
        }else{
            let error;
            if(emailCorrecto == false){
    
                error = "El email es incorrecto"
                res.redirect("/signup?error=" + error); 
            }else{
                error = "La contrasena es incorrecta"; 
                res.redirect("/signup?error=" + error); 
            }
        }

    }catch(err){
        console.log(err)
    }

   
}); 

module.exports = router;