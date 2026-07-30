// Apni UPI ID Yahan zaroor likhein
const MY_UPI_ID = "9354505161@ybl";

const products = [
    { id: 1, title: "CardXer Pack 1", price: 300, profit: 3500, stock: true, image: "assets/images/banner_1.jpg" },
    { id: 2, title: "CardXer Pack 2", price: 300, profit: 3500, stock: false, image: "assets/images/banner_2.jpg" },
    { id: 3, title: "CardXer Pack 3", price: 150, profit: 2200, stock: false, image: "assets/images/banner_3.jpg" },
    { id: 4, title: "CardXer Pack 4", price: 300, profit: 3500, stock: true, image: "assets/images/banner_4.jpg" },
    { id: 5, title: "CardXer Pack 5", price: 600, profit: 7000, stock: true, image: "assets/images/banner_5.jpg" },
    { id: 6, title: "CardXer Pack 6", price: 600, profit: 7000, stock: true, image: "assets/images/banner_6.jpg" },
    { id: 7, title: "CardXer Pack 7", price: 600, profit: 7000, stock: true, image: "assets/images/banner_7.jpg" },
    { id: 8, title: "Free Character Bundle", price: 0, profit: 0, stock: false, isFreeBundle: true, image: "assets/images/banner_8.jpg" }
];

let selectedProduct = null;
let paymentTimer = null;

// Website load hote hi direct products render honge
window.onload = function() {
    renderProducts();
};

function goToNextPage() {
    showPage("page2");
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function renderProducts() {
    const container = document.getElementById("productsGrid");
    if (!container) return;
    
    container.innerHTML = "";

    products.forEach(p => {
        const stockText = p.stock ? "IN STOCK" : "NOT STOCK";
        const stockClass = p.stock ? "in-stock" : "out-stock";
        const btnText = p.stock ? "BUY NOW" : "OUT OF STOCK";
        const btnDisabled = !p.stock ? "disabled" : "";

        const cardHTML = `
            <div class="big-card">
                <span class="stock-badge ${stockClass}">${stockText}</span>
                <div class="card-title">${p.title}</div>
                
                <div class="banner-wrapper">
                    <div class="red-blinking-light"></div>
                    <img src="${p.image}" alt="${p.title}" class="big-banner-img" onerror="this.src='https://via.placeholder.com/400x180?text=Banner+Missing'">
                </div>

                <button class="buy-btn ${btnDisabled}" onclick="openCheckout(${p.id})">${btnText}</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function openCheckout(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p.stock) {
        alert("Yeh product abhi Stock me nahi hai!");
        return;
    }

    selectedProduct = p;
    
    if (p.isFreeBundle) {
        document.getElementById("checkoutPriceProfit").innerText = `FREE CHARACTER BUNDLE - Rs. 0`;
    } else {
        document.getElementById("checkoutPriceProfit").innerText = `CC PRICE-${p.price} -- Profit ${p.profit}`;
    }

    document.getElementById("userGmail").value = "";
    showPage("page3");
}

function backToShop() {
    if (paymentTimer) clearTimeout(paymentTimer);
    showPage("page2");
}

// Customer Support Popup Handlers
function openCustomerSupport() {
    const supportPopup = document.getElementById("supportPopup");
    if (supportPopup) supportPopup.style.display = "flex";
}

function closeSupportPopup() {
    const supportPopup = document.getElementById("supportPopup");
    if (supportPopup) supportPopup.style.display = "none";
}

function processPayment() {
    const gmailInput = document.getElementById("userGmail").value.trim();
    
    if (!gmailInput || !gmailInput.includes("@")) {
        alert("Kripya apni sahi Gmail ID bharein!");
        return;
    }

    if (!selectedProduct) return;

    const amount = selectedProduct.price;
    
    if (amount === 0) {
        showPage("page4");
        return;
    }

    // Show Loading Screen
    showPage("pageLoading");

    // Auto open UPI app
    const note = encodeURIComponent(`CardXer Order - ${gmailInput}`);
    const upiUrl = `upi://pay?pa=${MY_UPI_ID}&pn=CardXerShop&am=${amount}&cu=INR&tn=${note}`;
    window.location.href = upiUrl;

    // 1 Minute timer before success page
    if (paymentTimer) clearTimeout(paymentTimer);
    paymentTimer = setTimeout(() => {
        showPage("page4");
    }, 60000);
     }
      
