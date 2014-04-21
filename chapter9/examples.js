// range.js: A class representing a range of values.

// This is a factory function that returns a new range object.
function range(from, to) {
    // Use the inherit() function to create an object that inherits from the
    // prototype object defined below. The prototype object is stored as
    // a property of this function, and defines the shared methods (behavior)
    // for all range objects.
    var r = inherit(range.methods);

    // Store the start and end points (state) of this new range object.
    // These are noninherited properties that are unique to this object.
    r.from = from;
    r.to = to;

    // Finally return the new object
    return r;
}

// This prototype object defines methods inherited by all range objects
range.methods = {
    // Return true if x in in the range, false otherwise
    // This method works for textual and Date ranges as well as numeric.
    includes: function(x) {
        return this.from <= x && x <= this.to;
    },
    // Invoke f once for each integer in the range.
    // This method works only for numeric ranges.
    foreach: function(f) {
        for(var x = Math.ceil(this.from); x <= this.to; x++) f(x);
    },
    // Return a string representation of the range
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
}

// Here are example uses of a range object.
var r = range(1, 3);     // Create a range object
r.includes(2);
//r.foreach(console.log); The console.log function only works when the receiver (this) is the console (in fact, it's browser dependent).
r.foreach(console.log.bind(console));
console.log(r);

// range2.js: Another class representing a range of values.

// This is a constructor function that initializes new Range objects.
// Note that it does not create or return the object. It initializes this.

function Range(from, to) {
    // Store the start and end points (state) of this new range object
    // These are non inherited properties that are unique to this object.
    this.from = from;
    this.to = to;
}

// All Range objects inherit from this object
// Note that the property name must be prototype for this to work.
Range.prototype = {
    // Return true if x in in the range, false otherwise
    // This method works for textual and Date ranges as well as numeric.
    includes: function(x) {
        return this.from <= x && x <= this.to;
    },
    // Invoke f once for each integer in the range.
    // This method works only for numeric ranges.
    foreach: function(f) {
        for(var x = Math.ceil(this.from); x <= this.to; x++) f(x);
    },
    // Return a string representation of the range
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
};
var r = new Range(1, 3);     // Create a range object
r.includes(2);
r.foreach(console.log.bind(console));
console.log(r);

var parent =  {
    // Return true if x in in the range, false otherwise
    // This method works for textual and Date ranges as well as numeric.
    includes: function(x) {
        return this.from <= x && x <= this.to;
    },
    // Invoke f once for each integer in the range.
    // This method works only for numeric ranges.
    foreach: function(f) {
        for(var x = Math.ceil(this.from); x <= this.to; x++) f(x);
    },
    // Return a string representation of the range
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
};

// This is a factory function that returns a new range object.
function range(from, to, parent) {
    // Use the inherit() function to create an object that inherits from the
    // prototype object defined below. The prototype object is stored as
    // a property of this function, and defines the shared methods (behavior)
    // for all range objects.
    var r = inherit(parent);

    // Store the start and end points (state) of this new range object.
    // These are noninherited properties that are unique to this object.
    r.from = from;
    r.to = to;

    // Finally return the new object
    return r;
}

function Range(from, to) {
    // Store the start and end points (state) of this new range object
    // These are non inherited properties that are unique to this object.
    this.from = from;
    this.to = to;
}

// All Range objects inherit from this object
// Note that the property name must be prototype for this to work.
Range.prototype = parent;

var F = function() {};  // This is a function object
var p = F.prototype;    // This is the prototype object associated with it.
var c = p.constructor;  // This is the function associated with the prototype
c === F;                 // F.prototype.constructor ==F for any function

var o = new F();
o.constructor === F;