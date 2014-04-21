// inherit() returns a newly created object that inherits properties from the 
// prototype object p. It uses the ECMAScript 5 function Object.create() if
// it is defined, and otherwise falls back to an older technique
function inherit(p) {
	if(p == null) throw TypeError();	// p must be a non-null object
	if(Object.create)					// If Object.create() is defined...
		return Object.create(p);		// then just use it.

	var t = typeof p;					// Otherwise do some more type checking
	if(t !== "object" && t !== "function")	throw TypeError();
	function f() {};					// Define a dummy constructor function.
	f.prototype = p;					// Set its prototype property to p.
	return new f();						// Use f() to create an "heir" of p.
}


/*
*   Define an extend function that copies the properties of is second and subsequent arguments into its first argument.
*   We work around an IE bug here: in many version of IE, the for/in loop
*   won't enumerate an enumerable property of o if the prototype of o has
*   a nonenumerable property by the same name. This means that properties
*   like toString are not handled correctly unless we explicitly check for them.
 */
var extend = function() {           // Assign the return value of this function
    // First check for the presence of the bug before patching it.
    for(var p in {toString:null}) {
        // If we get here, then the for/in loop works correctly and we return a simple version of the extend() function

        return function extend(o) {
            for(var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for(var prop in source) o[prop] = source[prop];
            }
            return o;
        };
    }

    // If we get here, it means that for/in loop did not enumerate
    // the toString property of the test object. So return a version
    // of the extend() function that explicitly tests for the nonenumerable
    // properties of Object.prototype.
    return function patch_extend(o) {
        for(var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            // Copy all the enumerable properties
            for(var prop in source) o[prop] = source[prop];

            // And now check the special-case properties
            for(var j = 0; j < protoprops.length; j++) {
                prop = protoprops[j];
                if(source.hasOwnProperty(prop)) o[prop] = source[prop];
            }
        }
    };

    // This is the list of special-case properties we check for
    var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString"];
};

/*
 *   Copy the enumerable properties of p to o, and return o.
 *   If o and p have a property by the same name, o's property is left alone.
 *   This function does not handle getters and setters or copy attributes
 */
function merge(o, p) {
    for(prop in p) {                            // For all props in p
        if(o.hasOwnProperty(prop)) continue;    // Except those already in o.
        o[prop] = p[prop];                      // Add the property to o
    }
    return o;
}

/*
 *   Remove properties from o if there is not a property with the same name in p
 *   Return o.
 */
function restrict(o, p) {
    for(prop in o) {                        // For all props in o
        if(!(prop in p)) delete o[prop];    // Delete if not in p
    }
    return o;
}

/*
 *   For each property of p, delete the property with the same name from o.
 *   Return o.
 */
function subtract(o, p) {
    for(prop in p) {    // For all props in p
        delete o[prop]; // Delete if in o (deleting a nonexistent prop is harmless)
    }
    return o;
}

/*
 *   Return a new object that holds the properties of both o and p.
 *   If o and p have a properties by the same name, the values from o are used.
 */
function union(o, p) {
    return extend(extend({}, p), o);
}

/*
 *   Return a new object that holds only the properties of o that also appear
 *   in p. This is something like the intersection of o and p, but the values of
 *   the properties in p are discarded
 */
function intersection(o, p) {
    return restrict(extend({}, o), p);
}

/*
 *  Return an array that holds the names of the enumerable own properties of o.
 */
function keys(o) {
    if(typeof o !== "object")   throw TypeError();  // Object argument required
    var result = [];                                // The array we will return
    for(var prop in o) {
        if(o.hasOwnProperty(prop))                  // It it is an own property
            result.push(prop);                      // add it to the array.
    }
    return result;                                  // Return the array.
}

/*
*   Add a nonenumerable extend() method to Object.prototype.
*   This method extends the object on which it is called by copying properties
*   from the object passed as its argument. All property attributes are
*   copied, not just the property value. All own properties (even non-enumerable ones)
*   of the argument object are copied unless a property
*   with the same name already exists in the target object.
*/
Object.defineProperty(Object.prototype, 
    "extend",                   // Define Object.prototype.extend
    {
        writable: true,
        enumerable: false,      // Make it nonenumerable
        configurable: true,
        value: function(o) {    // Its value is this function
            // Get all own props, even nonenumerable ones
            var names = Object.getOwnPropertyNames(o);
            // Loop through them
            for(var i = 0; i < names.length; i++) {
                // Skip props already in this object
                if(names[i] in this) continue;
                // Get property description from o
                var desc = Object.getOwnPropertyNames(o, names[i]);
                // Use it to create property on this
                Object.defineProperty(this, names[i], desc);
            }
        }
    });

function classof(o) {
    if(o === null) return "Null";
    if(o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}

var isArray = Function.isArray || function(o) {
    return typeof o == "object" && Object.prototype.toString.call(o) === "[object Array]";
}

Object.preventExtensions(); // locks object down and prevents tampering by adding new properties
Object.seal(); // locks object down and prevents tampering by adding new properties and prevents modification to existing objects
Object.freeze(); // locks object down and prevents tampering by adding new properties and prevents modification to existing objects, makes data properties read-only

// Determine if o is an array-like object.
// Strings and functions have numeric length properties, but are
// excluded by the typeof test. In client-side Javascript, DOM text
// nodes have a numeric length property, and may need to be excluded 
// with an additional o.nodeType != 3 test.
function isArrayLike(o) {
    if(o &&                                     // o is not null, undefined, etc
        typeof o === "object" &&                // o is an object
        isFinite(o.length)  &&                  // o.length is a finite number
        o.length >= 0 &&                        // o.length is non-negative
        o.length === Math.floor(o.length) &&    // o.length is an integer
        o.length < 4294967296)                  // o.length < 2 ^ 32
        return true;                            // Then o is array-life
    else
        return false;                           // Otherwise it is not
}

// This function adds property accessor methods for a property with
// the specified name to the object o. The methods are named get<name>
// and set<name>. If a predicate function is supplied, the setter
// method uses it to test its argument for validity before storing it.
// If the predicate returns false, the setter method throws an exception.
//
// The unusual thing about this function is that the property value
// that is manipulated by the getter and setter methods is not stored in
// the object o. Instead, the value is stored only in a local variable
// in this function. The getter and setter methods are also defined
// locally to this function and therefore have access to this local variable.
// This means that the value is private to the two accessor methods, and it
// cannot be set of modified except through the setter method.
function addPrivateProperty(o, name, predicate) {
    var value;  // This is the property value

    // The getter method simply returns the value.
    o["get" + name] = function() { return value; };
    // THe setter method stores the value or throws an exception if
    // the predicate rejects the value.
    o["set" + name] = function(v) {
        if(predicate && !predicate(v))
            throw Error("set" + name + ": invalid value " + v);
        else
            value = v;
    };
}

// Replace the method named m of the object o with a version that logs 
// messages before and after invoking the original method.
function trace(o, m) {
    var original = o[m];    // Remember the original method in the closure
    o[m] = function() {     // Now define the new method
        console.log(new Date(), "Entering:", m);        // Log message.
        var result = original.apply(this, arguments);   // Invoke original
        console.log(new Date(), "Exiting:", m);         // Log message
        return result;
    }
}

// Return a function that invokes f as a method of o, passing all the arguments
function bind(f, o) {
    if(f.bind) return f.bind(o);    // Use the bind method, if ther is one
    else return function() {        // Otherwise, bind it like this
        return f.apply(o, arguments);
    };
}

// Function to perform partial application and binding for ECMAScript 3
// Has issues that it does not have a length property and cannot be used for constructor functions
if(!Function.prototype.bind) {
    Function.prototype.bind = function(o, /*, args */) {
        // Save the this and arguments values into variables so we
        // can use them in the nested functions below.
        var self = this, boundArgs = arguments;

        // The return value of the bind() method is a function
        return function() {
            // Build up an argument list, starting with any args passed
            // to bind after the first one, and follow those with all args
            // passed to this function
            var args = [], i;
            for(i = 1; i < boundArgs.length; i++) args.push(boundArgs[i]);
            for(i = 0; i < arguments.length; i++) args.push(arguments[i]);

                // Now invoke self as a method of o, with those arguments
            return self.apply(o, args);
        }
    }
}

// Call the function f for each element of array a and return
// an array of results. Use Array.prototype.map if it is defined
var map = Array.prototype.map
    ? function(a, f) { return a.map(f); }   // Ue map method if it exists
    : function(a,f) {                       // Otherwise, implement our own
        var results = [];
        for (var i = 0, len = a.length; i < len; i++) {
            if(i in a) results[i] = f.call(null, a[i], i, a);
        };
        return results;
    };

// Reduce the array to a single value using the function f and 
// optional initial value. Use Array.prototype.reduce if it is defined.
var reduce = Array.prototype.reduce
    ? function(a, f, initial)   {   // If the reduce() method exists
        if(arguments.length > 2)
            return a.reduce(f, initial);    // If an initial value was passed
        else
            return a.reduce(f);             // Otherwise, no initial value.
    } 
    : function(a, f, initial) {             // This algorithm from the ES5 specification
        var i = 0, len = a.length, accumulator;
        // Start with the specified initial value, or the first value in a
        if(arguments.length > 2) accumulator = initial;  
        else {  // Find the first defined index in the array
            if(len == 0)  throw TypeError();
            while(i < len) {
                if(i in a) {
                    accumulator = a[i++];
                    break;
                }
                else i++;
            }
            if(i == len) throw TypeError();
        }

        // Now call f for each remaining element in the array
        while(i < len) {
            if(i in a)
                accumulator = f.call(undefined, accumulator, a[i], i, a);
            i++;
        }
        return accumulator;
    };






       

