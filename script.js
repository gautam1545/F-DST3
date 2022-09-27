console.log("working...")

async function getData(){
    let response
    try{
        response = await fetch("https://dummyjson.com/products?limit=100")
    } catch(err) {
        console.error("Error while fetching: "+err)
        response = await fetch("data.json")
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
    }
    if (!response.ok) {
        console.log(response.ok)
        response = await fetch("data.json")
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
    }
    return await response.json()
}

let cardContainer = document.querySelector('#card-container')

let cart = {}
let prodData

function cartTotalQty(){
    let totalQty = 0
    for (let key in cart) {
        totalQty += cart[key].qty;
    }
    return totalQty
}

function addToCart(product_id){
    let product = prodData.products.find(prod=>prod.id==product_id)
    console.log(product)
    if(cart[product_id] == undefined){
        cart[product_id] = {...product, qty: 1}
        updateAddToCartBtn(product_id)
    } else {
        cart[product_id].qty += 1
        updateCardQty(product_id)
    }
    updateCartCount()
    updateCart()
}

function removeFromCart(product_id){
    let product = prodData.products.find(prod=>prod.id==product_id)
    console.log(product)
    if(cart[product_id] != undefined){
        if(cart[product_id].qty > 1){
            cart[product_id].qty -= 1
            updateCardQty(product_id)
        } else {
            delete cart[product_id]
            updateAddToCartBtn(product_id)
        }
    }
    updateCartCount()
    updateCart()
}

function updateCartCount(){
    let cartSpan = document.querySelector('.cart-logo-container span')   
    let totalQty = cartTotalQty()
    if(totalQty > 0){
        cartSpan.classList.remove('hide')
        cartSpan.textContent = totalQty
    } else {
        cartSpan.classList.add('hide')
        cartSpan.textContent = ""
    }
}

function filterProducts(inp){
    let query = inp.value.toLowerCase()
    cardContainer.querySelectorAll('.card').forEach(child=>{
        let id = parseInt(child.id.split("_").pop())
        let product = prodData.products.find(prod=>prod.id==id)
        // let id = child.id.replace("prod_","")
        if(!(product.title.toLowerCase().includes(query) || product.category.toLowerCase().includes(query) || product.description.toLowerCase().includes(query))){
            child.classList.add('hide')
        } else {
            child.classList.remove('hide')
        }
    })
}

function updateCardQty(id){
    let qtySpan = document.querySelector(`#prod_${id} .btn-container span`)
    qtySpan.textContent = cart[id].qty
}

function updateAddToCartBtn(id){   
    let btnContainer = document.querySelector(`#prod_${id} .btn-container`)
    console.log(btnContainer)
    if(cart[id] == undefined){
        btnContainer.innerHTML = `<button class="product-add-btn" onclick="addToCart(${id})">Add to Cart</button>`
    } else {
        btnContainer.innerHTML = `
            <div>
                <button class="product-change-btn" onclick="removeFromCart(${id})">-</button>
                <span>${cart[id].qty}</span>
                <button class="product-change-btn" onclick="addToCart(${id})">+</button>
            </div>
        `
    }

}

async function page_init(){
    console.log(prodData)
    prodData.products.map(product=>{
        let price = Math.ceil(product.price - product.discountPercentage*product.price/100)
        cardContainer.innerHTML += `
            <div id="prod_${product.id}" class="card">
                <img src="${product.thumbnail}">     
                <p class="product-title">${product.title}</p>
                <span class="product-rating">
                    ${product.rating}<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" color="#000"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </span>
                <p class="product-description">${product.description.length > 45 ? product.description.slice(0,42)+"..." : product.description}</p>
                <p class="product-price">&dollar; ${price}</p>
                <p class="product-discount">${
                    (product.discountPercentage > 0) ? `<del>&dollar;${product.price}</del> <span>${product.discountPercentage}% off</span>` : ""
                }</p>
                <div class="btn-container">
                    <button class="product-add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `
    })
}

function updateCart(){
    let cartContainer = cardContainer.querySelector('#cart-item-container')
    cartContainer.innerHTML = ''
    for (let key in cart) {
        cartContainer.innerHTML += `
            <div id="cart_item_${key}" class="cart-item">
            <img src="${cart[key].thumbnail}">
                <p>${cart[key].title}</p> 
                <p>&dollar; ${Math.ceil(cart[key].price - cart[key].price*cart[key].discountPercentage/100)}</p>
                <div>
                    <button class="product-change-btn" onclick="removeFromCart(${key})">-</button>
                    <span>${cart[key].qty}</span>
                    <button class="product-change-btn" onclick="addToCart(${key})">+</button>
                </div>
            </div>
        ` 
    }
}

function toggleCart(){
    let cc = document.querySelector('.cart-container')
    cc.classList.toggle('cart-show')
}

(async function main(){
    try{
        prodData = await getData()
    } catch(err){
        console.error("Could not fetch data: "+err)
    }
    page_init()
})();

function purchase_btn(){
        if(Object.keys(cart).length>0){
            window.alert("Purchase Sucessfull")
            window.location.reload()
        }
        else{
            window.alert("Cart Empty!!")

        }
       
}