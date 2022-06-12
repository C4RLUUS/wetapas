let btn = document.querySelector(".add-direction"); 
let new_direction = document.querySelector("#new-form")
var add = false; 

// console.log(btn)
// console.log(new_direction)
// console.log("add :" + add)

eventos_btn()

function eventos_btn(){

    btn.addEventListener("click", newForm)
}

function newForm(){
    if(add == false){
        // console.log("entro? false")
        btn.disabled = true
        new_direction.classList.remove("d-none")
        add = true
        // console.log("acabó")
    }
}