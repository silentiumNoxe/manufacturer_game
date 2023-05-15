window.addEventListener("DOMContentLoaded", () => {
    const $nav = document.getElementById("game-nav");
    $nav.childNodes.forEach($ch => $ch.addEventListener("click", event => {
        const view = event.target.dataset.view;
        renderView(view);
    }))
})

window.addEventListener("DOMContentLoaded", () => {
    renderView("store").catch(console.error);
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

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector("[data-action='restart']").addEventListener("click", restart);
})

async function renderView(view) {
    console.debug("render", view);
    document.querySelectorAll("[data-group='view']").forEach(x => x.dataset.state = "")
    const $view = document.querySelector(`[data-view=${view}][data-group='view']`);

    $view.dataset.state = "active";
    (await import(`./view/${view}.js`)).default($view);
}

async function restart() {
    localStorage.clear();
    window.location.reload();
}