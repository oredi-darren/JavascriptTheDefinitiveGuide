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

var scope = "global scope";
function checkscope() {
    var scope = "local scope";
    function f()  { return scope; }
    return f();
}

checkscope();

function checkclosurescope() {
    var scope = "local scope";
    function f()  { return scope; }
    return f;
}
checkclosurescope()();

var unqiueInteger = (function() {   // Define and invoke
    var counter = 0;    // private state of function below
    return function() { return counter++; }
}());

function counter() {
    var n = 0;
    return {
        count: function() { return n++; },
        reset: function() { n = 0; }
    }
}

var c = counter(), d = counter();

function counter(n) {   // Function argument n is the private variable
    return {
        // Property getter method returns and increments private counter var.
        get count() { return n++; },
        // Property setter method doesn't allow the value of n to decrease
        set count(m) {
            if(m >= n) n = m;
            else throw Error("count can only be set to a larger value")
        }
    }
}

// The following code demonstrates the addPrivateProperty() method.
var o = {}; // Here is an empty object

// add property accessor methods getName and setName
// Ensure that only string values are allowed
addPrivateProperty(o, "Name", function(x) { return typeof x == "string"; });

// closure sharing variable
// This function returns a function that always returns v
function constfunc(v) { return function() { return v; }; }

// Create an array of constant functions
var funcs = [];
for (var i = 0; i < 10; i++) funcs[i] = constfunc(i);

// The function at array element 5 returns the value 5
funcs[5]();

// This function returns a function that always returns v
function constsharedfuncs(v) { 
    var funcs = [];
    for (var i = 0; i < 10; i++) 
        funcs[i] = function() { return i; };    // i is a closure variable so it is set to 10 after the last execution
    return funcs; 
}

var funcs = constsharedfuncs();
funcs[5]();


// length property of function returns the number of variables in a declared in a function
// This function uses arguments.callee, so it won't work in strict mode
function check(args) {
    var actual = args.length;           // The actual number of arguments
    var expected = args.callee.length;  // The expected number of arguments
    if(actual !== expected)             // Throw an exception if they differ
        throw Error("Expected " + expected + " args; got " + actual);
}

function f(x, y, z) {
    check(arguments);   // Check that the actual # of args matches expected #.
    return x + y + z;   // Now do the rest of the function normally
}

function f(y) { return this.x + y; }    // This function needs to be bound
var o = { x: 1 };                       // An object we'll bind to
var g = f.bind(o);                      // Calling g(x) invokes o.f(x)
g(2);



// Using partial application and binding to do currying
var sum = function(x,y) { return x + y };   // Return the sum of 2 args
// Create a new function like sum, but with the this value bound to null
// and the 1st argument bound to 1. This new function expects just one arg.
var succ = sum.bind(null, 1);
succ(2);

function f(y,z) { return this.x + y + z };  // another functino that adds
var g = f.bind({x:1}, 2);                   // Bind this and y
g(3);

// A Closure is a combination of a function object and a scope (a set of variable bindings) in t\which the function's variables are resolved


// Functional programming
// First, define two simple functions
var sum = function(x,y) { return x + y; };
var square = function(x) { return x * x; };

// Then use those functions with Array methods to compute mean and stddev
var data = [1,1,3,5,5];
var mean = data.reduce(sum)/data.length;

var deviations = data.map(function(x) { return x-mean; });
var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1));