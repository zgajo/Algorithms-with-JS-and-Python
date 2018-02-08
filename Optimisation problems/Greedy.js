class Food{

    constructor(n,v,w){
        this.name = n;
        this.value = v;
        this.calories = w;
    }

    getValue(){ return this.value; }

    getCost(){ return this.calories }

    density(){ return this.getValue() / this.getCost() }

}

function buildMenu(names, values, calories){

    let menu = [];

    for(let i in values){

        menu.push(new Food(names[i], values[i], calories[i]));

    }

    return menu;

}

function greedy(items, maxCost, keyFunction){

    let itemsCopy = items.sort((a, b)=>{

        return keyFunction.call(b) - keyFunction.call(a)

    });

    let result = []
    let totalValue = totalCost = 0;
    for (i in itemsCopy){
        if( (totalCost+itemsCopy[i].getCost()) <= maxCost){
            result.push(itemsCopy[i])
            totalCost += itemsCopy[i].getCost()
            totalValue += itemsCopy[i].getValue()
        }
    }
    return [result, totalValue]



}


function testGreedy(items, constraint, keyFunction){
    let [taken, val] = greedy(items, constraint, keyFunction)
    console.log('Total value of items taken =', val)
    for(let item of taken){
        console.log('   ', item)
    }
}

function testGreedys(foods, maxUnits){
    console.log('Use greedy by value to allocate', maxUnits,
          'calories')
    testGreedy(foods, maxUnits, Food.prototype.getValue)
   
    console.log('\nUse greedy by density to allocate', maxUnits,
          'calories')
    testGreedy(foods, maxUnits, Food.prototype.density)
}


let names = ['wine', 'beer', 'pizza', 'burger', 'fries',
         'cola', 'apple', 'donut', 'cake']
let values = [89,90,95,100,90,79,50,10]
let calories = [123,154,258,354,365,150,95,195]
let foods = buildMenu(names, values, calories)


testGreedys(foods, 1000)
