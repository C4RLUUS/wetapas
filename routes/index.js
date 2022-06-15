const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;


router.get("/", async (req, res) => {
    
        if(req.session.user){
           
            let user = req.session.user.firstName; 
            if(req.session.cart){
                let totalItems = req.session.cart.totalItems

                if(req.query.msg){
                let mensajito = req.query.msg
                res.render('index', {user, totalItems, mensajito})
                }else{

                    res.render('index', {user, totalItems})
                }
            }else{
                if(req.query.msg){
                    let mensajito = req.query.msg
                    res.render('index', {user, mensajito})
                }else{
                    
                    res.render('index', {user})
                }
            }
        }else if(req.session.cart){
           
            let totalItems = req.session.cart.totalItems
            if(req.query.msg){
                let mensajito = req.query.msg
                res.render('index', {totalItems,mensajito })
            }else{
                
                res.render('index', {totalItems})
            }
            
        }else if(!req.session.user && !req.session.cart){
            if(req.query.msg){
                let mensajito = req.query.msg
                res.render('index', {mensajito})
            }else{
                
                res.render('index')
            }
            
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

router.get("/user/mispedidos", async(req, res) => {
    try{

        if(req.session.user){
            let user = req.session.user.firstName
            let url_pedido = `http://127.0.0.1:8000/api/pedidos/user/${req.session.user.id}`
            const pedidos = await axios.get(url_pedido)
            let pedidos_user = []
            pedidos_user = pedidos.data.pedido

           
            var pedidos_productos_array = []

            Promise.all(pedidos_user.map(async item => {

                // Then put your try catch here so that it only wraps around
                // the results of the function you're awaiting...
                let id_pedido = item.id
                let productos_query = `http://127.0.0.1:8000/api/pedidoDetalles/listarpedido/${id_pedido}`
                let response
                try {
                  response = await axios.get(productos_query)
        
                } catch (err) {
                  return err;
                }
              
                // Anything else you want to do with the response...
                return response.data.pedido_detalle
              
              })).then(results => {
                // All the resolved promises returned from the map function.
                pedidos_productos_array.push(results)
                if(req.session.cart){
                    let totalItems = req.session.cart.totalItems
                    
                    return res.render('pedidos_user', {user, totalItems, pedidos_user, pedidos_productos_array})
                }else{
                    
                    return res.render('pedidos_user', {user, pedidos_user, pedidos_productos_array})
                }
            })
            

           
        }



    }catch(err){
        console.log(err)
    }
})

router.get("/user/logout", async (req, res) => {
    req.session.destroy()
    return res.redirect("/")
})



module.exports = router;    