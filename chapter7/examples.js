var data = [1,2,3,4,5];
data.forEach(function(value,index,array) { console.log("value: " + value + " index: " + index + " array: " + array) });


data.reduce(function(accumulatedValue, value,index,array) { 
console.log("accumulatedValue:" + accumulatedValue + " value: " + value + " index: " + index + " array: " + array);
return accumulatedValue + value;
});

// create array like object
var a = {};	// start with a regular empty object

// Add properties to make it "array-like"
var i = 0;
while(i < 10) {
	a[i] = i * i;
	i++;
}
a.length = i;

// Now iterate through it as if it were a real array
var total = 0;
for(var j = 0; j < a.length; j++)
	total += a[j];

// Call array functions on array-like object
Array.prototype.join.call(a,"+");
Array.prototype.slice.call(a, 0);	// copy to true array

Array.prototype.map.call(a, function(x) {
	return x.toUpperCase();
});

var s = "Javascript";
Array.prototype.join.call(s,"+");
Array.prototype.filter.call(s,				// filter the characters of a string
	function(x) {
		return x.match(/[^aeiou]/);			// Only match nonvowels
	}).join("");
