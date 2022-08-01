"use strict"

const numberRegion = document.querySelector(`.number-region`)
const operators = document.querySelector(`.operator-region`)
const question = document.querySelector(`.question`)
const scientific = document.querySelector(`.scientific-region`)
const closeBracket = document.querySelector(`.close-bracket`)
const answerDisplay = document.querySelector(`.answer`)

//Presets the calculator input field to Zero
question.textContent = 0;

//This implements bodmas,Division, Multiplication addition and subtraction in that order.
const bodmas = (entry) => final(handleAdd(handleMultiplication(handleDivision(entry))))

//The array with which I structure the calculations
const operations = [];

//This function ensures that input and results are displayed on the screen
const displayInput = () => question.textContent = operations.flat(Infinity).join(` `);


//Handles input operations when there has been no input previously
function input1(event, operations) {

    const signs = [`+`, `*`, `/`]
    const minus = `-`
    let last = operations[operations.length - 1]
    let clicked = event.target
    let value = clicked.getAttribute(`value`)
    if (value !== null) {
        if (typeof last === `object`) input1(event, last)
        else {
            if (!last) {
                operations.push(value)
                displayInput()
            }
            if (operations.length === 1 && last === minus) {
                if (!(last.includes(`.`) && value === `.`)) {
                    operations[operations.length - 1] = `${last}${value}`
                    displayInput()
                }
            }
            if (last && (typeof Number(last) !== NaN || last === `.`) && (!signs.includes(last) && last !== minus)) {
                if (!(last.includes(`.`) && value === `.`)) {
                    operations[operations.length - 1] = `${last}${value}`
                    displayInput()
                } else {}
            }
            if (operations.length > 1 && (signs.includes(last) || last === minus)) {
                operations.push(value)
                displayInput()
            }
        }

    }
    //Displays the final result of the calculation.
    if (clicked.getAttribute(`data`) === `=`) {
        let finalResult = solve(operations)
        answerDisplay.textContent = finalResult
    }
}

//Haandles input operations pertaining to signs
function input2(event, operations) {
    let clicked = event.target
    let value = clicked.getAttribute(`data`)
    let last = operations[operations.length - 1]
    if (typeof last === `object`) {
        input2(event, last)
    } else {
        if (!last && value === `-`) {
            operations.push(value)
            displayInput()
        }
        if (last !== `-` && last && Number(last) !== NaN) {
            operations.push(value)
            displayInput()
        }
    }
}



function input3(event, operations) {
    let clicked = event.target
    let value = clicked.getAttribute(`value`)
    let last = operations[operations.length - 1]
    if (typeof last === `object`) {
        input3(event, last)
    } else {
        if (value && value !== `)`) {
            operations.push(value)
            operations.push([])
            displayInput()
        }
    }
}

//Handles closing the bracket in such a way as to allow my calculation logic process the input properly
function closeTheBracket(event, operations) {
    let clicked = event.target
    let value = clicked.getAttribute(`value`)
    console.log(value)
    let last = operations[operations.length - 1]
    console.log(typeof last, last)
    if (typeof last === `object`) {
        console.log(last[last.length - 1])
        if (last[last.length - 1] === value) {
            operations.push(value)
            displayInput()
        } else if (typeof last[last.length - 1] === `object`) {
            closeTheBracket(event, last)
        } else {
            operations.push(value)
            displayInput()
        }
    }
}


numberRegion.addEventListener(`click`, function (event) {
    input1(event, operations)
})

operators.addEventListener(`click`, function (event) {
    input2(event, operations)
})

scientific.addEventListener(`click`, function (event) {
    input3(event, operations)
})

closeBracket.addEventListener(`click`, function (event) {
    closeTheBracket(event, operations)
})


document.querySelector(`button`).addEventListener(`click`, function () {
    console.log(operations)
});























//Handles Multiplication
function handleMultiplication(valuesArray) {
    if (valuesArray.length === 1) return valuesArray
    for (let i = 1; i <= valuesArray.length - 1; i += 2) {
        if (valuesArray.includes(`*`)) {
            if (valuesArray[i] === `*`) {
                let res = valuesArray[i - 1] * valuesArray[i + 1];
                valuesArray.splice((i - 1), 3, res)
                // console.log(valuesArray)
                handleMultiplication(valuesArray)
                return valuesArray
            }
        } else return valuesArray;
    }
}

function handleDivision(valuesArray) {
    if (valuesArray.length === 1) return valuesArray
    for (let i = 1; i <= valuesArray.length - 1; i += 2) {
        if (valuesArray.includes(`/`)) {
            if (valuesArray[i] === `/`) {
                let res = valuesArray[i - 1] / valuesArray[i + 1];
                valuesArray.splice((i - 1), 3, res)
                handleDivision(valuesArray)
                return valuesArray
            }
        } else {
            console.log(valuesArray)
            return valuesArray;
        }
    }
}

function handleAdd(valuesArray) {
    // console.log(valuesArray)
    // let error = `Error`
    let res;
    if (valuesArray.length === 1) return valuesArray
    for (let i = 1; i <= valuesArray.length - 1; i += 2) {
        if (valuesArray.includes(`+`)) {
            if (valuesArray[i] === `+`) {
                if (valuesArray[i - 2] === `-`) {
                    let res = Number(valuesArray[i - 1]) - Number(valuesArray[i + 1]);
                    if (res === NaN) return error
                    valuesArray.splice((i - 1), 3, res)
                } else {
                    res = Number(valuesArray[i - 1]) + Number(valuesArray[i + 1]);
                    valuesArray.splice((i - 1), 3, res)
                    if (res === NaN) return error
                    handleAdd(valuesArray)
                    return valuesArray
                }
            }
        } else return valuesArray
    }
}

//Handles subtraction which is the final operation
function final(valuesArray) {
    // console.log(valuesArray)
    let error = `Error`
    if (valuesArray === `There was an error`) return error

    if (valuesArray.length === 1) return valuesArray[0]

    function handleSub(valuesArray) {
        for (let i = 1; i <= valuesArray.length - 1 && valuesArray.length !== 1; i += 2) {
            if (valuesArray.includes(`-`)) {
                if (valuesArray[i] === `-`) {
                    let res = Number(valuesArray[i - 1]) - Number(valuesArray[i + 1]);
                    if (res === NaN) return error;
                    valuesArray.splice((i - 1), 3, res)
                    handleSub(valuesArray)
                    return valuesArray
                }
            }
        }
    }
    // console.log([answer])
    const [answer] = handleSub(valuesArray);
    return answer
}


//This is the core function that performs the complex calculations
function solve(array) {
    // console.log(array)
    const signs = [`*`, `+`, `-`, `/`] //Remember to throw an error because of an open bracket ( - This has been done in line 104
    const advancedFunctions = [`cos(`, `sin(`, `tan(`, `(`]
    const present = array.some((each) => typeof each === `string` && advancedFunctions.includes(each))
    let result;
    let errorMessage = `There was an error`

    if (array.length === 1 && typeof Number(array[0]) !== NaN) return bodmas(array);
    if (array.length === 1 && typeof array[0] !== `number`) return errorMessage
    if (array.length > 1 && present === false) return bodmas(array)
    else {
        for (let each of array) {
            if (advancedFunctions.includes(each)) {
                let index = array.indexOf(each)
                if (array[index + 2] !== `)`) return errorMessage

                else {
                    switch (each) {
                        case `cos(`:
                            // console.log(array[index + 1])
                            result = Math.cos(solve(array[index + 1]))
                            // console.log(result, 111)
                            array.splice((index), 3, result)
                            solve(array)
                            break;

                        case `sin(`:
                            result = Math.sin(solve(array[index + 1]))
                            array.splice((index), 3, result)
                            solve(array)
                            break;

                        case `tan(`:
                            result = Math.tan(solve(array[index + 1]))
                            // console.log(result, index)
                            array.splice((index), 3, result)
                            solve(array)
                            break;

                        case `(`:
                            result = solve(array[index + 1])
                            console.log(result)
                            array.splice((index), 3, result)
                            console.log(array)
                            return solve(array)
                            break;
                    }
                    return array
                }
            }
        }
    }
};


export {
    handleDivision,
    handleMultiplication,
    handleAdd,
    final,
    solve
};