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
        console.log(req.body);
    
        var va_email = false
        let re_email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if(re_email.exec(email)){
            va_email = true
        }

        var va_password = false
        let re_password = /^[A-Za-z]\w{7,15}$/
        if(re_password.exec(password)){
            va_password = true
        }

        var va_telefono = false
        let re_telefono = /^\d{9}$/
        if(re_telefono.exec(telefono)){
            va_telefono = true
        }

        var va_string = false
        let re_string = /([A-Z])\w+/
        if(re_string.exec(name)){
            if(re_string.exec(apellido)){
                va_string = true 
            }
        }
    
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

        if(valido == true && emailCorrecto==true && va_email==true && va_password == true && va_telefono ==true && va_string ==true){
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
    
                error = "El email ya existe"
                res.redirect("/signup?error=" + error); 
            }

            if(va_email == false){
                error = "El email is incorrecto"
                res.redirect("/signup?error=" + error);
            }

            if(va_password == false){
                error = "La contraseña es incorrecta"
                res.redirect("/signup?error=" + error);
            }

            if(va_telefono == false){
                error = "El teléfono es incorrecto"
                res.redirect("/signup?error=" + error);
            }

            if(va_string == false){
                error = "El nombre o el apellido está incompleto"
                res.redirect("/signup?error=" + error);
            }


        }

    }catch(err){
        console.log(err)
    }

   
}); 

module.exports = router;