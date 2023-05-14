import * as Goods from "../goods.js";
import * as Warehouse from "../warehouse.js"
import * as Translation from "../translation/en.js";
import * as Order from "../order.js";

export default function ($view) {
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