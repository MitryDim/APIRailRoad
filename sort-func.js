// sort-func.js
module.exports = (a, b) => {
    // Define the order in which the tests should run
    console.log(a.name);
    console.log(b.name);
    const testOrder = ['user.test','train.test' ];

    // Get the index of each test in the testOrder array
    const aIndex = testOrder.indexOf(a.title);
    const bIndex = testOrder.indexOf(b.title);

    // Compare the indices and return the appropriate value
    if (aIndex < bIndex) {
        return -1;
    }
    if (aIndex > bIndex) {
        return 1;
    }
    return 0;
};

require('./test/user.test.js')
require('./test/trainstation.test.js')
