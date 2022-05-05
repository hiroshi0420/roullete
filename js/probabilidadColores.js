//probabilidades color

const array =   ['Red', 'Black', 'Green'];  // used values in radomization
const weights = [  49.5 ,    49.5 ,  1 ];  // specific items probability (5 + 2 + 3 = 10)

const createDistribution = (array, weights, size) => {
    const distribution = [];
    const colorsArray = [];
    const sum = weights.reduce((a, b) => a + b);
    const quant = size / sum;
    for (let i = 0; i < array.length; ++i) {
        const limit = quant * weights[i];
        for (let j = 0; j < limit; ++j) {
            distribution.push(i);
        }
    }
    //return distribution;

    for (let i = 0; i < distribution.length -1; ++i) {
        const index = randomIndex(distribution);
        console.log(array[index]);  // random value located in the array
        colorsArray.push(array[index])
    }
    
    console.log('colorsArray',colorsArray)
    return colorsArray;

};

const randomIndex = (distribution) => {
    const index = Math.floor(distribution.length * Math.random());  // random index
    return distribution[index];  
};


// Usage example:



//const distribution = createDistribution(array, weights, 10);  // 10 - describes distribution array size (it affects on precision)


