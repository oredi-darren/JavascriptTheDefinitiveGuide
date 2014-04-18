var p = {
    // x and y are regular read-write data properties.
    x: 1.0,
    y: 1.0,

    // r is a read-write accessor property with getter and setter.
    // Don't forget to put a comma after accessor methods.
    get r() { return Math.sqrt(this.x * this.x + this.y * this.y); },
    set r(newvalue) {
        var oldValue = Math.sqrt(this.x * this.x + this.y * this.y);
        var ratio = newvalue / oldValue;
        this.x *= ratio;
        this.y *= ratio;
    },
    // theta is a read-only accessor property with getter only.
    get theta() { return Math.atan2(this.y, this.x); }
};

var q = inherit(p);         // Create a new object that inherits getters and setters
q.x = 0, q.y = 0;           // Create q's own data properties
console.log(q.r);           // And use the inherited accessor properties
console.log(q.theta);

// This object generates strictly increasing serial numbers
var serialnum = {
    // This data property holds the next serial number.
    // The $ in the property name hints that it is a private property.
    $n: 0,

    // Return the current value and increment it
    get next() { return this.$n++; },

    // Set a new value of n, but only if it is larger than current
    set next(n) {
        if(n >= this.$n) this.$n = n;
        else throw "serial number can only be set to a larger value";
    }
};

// This object has accessor properties that return random numbers.
// The expression "random.octet", for example, yields a random number
// between 0 and 255 each time it is evaluated.
var random = {
    get octet() { return Math.floor(Math.random() * 256); },
    get uint16() { return Math.floor(Math.random() * 65536); },
    get int16() { return Math.floor(Math.random() * 65536) - 32768; }
};

Object.getOwnPropertyDescriptor({x:1}, "x");
Object.getOwnPropertyDescriptor(random, "octet");

// Returns undefined for inherited properties and properties that don't exist.
Object.getOwnPropertyDescriptor({}, "x");           // undefined, no such prop
Object.getOwnPropertyDescriptor({}, "toString");    // undefined, inherited
Object.getOwnPropertyDescriptor(Object.getPrototypeOf({}), "toString"); // get inherit prototype

var o = {}; // Start with no properties at all

// Add a non enumerable data property x with value 1
Object.defineProperty(o, "x", {
    value: 1,
    writable: true,
    enumerable: false,
    configurable: true
});


// Check that the property is there but is non enumerable
o.x
Object.keys(o);

// Now modify the property x so that it is read-only
Object.defineProperty(o, "x", {
    writable: false
});

// Try to change the value of the property
o.x = 2;    // Fails silently or throws TypeError in strict mode
o.x

// The property is still configurable, so we can change its value like this:
Object.defineProperty(o, "x", {
    value: 2
});
o.x

// Now change x from a data property to an accessor property
Object.defineProperty(o, "x", {
    get: function() { return 0; }
});

var p = Object.defineProperties({}, {
        x: { value: 1, writable: true, enumerable: false, configurable: true },
        y: { value: 1, writable: true, enumerable: false, configurable: true },
        r: { get: function() { return Math.sqrt( this.x * this.x + this.y * this.y ) }, enumerable: false, configurable: true }
    }
);

var p = { x:1 };            // Define a property object.
var o = Object.create(p);   // Create an object with that prototype.
p.isPrototypeOf(o);         // o inherits from prototype
Object.prototype.isPrototypeOf(o);  // p inherits from Object.prototype