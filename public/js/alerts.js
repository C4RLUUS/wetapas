if(document.querySelector("#alert")){

    let alert = document.querySelector("#alert")

    setTimeout(() => {
        alert.classList.add("d-none")
    }, 5000);

}

if(document.querySelector("#alerta_msg")){
    let alerta = document.querySelector("#alerta_msg")
    let background = document.querySelector(".background-shadow")

    setTimeout(() => {
        alerta.classList.toggle("d-none")
        background.classList.toggle("d-none")
    }, 5000);
}