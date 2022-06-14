const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;
var Cart = require("../models/carts")
const nodemailer = require('nodemailer');

const url_productosActivos = "http://127.0.0.1:8000/api/productos/listar/activos"

router.get("/", async (req, res) => {
  let carritoExiste = false;
  if(req.session.user){
    let user = req.session.user.firstName; 
    carritoExiste = true
    if(req.session.cart){
        let totalItems = req.session.cart.totalItems
        var cart = new Cart(req.session.cart);
        let productos = cart.getItems(); 
        let totalPrice = parseFloat(req.session.cart.totalPrice).toFixed(2)
      res.render('carrito', {
        productos, totalItems, totalPrice, user, carritoExiste 
      });
   
    }else{
      
      let totalItems = 0
        let productos = null
        let totalPrice = 0

      res.render("carrito", {user, productos, totalItems, totalPrice, carritoExiste})
    }
}else if(req.session.cart){
  let totalItems = req.session.cart.totalItems
  var cart = new Cart(req.session.cart);
  let productos = cart.getItems(); 
  let totalPrice = parseFloat(req.session.cart.totalPrice).toFixed(2)
  carritoExiste = true
    res.render("carrito", {totalItems, productos, totalPrice, carritoExiste})
}else if(!req.session.user && !req.session.cart){
        let totalItems = 0
        let productos = null
        let totalPrice = 0
    res.render("carrito", {productos, totalItems,totalPrice, carritoExiste}); 
} 
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
  
        let name = req.body.nombre
        let apellido = req.body.apellido
        let telefono = req.body.telefono
        let dni = req.body.dni
        let pais = req.body.pais
        let provincia = req.body.provincia
        let ciudad = req.body.ciudad
        let postcode = req.body.postcode
        let direccion = req.body.direccion

        // var va_string = false
        // let re_string = /([A-Z])\w+/
        // if(re_string.exec(name)){
        //     if(re_string.exec(apellido)){
        //       if(re_string.exec(direccion)){
        //         va_string = true 
        //       }
    
        //     }
        // }

        var va_telefono = false
        let re_telefono = /^\d{9}$/
        if(re_telefono.exec(telefono)){
            va_telefono = true
        }

        var va_dni = false
        let letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
        let re_dni = /^\d{8}[A-Z]$/
        if( re_dni.exec(dni) ) {
          if(dni.charAt(8) == letras[(dni.substring(0, 8))%23]){
            va_dni = true
          }
        }

        var va_postcode = false
        let re_postcode = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/
        if(re_postcode.exec(postcode)){
          va_postcode = true
        }



        if( va_telefono == true && va_postcode == true && va_dni == true){

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
          }).then((response) => {

            let direccionRes = response.data.direccion[0]
            req.session.direccion = direccionRes
            req.session.save( () => {
        
              res.redirect("/carrito/pedido") 
            })
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

          // if(va_string == false){
          //   error = "El nombre o el apellido o la dirección es incorrecta"
          //   res.redirect("/carrito/direcciones?error=" + error)
          // }

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
      if(req.session.direccion && req.session.user && req.session.cart){

        let query = "http://127.0.0.1:8000/api/productos/listar/activos/"
        const response = await axios.get(query)
        let products = response.data.producto
    
        let ids = []
        products.forEach(element => {
          ids.push(element.id)
        });
    
        let direccion = req.session.direccion
        let cart = req.session.cart
        let usuario = req.session.user
  

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
  

    try{

      var id_carrito
      let url_crear_carrito = "http://127.0.0.1:8000/api/carritos/crear"
      const result_carrito = await axios.post(url_crear_carrito, {
        id_user: req.session.user.id
      }).then((response) => {
        id_carrito = response.data.carrito.id
      })

      var productos = []
      
      
 
      for(var i in req.session.cart.items){
        productos.push([i, req.session.cart.items[i]])
      }
      
      let url_crear_prodcuto_carrito = "http://127.0.0.1:8000/api/carritosProductos/crear"

      const producto_detalle = async () =>{
        try{

          console.log("Se queda fuera?")
          
          productos.map(async(element) => {
            
             await axios.post(url_crear_prodcuto_carrito, {
              id_carrito: id_carrito, 
              id_producto: element[1].item.id, 
              cantidad:element[1].cantidad
            })
    
          })
        }catch(err){
          console.log(err)
        }
      }
      // await Promise.all(productos.map( async(element) =>{
        
      
      // }))
      producto_detalle()
    

      let id_direccion = req.session.direccion.id
      var id_pedido
      let url_crear_pedido= "http://127.0.0.1:8000/api/pedidos/crear"
       await axios.post(url_crear_pedido, {
          id_user:req.session.user.id, 
          id_carrito:id_carrito, 
          id_direccion:id_direccion, 
          current_state:"Email enviado", 
          precio_total:req.session.cart.totalPrice, 
          productos_total:req.session.cart.totalItems
      }).then((response => {
        id_pedido = response.data.pedido.id;
      }))

  


      let url_crear_pedido_detalle = "http://127.0.0.1:8000/api/pedidoDetalles/crear"
      const pedido_detalle = async () =>{
        try{

    
          
          productos.map(async(element) => {
            
             await axios.post(url_crear_pedido_detalle, {
              id_pedido: id_pedido, 
              id_producto: element[1].item.id, 
              nombre_producto:element[1].item.nombre, 
              cantidad_producto:element[1].cantidad, 
              precio_producto:element[1].item.precio
            })
    
          })

          delete req.session.cart 
          delete req.session.direccion
          // return res.redirect("/")
        }catch(err){
          console.log(err)
        }
      }
    pedido_detalle()
      
    var transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      tls: {
         ciphers:'SSLv3'
      },
      auth: {
          user: 'icarluus@outlook.com',
          pass: 'Imagar@2022'
      }
  });
  
  // setup e-mail data, even with unicode symbols
//   var mailOptions = {
//       from: 'icarluus@outlook.com', // sender address (who sends)
//       to: 'icarluus@outlook.com', // list of receivers (who receives)
//       subject: 'Hello ', // Subject line
//       text: 'Hello world ', // plaintext body
//       html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }

//     console.log('Message sent: ' + info.response);
// });

    return res.redirect("/")
    

    }catch(err){

    }
  
  }); 
module.exports = router;