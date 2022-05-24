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

router.get("/carrito/direcciones", async (req, res) => {
  console.log(req.session)
  if(!req.session.cart){
    res.redirect("/productos")
  }else{
    if(req.session.cart.totalItems <= 0){

    res.redirect("/productos")
  }
}
  


  if(!req.session.user){
    res.redirect("/login")
  }

  res.render("direcciones")

}); 

router.post("/carrito/direcciones", async (req, res) =>{
  try{

    let name = req.body.firstName
    let apellido = req.body.lastName
    let telefono = req.body.telefono
    let dni = req.body.dni
    let pais = req.body.pais
    let provincia = req.body.provincia
    let ciudad = req.body.ciudad
    let postcode = req.body.postcode
    let direccion = req.body.direccion

    //validar
    let url_crear_direccion = "http://127.0.0.1:8000/api/direcciones/crear"
    const response = await axios.post(url_crear_direccion, {
      id_user:req.session.user.id, 
      pais:pais, 
      proviencia:provincia, 
      ciudad:ciudad, 
      postcode:postcode, 
      direccion1:direccion, 
      telefono:telefono, 
      dni:dni,
      firstName:name, 
      lastName:apellido, 
      deleted:0
    })
    let direccionRes = response.data.direccion
    req.session.direccion = {direccion: direccionRes}
    req.session.save( () => {

      res.redirect("/productos") 
    })

  }catch(err){
    console.log(err)
  }

}); 

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