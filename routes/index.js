const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const axios = require('axios').default;


router.get("/", async (req, res) => {

    res.render('index')
}); 

router.post("/", async (req, res) =>{
    var postcodes = []
    let url_postcodes = "http://127.0.0.1:8000/api/postcodes/listar"; 
    let response = await axios.get(url_postcodes)
    postcodes = response.data.postcode
    
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

    res.render('index', {mensaje})
}); 



module.exports = router;    