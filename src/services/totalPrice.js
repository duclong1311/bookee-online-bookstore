export const totalPrice = (carts) => {
    if (carts && carts.length > 0) {
        const itemTotal = carts.map((item) => item.quantity * item?.detail?.price);
        return itemTotal.reduce((total, num) => total + num, 0);
    }
}

