const { testCase1, testCase2 } = require('./test-cases');

function convertToDecimal(value, base) {
    return BigInt(parseInt(value, base));
}

function parseData(jsonData) {
    const { n, k } = jsonData.keys;
    const points = [];
    
    for (const key in jsonData) {
        if (key !== "keys") {
            const x = BigInt(key);
            const base = parseInt(jsonData[key].base);
            const value = jsonData[key].value;
            const y = convertToDecimal(value, base);
            points.push({ x, y });
        }
    }
    
    return { n, k, points };
}

function lagrangeInterpolation(points, k) {
    const selectedPoints = points.slice(0, k);
    let secret = 0n;
    
    for (let i = 0; i < k; i++) {
        let numerator = 1n;
        let denominator = 1n;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                numerator *= (0n - selectedPoints[j].x);
                denominator *= (selectedPoints[i].x - selectedPoints[j].x);
            }
        }
        
        secret += selectedPoints[i].y * numerator / denominator;
    }
    
    return secret;
}

function shamirSecretSharing(jsonData) {
    const { n, k, points } = parseData(jsonData);
    const secret = lagrangeInterpolation(points, k);
    return secret;
}

function runTests() {
    const { points: points1 } = parseData(testCase1);
    console.log("Test 1 Points:", points1);
    console.log("Test 1:", shamirSecretSharing(testCase1));
    
    const { points: points2 } = parseData(testCase2);
    console.log("Test 2 Points:", points2);
    console.log("Test 2:", shamirSecretSharing(testCase2));
}

runTests();

module.exports = {
    shamirSecretSharing,
    convertToDecimal,
    parseData,
    lagrangeInterpolation
};