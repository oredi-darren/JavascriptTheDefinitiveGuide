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
*   Copy the enumerable properties of p to o, and return o.
*   If o and p have a property by the same name, o's property is overwritten.
*   This function does not handle getters and setters or copy attributes
 */
function extend(o, p) {
    for(prop in p) {                // For all props in p
        o[prop] = p[prop];          // Add the property to o
    }
    return o;
}

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
                var desc = Object.getOwnPropertyNameso, names[i]);
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