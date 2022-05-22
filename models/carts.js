module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function(item, id) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = {item: item, cantidad: 0, precio: 0};
        }
        cartItem.cantidad++;
        cartItem.precio = cartItem.item.precio * cartItem.cantidad;
        this.totalItems++;
        this.totalPrice += cartItem.item.precio;
    };

    this.remove = function(id) {
        this.totalItems -= 1;
        this.totalPrice -= this.items[id].item.precio;
        if(this.items[id].cantidad == 1){
            
            delete this.items[id];
        }else{
            this.items[id].precio -= this.items[id].item.precio
            this.items[id].cantidad -= 1
        }
        
    };
    
    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};