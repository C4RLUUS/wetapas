const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;
var Cart = require("../models/carts")

const url_productosActivos = "http://127.0.0.1:8000/api/productos/listar/activos"

router.get("/", async (req, res) => {
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


router.get("/add", async (req, res) => {
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

router.get("/remove", async (req, res) => {
    var productId = req.query.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  req.session.save( () =>{

    res.redirect('/carrito');
  }) 
    
}) 

// DIRECCIONES
router.get("/direcciones", async (req, res) => {
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
    try{
      let url_traer_direcciones_User = `http://127.0.0.1:8000/api/direcciones/listar/activos/${req.session.user.id}`
      const response = await axios.get(url_traer_direcciones_User)
      let direcciones = response.data.direccion
      //poder utilizar las direcciones ya creadas con solo un click
      console.log(direcciones)
      res.render("direcciones", {direcciones})
  
    }catch(err){
      console.log(err)
    }
  
  }); 
  
  router.post("/direcciones", async (req, res) =>{
    try{
      if(req.body.idDireccion){
        console.log(req.body.idDireccion)
        let id = req.body.idDireccion
        let url = `http://127.0.0.1:8000/api/direcciones/mostrar/${req.session.user.id}/${id}`
        const response = await axios.get(url)
        let direccion = response.data.direccion[0]
        req.session.direccion = direccion
        req.session.save( () => {
    
          res.redirect("/productos/pedido") 
        })
  
      }else{
  
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
        let direccionRes = response.data.direccion[0]
        req.session.direccion = direccionRes
        req.session.save( () => {
    
          res.redirect("/carrito/pedido") 
        })
      }
  
  
    }catch(err){
      console.log(err)
    }
  
  }); 
  
//   PEDIDO
  router.get("/pedido", async (req, res) => {
    try{
      let query = "http://127.0.0.1:8000/api/productos/listar/activos/"
      const response = await axios.get(query)
      let products = response.data.producto
  
      let ids = []
      products.forEach(element => {
        ids.push(element.id)
      });
  
      console.log(req.session)
      let direccion = req.session.direccion
      let cart = req.session.cart
      let user = req.session.user
    
      res.render("pedidos", {user, cart, direccion, ids})
  
    }catch(err){
      console.log(err)
    }
  
  })
  
  router.post("/pedido", async (req, res) => {
  
    console.log(req.session)
    let direccion = req.session.direccion
    let cart = req.session.cart
    let user = req.session.user
  
    res.render("pedidos", {user, cart, direccion})
  
  })

module.exports = router;