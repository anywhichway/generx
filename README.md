# generx v0.0.7

JavaScript generators extended with forEach, map, reduce ... most standard Array methods, plus the abiliyt to reset and re-use the generator.

For situations where less than the entire generator yield collection is required, generx can (but won't always) produce results faster than first converting the generator results into an array while 
also allowing the developer to use the expressive nature of functional oriented array methods in place of `.next()` or `for(let item of <generator>)` code.

See the Medium article: [Next Generation JavaScript Generators](https://medium.com/me/stats/post/df08312fa62d).

# Installation

`npm install generx`

The current BETA code is not currently transpiled and is only fully tested and working in the most recent release of Chrome and Firefox.


# Usage

Just re-assign your generator functions to the Proxy returned by `generx(<function>)` and then use their instantiated values like arrays, e.g.

```
function* example1() {
	for(const item of [1,2,3,4,5]) {
		yield item;
	}
}
example1 = generx(example1);
const result = example1().reduce((accum,item) => accum += item); // result = 15

async function* example2() {
	for(const item of [1,2,3,4,5]) {
		yield item;
	}
}
example2 = generx(example2);
const await result = example2().reduce((accum,item) => accum += item); // result = 15
```

You can even pass in an asynchronous method to `reduce`, `forEach` and other functions accepting functions as arguments:

```
async function* example3() {
	for(const item of [1,2,3,4,5]) {
		yield item;
	}
}
example3 = generx(example3);
const await result = example3().reduce(async (accum,item) => accum += item); // result = 15

```

# API

## Standard Array Methods

The below methods are currently supported and behave the same way as their array counterparts. Those marked with a + resolve
only those elements required to satisfy their semantics and will keep memory, network, and CPU utilization down:

```
+every,
+fill,
+find,
+findIndex,
forEach,
+includes,
+indexOf,
join,
lastIndexOf,
map,
pop,
push,
reduce,
reverse,
+shift,
+slice,
sort,
+some,
+unshift
```

The standard array looping approach `for(let i=0;i < generator.length;i++) { ... }` will also work and you can break early.

If you are using an asynchronous generator, then use `for(let i=0; i < generator.length;i++) { const value = await generator[i]; ... }`

## Additional Properties and Methods

There is an additional read-only property `realized` which contains an array copy of the realized values. Accessing it causes a slice operation. If you just need the
length use `count()` below.

There is an additional method `count()` which will return the current number of realized values.

There is an additional method `realize()` which will force resolution of the entire generator yield collection.

## .length vs .count()

`.count()` return the minimum of the number of values yielded and the `.length`. The count may be less than the number of values yielded if `.pop()` or `.shift()`
have been called. 

The property `length` works almost just like that with an Array. Setting it will limit the number of values yielded to the length provided.
However, it starts out with the value `Infinity` since it is theoretically possible for a generator to yield forever. It remains at `Infinity` until it
becomes set to the current `count()` when the generator has no more values to yield, i.e. `.next()` returns a value of `{done:true,value:<some value>}`.

## reset()

Calling reset() will allow a generator to be re-used.

## Array Accessor Notation

`generx'd` generators can also be accessed using array notation, e.g.

```
function* example4() {
	for(const item of [1,2,3,4,5]) {
		yield item;
	}
}
example4 = generx(example4);
const result = example4()[2]; // result = 3
```

For `async` generators, the array values should be awaited to force Promise resolution. Until the Promise resolves, the value at an index will be a Promise.

```
async function* example5() {
	for(const item of [1,2,3,4,5]) {
		yield item;
	}
}
const example5 = generx(example5),
	values = example5(),
	promise = values[0], // promise instanceof Promise
	result = await values[1]; // result = 2
```

### Setting Values

It is possible to set values at any index:

```
function* example6() {
	for(const item of [1,2,3,4,5]) {
		yield item;
	}
}
const example6 = generx(example6),
	values = example6();
values[1] = 0;
const result = values[1]; // result = 0
```

If the array index in greater than the current `.count()` and the generator is asynchronous, the intermediate values will be forced to start resolution.

If the array index is beyond the total yield count, the length will be extended and the values at intermediate indexes will be undefined.

### Deleting Values

Deleting values at indexes works just like an array. Deleting a value at an index beyond the current `.count()` has no effect. Deleting a value at an index below the current
`.count()` will set the value at the index to `undefined`.


# Release History (reverse chronological order)

2018-12-31 v0.0.7 Added `reset()`.

2018-11-10 v0.0.6 Enhanced documentation. 

2018-11-10 v0.0.5 Renamed `.finalize()` to `.realize()`. Changed return value to the array of all values. Added `.fill(value,start,end)`, `.join(separator)`, 
`.pop()`, `.push(value)`, `.realized`.

2018-11-09 v0.0.4 Added unit tests for `count()`. Added support for delete and set on array indexes. Enhanced documentation.

2018-11-08 v0.0.3 Added `count()`. Enhanced documentation. Improved async Promise resolution

2018-11-07 v0.0.2 Fixed reverse. It was throwing an error due to undefined function. Modified `map` and `slice` to return a `generx` enhanced 
generator rather than array. This will produce results faster for mapped functions and for slices less than the full generator yield results.

2018-11-06 v0.0.1 Initial public release

# License

MIT License

Copyright (c) 2018 Simon Y. Blackwell, AnyWhichWay, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the Software), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
