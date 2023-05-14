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

async function renderView(view) {
    console.debug("render", view);
    const $view = document.getElementById("view");

    switch (view) {
        case "store":
            (await import("./view/store.js")).default($view);
            return
        default:
            $view.innerHTML = view;
    }
}

async function renderStore($view) {

}