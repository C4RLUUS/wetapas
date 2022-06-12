// const { resolveAny } = require('dns');
const express = require('express');
const router = express.Router();
const session = require('express-session')
const axios = require('axios').default;



const url_productosActivos = "http://127.0.0.1:8000/api/productos/listar/activos"
var producto

router.get("/", async (req, res) => {
    try{
        let productos = []; 
      
        const response = await axios.get(url_productosActivos); 
            
        productos = response.data.producto; 
            // console.log(productos)
        
            if(req.session.user){
                let user = req.session.user.firstName; 
                if(req.session.cart){
                    let totalItems = req.session.cart.totalItems
                    res.render("productos", {user, totalItems, productos})
                }else{
                    res.render("productos", {user,productos})
                }
            }else if(req.session.cart){
                let totalItems = req.session.cart.totalItems
                res.render("productos", {totalItems, productos})
            }else if(!req.session.user && !req.session.cart){
                res.render("productos", {productos})
            }
            
       
    }catch(err){
        console.log(err)
    }
}); 

router.post("/add-review", async(req, res) => {
    if(!req.session.user){
        res.redirect("/login")
    }else{
        console.log("review")
        console.log(producto)
        console.log(req.body); 
        let url_crearOpinion = "http://127.0.0.1:8000/api/reviews/crear"

        // validar Campos

        let user_id = req.session.user.id
        let producto_id = producto.id
        let desc = req.body.desc
        let rating = parseInt(req.body.rating)
        
        try{
            const response = await axios.post(url_crearOpinion, {
                id_user:user_id, 
                id_producto:producto_id, 
                descripcion: desc, 
                rating:rating, 
                deleted:0
            }).then((response) => {
                let msg = response.data.message
                console.log(msg)
                res.redirect(`/productos/${producto_id}`)
            })
            
        }catch(err){
            console.log(err)
        }
    }

})

// router.get("/carrito", async (req, res) => {
//     if (!req.session.cart) {
//         return res.render('carrito', {
//           productos: null, 
//           totalPrice: 0,
//           totalItems: 0
//         });
//       }
//       var cart = new Cart(req.session.cart);
//       res.render('carrito', {
//         productos: cart.getItems(),
//         totalPrice: cart.totalPrice,
//         totalItems: cart.totalItems
//       });
//     }); 


// router.get("/carrito/add", async (req, res) => {
//     try{
    
//         var productId = req.query.id;
//         var cart = new Cart(req.session.cart ? req.session.cart : {});
//         const response = await axios.get(url_productosActivos); 
            
//         productos = response.data.producto; 
//         var product = productos.filter(function(item) {
//           return item.id == productId;
//         });
//         cart.add(product[0], productId);
//         req.session.cart= cart;
//         req.session.save( () => {
//             res.redirect('/productos');
//         })
//     }catch(err){

//     }
// });

// router.get("/carrito/remove", async (req, res) => {
//     var productId = req.query.id;
//   var cart = new Cart(req.session.cart ? req.session.cart : {});

//   cart.remove(productId);
//   req.session.cart = cart;
//   req.session.save( () =>{

//     res.redirect('/productos/carrito');
//   }) 
    
// }) 

// router.get("/carrito/direcciones", async (req, res) => {
//   console.log(req.session)
//   if(!req.session.cart){
//     res.redirect("/productos")
//   }else{
//     if(req.session.cart.totalItems <= 0){

//     res.redirect("/productos")
//   }
// }
//   if(!req.session.user){
//     res.redirect("/login")
//   }
//   try{
//     let url_traer_direcciones_User = `http://127.0.0.1:8000/api/direcciones/listar/activos/${req.session.user.id}`
//     const response = await axios.get(url_traer_direcciones_User)
//     let direcciones = response.data.direccion
//     //poder utilizar las direcciones ya creadas con solo un click
//     console.log(direcciones)
//     res.render("direcciones", {direcciones})

//   }catch(err){
//     console.log(err)
//   }

// }); 

// router.post("/carrito/direcciones", async (req, res) =>{
//   try{
//     if(req.body.idDireccion){
//       console.log(req.body.idDireccion)
//       let id = req.body.idDireccion
//       let url = `http://127.0.0.1:8000/api/direcciones/mostrar/${req.session.user.id}/${id}`
//       const response = await axios.get(url)
//       let direccion = response.data.direccion[0]
//       req.session.direccion = direccion
//       req.session.save( () => {
  
//         res.redirect("/productos/pedido") 
//       })

//     }else{

//       let name = req.body.firstName
//       let apellido = req.body.lastName
//       let telefono = req.body.telefono
//       let dni = req.body.dni
//       let pais = req.body.pais
//       let provincia = req.body.provincia
//       let ciudad = req.body.ciudad
//       let postcode = req.body.postcode
//       let direccion = req.body.direccion
//       //validar
//       let url_crear_direccion = "http://127.0.0.1:8000/api/direcciones/crear"
//       const response = await axios.post(url_crear_direccion, {
//         id_user:req.session.user.id, 
//         pais:pais, 
//         proviencia:provincia, 
//         ciudad:ciudad, 
//         postcode:postcode, 
//         direccion1:direccion, 
//         telefono:telefono, 
//         dni:dni,
//         firstName:name, 
//         lastName:apellido, 
//         deleted:0
//       })
//       let direccionRes = response.data.direccion[0]
//       req.session.direccion = direccionRes
//       req.session.save( () => {
  
//         res.redirect("/productos/pedido") 
//       })
//     }


//   }catch(err){
//     console.log(err)
//   }

// }); 

// router.get("/pedido", async (req, res) => {
//   try{
//     let query = "http://127.0.0.1:8000/api/productos/listar/activos/"
//     const response = await axios.get(query)
//     let products = response.data.producto

//     let ids = []
//     products.forEach(element => {
//       ids.push(element.id)
//     });

//     console.log(req.session)
//     let direccion = req.session.direccion
//     let cart = req.session.cart
//     let user = req.session.user
  
//     res.render("pedidos", {user, cart, direccion, ids})

//   }catch(err){
//     console.log(err)
//   }

// })

// router.post("/pedido", async (req, res) => {

//   console.log(req.session)
//   let direccion = req.session.direccion
//   let cart = req.session.cart
//   let user = req.session.user

//   res.render("pedidos", {user, cart, direccion})

// })


router.get("/:id", async (req, res) => {
        try{
            let url_productoPorId =`http://127.0.0.1:8000/api/productos/mostrar/${req.params.id}`
            const response = await axios.get(url_productoPorId); 
            producto = response.data.producto
            console.log(producto);
            
            let opiniones =[] 
            let url_opiniones_del_producto = `http://127.0.0.1:8000/api/reviews/listar/produtos/${req.params.id}`
            const opinion_query = await axios.get(url_opiniones_del_producto); 
            opiniones = opinion_query.data.review

           
            for (let i = 0; i < opiniones.length; i++) {
                let url_nombre_user = `http://127.0.0.1:8000/api/usuarios/mostrar/${opiniones[i].id_user}`
                let result = await axios.get(url_nombre_user)
                let nombre = result.data.usuario.firstName
                opiniones[i].nombre_user = nombre
            }

            if(req.session.user){
                let user = req.session.user.firstName; 
                if(req.session.cart){
                    let totalItems = req.session.cart.totalItems
                    res.render("productoDetalle", {user, totalItems, producto, opiniones})
                }else{
                    res.render("productoDetalle", {user, producto, opiniones})
                }
            }else if(req.session.cart){
                let totalItems = req.session.cart.totalItems
                res.render("productoDetalle", {totalItems, producto, opiniones})
            }else if(!req.session.user && !req.session.cart){
                res.render("productoDetalle", {producto, opiniones}); 
            }

        }catch(err){
            console.log(err)
        }
}); 


module.exports = router;