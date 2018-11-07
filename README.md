# generx v0.0.2

JavaScript generators extended with forEach, map, reduce ... most standard Array methods.

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

You can even pass in an asynchronous method to `reduce`, `foreach` and other functions accepting functions as arguments:

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

The below functions are currently supported:

```
["every", "finalize", "find", "findIndex", "forEach", "includes", "indexOf", "lastIndexOf", "map", "reduce", "reverse", "slice", "sort", "some"]
```

# Release History (reverse chronological order)

2018-11-07 v0.0.2 Fixed reverse. It was throwing an error due to undefined function. Modified `map` and `slice` to return a `generx` enhanced 
generator rather than array. This will produce results faster for mapped functions and for slices less than the full generator yield results.

2018-11-06 v0.0.1 Initial public release

# License

MIT License

Copyright (c) 2018 Simon Y. Blackwell, AnyWhichWay, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
