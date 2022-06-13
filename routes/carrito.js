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
      
      if(req.session.user && req.session.cart){
        let user = req.session.user.firstName; 
        let totalItems = req.session.cart.totalItems
        if(req.query.error){
          let error = req.query.error
          res.render("direcciones", {direcciones, user, totalItems, error})
        }else{

          res.render("direcciones", {direcciones, user, totalItems})
        }
      }else{
        res.redirect("/")
      }
  
    }catch(err){
      console.log(err)
    }
  
  }); 
  
  router.post("/direcciones", async (req, res) =>{
    console.log(req.body)
    try{
      if(req.body.idDireccion){
        let id = req.body.idDireccion
        let url = `http://127.0.0.1:8000/api/direcciones/mostrar/${req.session.user.id}/${id}`
        const response = await axios.get(url)
        let direccion = response.data.direccion[0]
        req.session.direccion = direccion
        req.session.save( () => {
    
          res.redirect("/carrito/pedido") 
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

        var va_string = false
        let re_string = /([A-Z])\w+/
        if(re_string.exec(name)){
            if(re_string.exec(apellido)){
              if(re_string.exec(direccion)){
                va_string = true 
              }
    
            }
        }

        var va_telefono = false
        let re_telefono = /^\d{9}$/
        if(re_telefono.exec(telefono)){
            va_telefono = true
        }

        var va_dni = false
        let letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
        let re_dni = /^\d{8}[A-Z]$/
        if( re_dni.exec(dni) ) {
          if(dni.charAt(8) != letras[(valor.substring(0, 8))%23]){
            va_dni = true
          }
        }

        var va_postcode = false
        let re_postcode = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/
        if(re_postcode.exec(postcode)){
          va_postcode = true
        }



        if(va_string == true && va_telefono == true && va_postcode == true && va_dni == true){

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
        }else{
          let error;
          if(va_dni == false){
            error = "El dni es incorrecto"
            res.redirect("/carrito/direcciones?error=" + error)
          }

          if(va_postcode == false){
            error = "El código postal es incorrecto"
            res.redirect("/carrito/direcciones?error=" + error)
          }

          if(va_string == false){
            error = "El nombre o el apellido o la dirección es incorrecta"
            res.redirect("/carrito/direcciones?error=" + error)
          }

          if(va_telefono == false){
            error = "El teléfono es incorrecto"
            res.redirect("/carrito/direcciones?error=" + error)
          }
        }
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
      let usuario = req.session.user

      if(req.session.user && req.session.cart){
        let user = req.session.user.firstName; 
        let totalItems = req.session.cart.totalItems
        res.render("pedidos", {usuario, cart, user, totalItems, direccion, ids})
      }else{
        res.redirect("/")
      }
  
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