
router.get("/", async (req, res, next) => {
    // req.session.email = "hola"
    // console.log("Login")
    // console.log(req.session)
    // req.session.save(function(err) {
        // session saved
        res.render("signUp"); 
    //   })

}); 

router.post("/", async (req, res, next) => {
    let name = req.body.firstName
    let apellido = req.body.lastName
    let email = req.body.email; 
    let password = req.body.password;
    let rango = 1; 
    let telefono = req.body.telefono 


    let valido = false;
    let url_registro = "";
    const response = await axios.get(url_registro); 
    let usuarios = response.data.usuario; 
    let emailCorrecto = false

    for (let i = 0; i < usuarios.length; i++) {
        if(usuario[i].email == email ){
            emailCorrecto = true
            if(usuarios[i].password == password){
                valido = true; 
                req.session.user.id = usuario[i].id
            }
        }
        
        if(valido == true){
            break; 
        }

    }

    if(valido == true){

        url_userId = `${req.session.user.id}`
        let responseUser = await axios.get(url_userId); 
        req.session.user = responseUser.data.usuario
    
        req.session.save(() =>{
            res.redirect("/");  
        })
    }else{
        let error;
        if(emailCorrecto == false){

            error = "El email es incorrecto"
            res.redirect("/login?error=" + error); 
        }else{
            error = "La contrasena es incorrecta"; 
            res.redirect("/login?error=" + error); 
        }
    }
   
}); 

module.exports = router;