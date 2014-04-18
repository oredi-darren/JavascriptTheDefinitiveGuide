// Function expressions are sometimes defined and immediately invoked:
var tensquared = (function(x) { return x * x;}(10));

// We defined some simple functions here
function add(x,y) { return x + y; }             // same as var add = function(x,y) { return x + y; }  so you can actually do var operators = { add: add }
function subtract(x,y) { return x - y; }
function multiply(x,y) { return x * y; }
function divide(x,y) { return x / y; }

// Here's a function that takes one of the above functions
// as an argument and invokes it on two operands
function operate(operator, operand1, operand2) {
    return operator(operand1, operand2);
}

// We could invoke this function like this to compute the value (2+3) + (4*5):
var i = operate(add, operate(add, 2, 3), operate(multiply, 4, 5));

// For the sake of the example, we implement the simple functions again,
// this time using function literals within an object literal;
var operators = {
    add:        function add(x,y) { return x + y; },
    subtract:   function subtract(x,y) { return x - y; },
    multiply:   function multiply(x,y) { return x * y; },
    divide:     function divide(x,y) { return x / y; },
    pow:        Math.pow            // Works for predefined functions too
};

// This function takes the name of an operator, looks up that operator
// in the object, and then invokes it on the supplied operands
function operate2(operator, operand1, operand2) {
    if(typeof operators[operator] === "function")
        return operators[operator](operand1, operand2);
    else throw "unknown operator";
}

// Compute the value ("hello" + " " + "world") like this:
var j = operate2("add", "hello", operate2("add", " ", "world"))
// Using the predefined Math.pow() function:
var k = operate2("pow", 10, 2);