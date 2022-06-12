let btn_menu_cabecera = document.querySelector(".menu-btn-cabecera"); 
let menu = document.querySelector(".menu-txt")

btn_enventos() 

function btn_enventos(){
    btn_menu_cabecera.addEventListener("click", menu_deploy)

}

function menu_deploy(){
    menu.classList.toggle("d-none")
}