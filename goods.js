export class Goods {
    id;
    img;
    buy;
    sell;
    recipe = [];

    /**
     * @param id {string}
     * @param buy {number}
     * @param sell {number}
     * @param recipeItems {recipeItems}
     * */
    constructor(id, buy, sell, ...recipeItems) {
        this.id = id;
        this.buy = buy;
        this.sell = sell;
        this.recipe = recipeItems;
    }

    isRaw() {
        return this.recipe.length === 0;
    }
}

class RecipeItem {
    amount;
    id;
}

export const Cardboard = new Goods("cardboard", 0.25, 0.20)
export const Plastic = new Goods("plastic", 0.5, 0.4)

export const All = [
    Cardboard,
    Plastic
]

export const Raw = All.filter(x => x.isRaw())

const indexed = {}
All.forEach(x => indexed[x.id] = x)

export function find(id) {
    return indexed[id]
}

export function mustFind(id) {
    const x = find(id)
    if (x == null) {
        throw `goods by id ${id} not found`
    }
    return x
}