const listener = new EventTarget();

export function getAmount(id) {
    const warehouse = localStorage.getItem("w_"+id)
    if (warehouse == null) {
        return 0
    }

    const x = parseInt(warehouse)
    if (isNaN(x)) {
        throw "invalid amount of in warehouse"+id;
    }

    return x;
}

export function change(id, amount) {
    const warehouse = getAmount(id);
    const diff = warehouse+amount;
    if (diff < 0) {
        throw "insufficient amount";
    }
    localStorage.setItem("w_"+id, diff);
    listener.dispatchEvent(new CustomEvent("change", {detail: {id, amount: diff}}))
}

export function addEventListener(target, handler) {
    listener.addEventListener(target, handler);
}