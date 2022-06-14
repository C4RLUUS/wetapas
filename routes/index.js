const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;


router.get("/", async (req, res) => {
    
    console.log(req.session)
        if(req.session.user){
            console.log("Hay user")
            let user = req.session.user.firstName; 
            if(req.session.cart){
                let totalItems = req.session.cart.totalItems
                console.log("Hay totalItems?")
                res.render('index', {user, totalItems})
            }else{
                console.log("Solo user?")
                res.render('index', {user})
            }
        }else if(req.session.cart){
            console.log("carrito?")
            let totalItems = req.session.cart.totalItems
            res.render('index', {totalItems})
        }else if(!req.session.user && !req.session.cart){
            console.log("No hay nada???")
            res.render('index')
        }
    
        
}); 

router.post("/", async (req, res) =>{

    try{
        var postcodes = []
        let url_postcodes = "http://127.0.0.1:8000/api/postcodes/listar"; 
        let response = await axios.get(url_postcodes)
        postcodes = response.data.postcode
        
        console.log(postcodes)
        var valido = false; 
        postcodes.forEach(element => {
            if(element.code == req.body.codepost){
                valido = true
            }
        });
    
        var mensaje = "Al código postal que has introducido no podemos hacer entregas:("; 
        if(valido == true){
            mensaje = "A ese código postal sí podemos hacer entregas, disfrútalo 😉"; 
        }
        if(req.session.user){
            let user = req.session.user.firstName; 
            if(req.session.cart){
                let totalItems = req.session.cart.totalItems
                res.render('index', {user, totalItems, mensaje})
            }else{
                res.render('index', {user, mensaje})
            }
        }else if(req.session.cart){
            let totalItems = req.session.cart.totalItems
            res.render('index', {totalItems, mensaje})
        }else if(!req.session.user && !req.session.cart){
            res.render('index', {mensaje, mensaje})
        }

    }catch(err){
        console.log(err)
    }

}); 



module.exports = router;    