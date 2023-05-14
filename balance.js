const TABLE = "balance";

const listener = new EventTarget();

export function init() {
    if (localStorage.getItem("init") === "1") {
        return;
    }

    if (!get().eq(0)) {
        return
    }

    apply(10);
    localStorage.setItem("init", "1");
}

/**
 * @return Big
 * */
function get() {
    const item = localStorage.getItem(TABLE);
    if (item == null) {
        return new Big(0);
    }

    return new Big(item);
}

/**
 * @return Big
 * */
export function getBalance() {
    return get();
}

export function apply(sum) {
    const balance = get()
    if (new Big(sum).lt(0) && balance.lt(sum)) {
        throw "insufficient funds";
    }

    localStorage.setItem(TABLE, balance.plus(sum).toString());
    listener.dispatchEvent(new CustomEvent("balance", {detail: get()}))
}

export function addEventListener(target, handler) {
    listener.addEventListener(target, handler);
}