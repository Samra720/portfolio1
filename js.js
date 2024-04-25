// my js file of code
// var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
// var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//     return new bootstrap.Tooltip(tooltipTriggerEl);
// })

function filterSelection(category) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let container = document.getElementById("gallery");
    let elements = container.children;
    if (category === 'all') {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.setProperty('display', 'flex', 'important');
        }
    } else {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains(category)) {
                elements[i].style.setProperty('display', 'block', 'important');
            } else {
                elements[i].style.setProperty('display', 'none', 'important');
            }
        }
    }
};

document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchFunction();
        event.preventDefault();
    }
});
function searchFunction() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
        let elements = document.getElementById("gallery").getElementsByClassName("card");
    for (let i = 0; i < elements.length; i++) {
        let elementClasses = elements[i].classList;
        if (elementClasses.contains(searchTerm)) {
            elements[i].style.setProperty('display', 'block', 'important');
        } else {
            elements[i].style.setProperty('display', 'none', 'important');
        }
    }
    document.getElementById("searchInput").value = "";
};

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem("loggedInUser")) {
        document.getElementById("loginButton").innerText = "Logout";

        let jsonArrayString = JSON.parse(localStorage.getItem('loggedInUser'));
        const slicedArray = jsonArrayString.slice(1);
        let totalPrice = 0;

        for (let i = 0; i < slicedArray.length; i++) {
            totalPrice += slicedArray[i].price;
        }

        let totalPriceElement = document.getElementById("totalPrice");
        totalPriceElement.innerText = "Total Price: $" + totalPrice.toFixed(2);

        for (let i = 0; i < slicedArray.length; i++) {
            let cartItemsElement = document.getElementById("cartItems");
            let newItem = document.createElement("div");
            let itemName = slicedArray[i].name;
            let itemPrice = slicedArray[i].price;

            newItem.innerHTML = itemName + " - $" + itemPrice.toFixed(2) + " <button class='btn btn-danger btn-sm removeItem'>Remove</button>";
            cartItemsElement.appendChild(newItem);

            let removeButton = newItem.querySelector(".removeItem");
            removeButton.addEventListener("click", removeItem);
            updateCartEmptyMessage();
        }
    } else {
        document.getElementById("loginButton").innerText = "login";
        document.getElementById("cartEmptyMessage").innerText = "You haven't added anything to your cart yet!";
    }
});

function addToCart(button) {
    if (!isLoggedIn()) {
        alert("Log in to own the Cart!");
        return;
    }

    const itemNameElement = button.closest(".item").querySelector(".itemName");
    const itemName = itemNameElement.innerText;
    const itemPrice = parseFloat(button.closest(".item").querySelector(".price").innerText);

    if (!isItemInCart(itemName)) {
        let totalPriceElement = document.getElementById("totalPrice");
        let totalPrice = parseFloat(totalPriceElement.innerText.split("$")[1]);

        if (isNaN(totalPrice)) {
            totalPrice = 0;
        }

        totalPrice += itemPrice;
        totalPriceElement.innerText = "Total Price: $" + totalPrice.toFixed(2);

        const existingArrayString = localStorage.getItem('loggedInUser');
        const existingArray = existingArrayString ? JSON.parse(existingArrayString) : [];
        existingArray.push({ name: itemName, price: itemPrice });
        localStorage.setItem('loggedInUser', JSON.stringify(existingArray));

        let cartItemsElement = document.getElementById("cartItems");
        let newItem = document.createElement("div");
        let itemPriceFormatted = itemPrice.toFixed(2);

        newItem.innerHTML = itemName + " - $" + itemPriceFormatted + " <button class='btn btn-danger btn-sm removeItem'>Remove</button>";
        cartItemsElement.appendChild(newItem);
        button.innerText = "Added to cart!";

        let removeButton = newItem.querySelector(".removeItem");
        removeButton.addEventListener("click", removeItem);
        removeButton.addEventListener("click", removeItemText);
        updateCartEmptyMessage();

        function removeItemText() {
            button.innerText = "Add to cart";
        }
    } else {
        alert("This item has already been added to cart");
    }
}

function isItemInCart(itemName) {
    let existingArray = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!existingArray) return false;
    return existingArray.some(item => item.name === itemName);
}

function removeItem() {
    let item = this.closest("div");
    let itemName = item.innerText.split(" - ")[0];
    let itemPrice = parseFloat(item.innerText.match(/\d+\.\d+/)[0]);

    let totalPriceElement = document.getElementById("totalPrice");
    let totalPrice = parseFloat(totalPriceElement.innerText.split("$")[1]);
    totalPrice -= itemPrice;
    totalPriceElement.innerText = "Total Price: $" + totalPrice.toFixed(2);

    let existingArray = JSON.parse(localStorage.getItem('loggedInUser'));

    existingArray = existingArray.filter(cartItem => cartItem.name !== itemName || cartItem.price !== itemPrice);

    localStorage.setItem('loggedInUser', JSON.stringify(existingArray));

    item.remove();

    updateCartEmptyMessage();
}

document.getElementById("loginButton").addEventListener("click", function() {
    if (localStorage.getItem("loggedInUser")) {
        localStorage.removeItem("loggedInUser");
        document.getElementById("loginButton").innerText = "Login";
        alert("You have been logged out.");
        location.reload();
    } else {
        let userID = prompt("Enter your ID (numbers only):");
        if (!userID || isNaN(userID)) {
            alert("Error: The ID should consist of numbers only.");
            return;
        }
        let password = prompt("Enter your password:");
        let user = [{
            id: userID,
            password: password
        }];
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        document.getElementById("loginButton").innerText = "Logout";
        alert("You have been logged in.");
    }
});


document.getElementById("showCartButton").addEventListener("click", function() {
    document.getElementById("cartDrawer").style.right = "0";
});
document.getElementById("closeCartButton").addEventListener("click", function() {
    document.getElementById("cartDrawer").style.right = "-300px";
});


function isLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
}

function updateCartEmptyMessage() {
    let cartItems = document.querySelectorAll("#cartItems > div");
    let cartEmptyMessage = document.getElementById("cartEmptyMessage");
    if (cartItems.length === 0) {
        cartEmptyMessage.style.display = "block";
    } else {
        cartEmptyMessage.style.display = "none"; 
    }
}

let addToCartButtons = document.querySelectorAll(".addToCart");
addToCartButtons.forEach(function(button) {
    button.addEventListener("click", addToCart);
});

let removeButtons = document.querySelectorAll(".removeItem");
removeButtons.forEach(function(button) {
    button.addEventListener("click", removeItem);
});

updateCartEmptyMessage();

