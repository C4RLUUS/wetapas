const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;


router.get("/", async (req, res) => {
    
        console.log("index")
        console.log(req.session)
   
    res.render('index')
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
    
        res.render('index', {mensaje})

    }catch(err){
        console.log(err)
    }

}); 



module.exports = router;    