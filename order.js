import * as Goods from "./goods.js";
import * as Warehouse from "./warehouse.js";
import * as Balance from "./balance.js";

class Order {
    id;
    goods = {};

    constructor(id) {
        this.id = id;
    }

    purchase(id) {
        const def = Goods.mustFind(id);

        let g = this.goods[id]
        if (g == null) {
            this.goods[id] = g = {amount: 0};
        }

        let price = def.buy;
        if (g.amount+1 < 0) {
            price = def.sell;
        }

        const balance = Balance.getBalance();
        const x = this.sum().plus(price);
        console.log(x.toString(), balance.toString(), balance.lt(x));
        if (g.amount >= 0 && balance.lt(this.sum().neg().plus(price))) {
            return;
        }

        g.amount++;
        g.sum = new Big(g.amount).neg().mul(price);
    }

    sell(id) {
        const def = Goods.mustFind(id);

        let g = this.goods[id]
        if (g == null) {
            this.goods[id] = g = {amount: 0};
        }

        const warehouse = Warehouse.getAmount(id)
        if (warehouse < (g.amount-1)*-1) {
            return;
        }

        g.amount--;

        let price = def.sell;
        if (g.amount > 0) {
            price = def.buy;
        }

        g.sum = new Big(g.amount).neg().mul(price);
    }

    list() {
        return Object.keys(this.goods).map(id => Object.assign(this.goods[id], {id}))
    }

    sum(id=null) {
        if (id == null) {
            const s = this.list().map(x => x.sum || 0).reduce((acc, val) => new Big(acc).plus(val))
            return new Big(s);
        }

        if (this.goods[id] == null) {
            return new Big(0)
        }

        return new Big(this.goods[id].sum || 0)
    }

    amount(id) {
        if (id == null) {
            throw "missed goods id";
        }

        const x = this.goods[id]
        if (x == null) {
            return 0
        }

        return x.amount || 0;
    }
}

export function New() {
    const id = crypto.randomUUID()
    return new Order(id);
}

/**
 * @param order {Order}
 * */
export async function apply(order) {
    console.debug("apply order", order.id);
    Balance.apply(order.sum());
    order.list().forEach(x => Warehouse.change(x.id, x.amount));
}

function save() {

}