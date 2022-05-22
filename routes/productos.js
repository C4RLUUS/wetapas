const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;
var Cart = require("../models/carts")



const url_productosActivos = "http://127.0.0.1:8000/api/productos/listar/activos"

router.get("/", async (req, res) => {
    try{
        let productos = []; 
      
        const response = await axios.get(url_productosActivos); 
            
        productos = response.data.producto; 
            // console.log(productos)
        res.render("productos", {productos})
            
       
    }catch(err){
        console.log(err)
    }
}); 

router.get("/carrito", async (req, res) => {
    if (!req.session.cart) {
        return res.render('carrito', {
          productos: null, 
          totalPrice: 0,
          totalItems: 0
        });
      }
      var cart = new Cart(req.session.cart);
      res.render('carrito', {
        productos: cart.getItems(),
        totalPrice: cart.totalPrice,
        totalItems: cart.totalItems
      });
    }); 


router.get("/carrito/add", async (req, res) => {
    try{
    
        var productId = req.query.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        const response = await axios.get(url_productosActivos); 
            
        productos = response.data.producto; 
        var product = productos.filter(function(item) {
          return item.id == productId;
        });
        cart.add(product[0], productId);
        req.session.cart= cart;
        req.session.save( () => {
            res.redirect('/productos');
        })
    }catch(err){

    }
});

router.get("/carrito/remove", async (req, res) => {
    var productId = req.query.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  req.session.save( () =>{

    res.redirect('/productos/carrito');
  }) 
    
}) 

router.get("/:id", async (req, res) => {
        try{
            let url_productoPorId =`http://127.0.0.1:8000/api/productos/mostrar/${req.params.id}`
            const response = await axios.get(url_productoPorId); 
            let producto = response.data.producto
            console.log(producto); 
            res.render("productoDetalle", {producto}); 

        }catch(err){
            console.log(err)
        }
}); 


module.exports = router;