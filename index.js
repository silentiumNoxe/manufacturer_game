window.addEventListener("DOMContentLoaded", () => {
    const $nav = document.getElementById("game-nav");
    $nav.childNodes.forEach($ch => $ch.addEventListener("click", $elem => {
        document.getElementById("view").dataset.view = $elem.target.dataset.view;
    }))
})

window.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(records => {
        console.debug("observer triggered")
        const record = records.filter(x => x.type === "attributes" && x.attributeName === "data-view")[0]
        renderView(record.target.dataset.view);
    })

    observer.observe(document.getElementById("view"), {attributes: true})
})

window.addEventListener("DOMContentLoaded", () => {
    const view = document.getElementById("view").dataset.view;
    renderView(view);
})

window.addEventListener("DOMContentLoaded", async () => {
    const Balance = await import("./balance.js")

    document.querySelector("[data-type='money']").innerText = Balance.getBalance() + " USD";

    Balance.addEventListener("balance", e => {
        console.debug("balance event");
        document.querySelector("[data-type='money']").innerText = e.detail + " USD";
    })

    Balance.init();
})

function renderView(view) {
    console.debug("render", view);
    const $view = document.getElementById("view");

    switch (view) {
        case "store":
            renderStore($view);
            return
        default:
            $view.innerHTML = view;
    }
}

async function renderStore($view) {
    const Goods = await import("./goods.js")
    const Warehouse = await import("./warehouse.js")
    const Translation = await import("./translation/en.js")
    const Order = await import("./order.js")
    $view.innerHTML = "";

    let order = Order.New();
    let applyOrder = new EventTarget();

    function buy(id) {
        order.purchase(id);
        redraw(id)
    }

    function sell(id) {
        order.sell(id);
        redraw(id);
    }

    function redraw(id) {
        const $applyOrder = document.getElementById("apply-order");
        $applyOrder.innerText = "Buy/Sell "+order.sum().toFixed(2);

        const $info = document.querySelector(`[data-type='info'][data-id='${id}']`);
        $info.innerText = `${order.amount(id)}:${order.sum(id).toFixed(2)}`;
    }

    const $accept = document.createElement("button")
    $accept.id = "apply-order";
    $accept.classList.add("blue")
    $accept.dataset.action = "accept";
    $accept.innerText = $accept.DEFAULT_PROMPT = "Buy/Sell 0.00"
    $accept.dataset.order = order.id;
    $accept.addEventListener("click", e => {
        Order.apply(order);
        order = Order.New();
        e.target.innerText = e.target.DEFAULT_PROMPT;
        applyOrder.dispatchEvent(new CustomEvent("apply"));
    })
    $view.append($accept)

    const $container = document.createElement("section")
    $container.classList.add("container")
    $view.append($container)

    Goods.Raw.forEach(x => {
        const $card = document.createElement("div")
        $card.classList.add("card")
        $card.dataset.type = "goods";

        const $header = document.createElement("header")
        $header.classList.add("horizontal")

        const $info = document.createElement("div")
        $info.dataset.type = "info";
        $info.innerText = $info.DEFAULT_PROMPT = "0:0.00";
        $info.dataset.id = x.id;
        applyOrder.addEventListener("apply", () => $info.innerText = $info.DEFAULT_PROMPT);

        const $sell = document.createElement("button")
        $sell.classList.add("red", "no-decor")
        $sell.dataset.action = "sell"
        $sell.innerText = "-";
        $sell.addEventListener("click", () => sell(x.id))

        const $buy = document.createElement("button")
        $buy.classList.add("green", "no-decor")
        $buy.dataset.action = "buy"
        $buy.innerText = "+";
        $buy.addEventListener("click", () => buy(x.id))

        $header.append($sell, $info, $buy)

        const $body = document.createElement("div")
        $body.classList.add("body")
        const $img = document.createElement("img")
        $img.src = `assets/${x.id}.jpg`
        $img.addEventListener("click", () => buy(x.id))
        $body.append($img)

        const $footer = document.createElement("footer")
        const $amount = document.createElement("div")
        $amount.dataset.type = "amount";
        $amount.innerText = Warehouse.getAmount(x.id)+"";
        Warehouse.addEventListener("change", e => {
            if (e.detail.id !== x.id) {
                return;
            }

            $amount.innerText = e.detail.amount+"";
        })

        const $group = document.createElement("div")
        $group.dataset.group = "1";

        const $name = document.createElement("div")
        $name.innerText = Translation.Goods(x.id);

        const $price = document.createElement("div")
        $price.innerHTML = `<span class="red">${x.buy}</span>:<span class="green">${x.sell}</span>`

        $group.append($name, $price)
        $footer.append($amount, $group)
        $card.append($header, $body, $footer)

        $container.append($card)
    })
}