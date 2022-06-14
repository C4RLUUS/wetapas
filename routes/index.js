const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;


router.get("/", async (req, res) => {
    
        console.log(req.session)
        if(req.session.user){
           
            let user = req.session.user.firstName; 
            if(req.session.cart){
                let totalItems = req.session.cart.totalItems
                
                res.render('index', {user, totalItems})
            }else{
                
                res.render('index', {user})
            }
        }else if(req.session.cart){
           
            let totalItems = req.session.cart.totalItems
            res.render('index', {totalItems})
        }else if(!req.session.user && !req.session.cart){
            
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

router.get("/user/mispedidos", async(req, res) => {
    try{

        if(req.session.user){

            let url_pedido = `http://127.0.0.1:8000/api/pedidos/user/${req.session.user.id}`
            const pedidos = await axios.get(url_pedido)
            let pedidos_user = []
            pedidos_user = pedidos.data.pedido

           
            const pedidos_productos_array = []
        
            const productos_each_pedido = async () =>{
                try{

                    pedidos_user.map( async(element) => {

                        let id_pedido = element.id
                        let productos_query = `http://127.0.0.1:8000/api/pedidoDetalles/listarpedido/${id_pedido}`
                        await axios.get(productos_query).then((response) =>{
                            console.log("Entra")
                            pedidos_productos_array = response.data.pedido_detalle
                            console.log("Array")
                            console.log(pedidos_productos_array)
                        })
                        
                    }) 
                        
                    

                }catch(err){
                    console.log(err)
                }
            }

            productos_each_pedido()


            return res.render("pedidos_user", {pedidos_user, pedidos_productos_array})
            

           
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