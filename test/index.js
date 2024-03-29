import generx from "../index.js";

const testarray = [1,2,3,4,5,1];

function* synchronous() {
	for(const item of testarray) {
		yield item;
	}
}
synchronous = generx(synchronous);

async function* asynchronous() {
	for(const item of testarray) {
		yield item;
	}
}
asynchronous = generx(asynchronous);

describe("sync",function() {
	it("length",function(done) {
		chai.expect(synchronous().length).equal(Infinity);
		done();
	});
	it("final length",function(done) {
		chai.expect(synchronous().realize().length).equal(testarray.length);
		done();
	});
	it("array access",function(done) {
			chai.expect(synchronous()[0]).equal(testarray[0]);
			done();
	});
	it("count",function(done) {
		const generator = synchronous();
		generator[0];
		chai.expect(generator.count()).equal(1);
		done();
	});
	it("set",function(done) {
		const generator = synchronous();
		generator[2] = 3;
		chai.expect(generator.count()).equal(3);
		chai.expect(generator.length).equal(Infinity);
		chai.expect(generator[2]).equal(3);
		done();
	});
	it("set past generator limit",function(done) {
		const generator = synchronous();
		generator[10] = 3;
		chai.expect(generator.count()).equal(11);
		chai.expect(generator.length).equal(11);
		chai.expect(generator[10]).equal(3);
		done();
	});
	it("delete",function(done) {
		const generator = synchronous();
		delete generator[0];
		chai.expect(generator.count()).equal(0);
		done();
	});
	it("delete existing",function(done) {
		const generator = synchronous();
		generator[0];
		delete generator[0];
		chai.expect(generator.count()).equal(1);
		done();
	});
	it("every",function(done) {
		chai.expect(synchronous().every((item,i) => item===testarray[i])).equal(true);
		done();
	});
	it("fill",function(done) {
		const generator = synchronous().fill(0,0,7);
		chai.expect(generator.length).equal(7);
		for(let i=0;i<7;i++) {
			chai.expect(generator[i]).equal(0);
		}
		done();
	});
	it("fill no end",function(done) {
		const generator = synchronous().fill(0,0);
		for(let i=0;i<generator.length;i++) {
			chai.expect(generator[i]).equal(0);
		}
		done();
	});
	it("find",function(done) {
		chai.expect(synchronous().find(item => item===1)).equal(testarray.find(item => item===1));
		done();
	});
	it("findIndex",function(done) {
		chai.expect(synchronous().findIndex((item,i) => item===1 ? true : false)).equal(testarray.findIndex((item,i) => item===1 ? true : false));
		done();
	});
	it("forEach",function(done) {
		let sum1 = 0, sum2 = 0;
		testarray.forEach(i => sum1+=i);
		synchronous().forEach(i => sum2+=i);
		chai.expect(sum1).equal(sum2);
		done();
	});
	it("includes",function(done) {
		chai.expect(synchronous().includes(1)).equal(testarray.includes(1));
		done();
	});
	it("indexOf",function(done) {
		chai.expect(synchronous().indexOf(1)).equal(0);
		done();
	});
	it("join",function(done) {
		chai.expect(synchronous().join(";")).equal(testarray.join(";"));
		done();
	});
	it("keys",function(done) {
		chai.expect(Object.keys(synchronous())).eql(Object.keys(testarray));
		done();
	});
	it("lastIndexOf",function(done) {
		chai.expect(synchronous().lastIndexOf(1)).equal(testarray.lastIndexOf(1));
		done();
	});
	it("map",function(done) {
		const a1 = testarray.map(i => i),
			a2 = synchronous().map(i => i);
		chai.expect(a1.every((item,i) => item===a2[i])).equal(true);
		done();
	});
	it("pop",function(done) {
		const generator = synchronous();
		chai.expect(generator.pop()).equal(testarray[testarray.length-1]);
		chai.expect(generator.length).equal(testarray.length-1);
		chai.expect(generator[testarray.length-1]).equal(undefined);
		done();
	});
	it("push",function(done) {
		const generator = synchronous();
		chai.expect(generator.push(6)).equal(testarray.length+1);
		chai.expect(generator[testarray.length]).equal(6);
		done();
	});
	it("reduce",function(done) {
		const r1 = testarray.reduce((accum,i) => i,0),
			r2 = synchronous().reduce((accum,i) => i,0);
		chai.expect(r1).equal(r2);
		done();
	});
	it("reset",function(done) {
		const a1 = testarray,
			  g2 = synchronous();
		let a2 = [...g2];
		g2.reset();
		a2 = [...g2];
		chai.expect(a1).eql(a2);
		done();
	});
	it("reset should restore array access after spread & array access",function(done) {
		const a1 = testarray,
			  g1 = synchronous();
		// realize the sequence, which consumes the values & sets length
		[...g1];
		g1[0];
		g1.reset();
		chai.expect(a1[0]).equal(g1[0]);
		done();
	});
	it("reverse",function(done) {
		const a1 = testarray.reverse(),
			a2 = synchronous().reverse();
		chai.expect(a1.every((item,i) => item===a2[i])).equal(true);
		done();
	});
	it("shift",function(done) {
		const a1 = testarray.slice(),
			a2 = synchronous();
		chai.expect(a2.shift()).equal(a1.shift());
		chai.expect(a2.count()).equal(0);
		done();
	});
	it("slice part",function(done) {
		const a1 = testarray.slice(1,2),
			a2 = synchronous().slice(1,2);
		chai.expect(a1.every((item,i) => item===a2[i])).equal(true);
		done();
	});
	it("slice full",function(done) {
		const a1 = testarray.slice(),
			a2 = synchronous().slice();
		chai.expect(a2.every((item,i) => item===a1[i])).equal(true);
		done();
	});
	it("slice twice",function(done) {
		const a1 = testarray.slice(1,3),
			gen = synchronous(),
			a2 = gen.slice(0,1),
			a3 = gen.slice(1,3);
		chai.expect(a1.every((item,i) => item===a3[i])).equal(true);
		done();
	});
	it("unshift",function(done) {
		const generator = synchronous();
		chai.expect(generator.unshift(6)).equal(1);
		chai.expect(generator[0]).equal(6);
		done();
	});
});

describe("async",function() {
	it("length",async function() {
		chai.expect(await asynchronous().length).equal(Infinity);
	});
	it("final length",async function() {
		const array = await asynchronous().realize();
		chai.expect(array.length).equal(testarray.length);
	});
	it("array access",async function() {
		const generator = asynchronous();
		await generator[0];
		chai.expect(generator[0]).equal(testarray[0]);
	});
	it("count",async function() {
		const generator = asynchronous();
		await generator[0];
		chai.expect(generator.count()).equal(1);
	});
	it("every",async function() {
		chai.expect(await asynchronous().every((item,i) => item===testarray[i])).equal(true);
	});
	it("fill",async function() {
		const generator = await asynchronous().fill(0,0,7);
		chai.expect(generator.length).equal(7);
		for(let i=0;i<7;i++) {
			chai.expect(generator[i]).equal(0);
		}
	});
	it("fill no end",async function() {
		const generator = await asynchronous().fill(0,0);
		for(let i=0;i<generator.length;i++) {
			chai.expect(generator[i]).equal(0);
		}
	});
	it("find",async function() {
		chai.expect(await asynchronous().find(item => item===1)).equal(testarray.find(item => item===1));
	});
	it("findIndex",async function() {
		chai.expect(await asynchronous().findIndex((item,i) => item===1 ? true : false)).equal(testarray.findIndex((item,i) => item===1 ? true : false));
	});
	it("forEach",async function() {
		let sum1 = 0, sum2 = 0;
		testarray.forEach(i => sum1+=i);
		await asynchronous().forEach(i => sum2+=i);
		chai.expect(sum1).equal(sum2);
	});
	it("includes",async function() {
		chai.expect(await asynchronous().includes(1)).equal(testarray.includes(1));
	});
	it("indexOf",async function() {
		chai.expect(await asynchronous().indexOf(1)).equal(0);
	});
	it("join",async function() {
		chai.expect(await asynchronous().join(";")).equal(testarray.join(";"));
	});
	it("lastIndexOf",async function() {
		chai.expect(await asynchronous().lastIndexOf(1)).equal(testarray.lastIndexOf(1));
	});
	it("map",async function() {
		const a1 = testarray.map(i => i),
			a2 = await asynchronous().map(i => i);
		chai.expect(a1.every(async (item,i) => item===await a2[i])).equal(true);
	});
	it("pop",async function() {
		const generator = asynchronous();
		chai.expect(await generator.pop()).equal(testarray[testarray.length-1]);
		chai.expect(generator.length).equal(testarray.length-1);
		chai.expect(generator[testarray.length-1]).equal(undefined);
	});
	it("push",async function() {
		const generator = asynchronous();
		chai.expect(await generator.push(6)).equal(testarray.length+1);
		chai.expect(generator[testarray.length]).equal(6);
	});
	it("reduce",async function() {
		const r1 = testarray.reduce((accum,i) => accum += i,0),
			r2 = await asynchronous().reduce((accum,i) => accum += i,0);
		chai.expect(r1).equal(r2);
	});
	it("reset",async function() {
		const a1 = testarray,
			  g2 = asynchronous();
		let a2 = [];
		for await (let a of g2) {}
		g2.reset();
		for await (let a of g2) {
			a2.push(a);
		}
		chai.expect(a1).eql(a2);
	});
	it("reset should restore array access after iteration & array access",async function() {
		const a1 = testarray,
			  g1 = asynchronous();
		// go through the sequence
		for await (let a of g1) {}
		await g1[0];
		await g1.reset();
		chai.expect(a1[0]).equal(await g1[0]);
	});
	it("reverse",async function() {
		const a1 = testarray.reverse(),
			a2 = await asynchronous().reverse();
		chai.expect(a1.every(async (item,i) => item===await a2[i])).equal(true);
	});
	it("shift",async function() {
		const a1 = testarray.slice(),
			a2 = synchronous();
		chai.expect(await a2.shift()).equal(a1.shift());
		chai.expect(a2.count()).equal(0);
	});
	it("slice part",async function() {
		const a1 = testarray.slice(1,2),
			a2 = await asynchronous().slice(1,2);
		chai.expect(a1.every(async (item,i) => item===await a2[i])).equal(true);
	});
	it("slice full",async function() {
		const a1 = testarray.slice(),
			a2 = await asynchronous().slice();
		chai.expect(await a2.every(async (item,i) => item===a1[i])).equal(true);
	});
	it("slice twice",async function() {
		const a1 = testarray.slice(1,3),
			gen = asynchronous(),
			a2 = await gen.slice(0,1),
			a3 = await gen.slice(1,3);
		chai.expect(a1.every(async (item,i) => item===await a3[i])).equal(true);
	});
	it("unshift",async function() {
		const generator = asynchronous();
		chai.expect(await generator.unshift(6)).equal(1);
		chai.expect(generator[0]).equal(6);
	});
});

describe("examples",function() {
	it("example1",function(done) {
		function* example1() {
			for(const item of [1,2,3,4,5]) {
				yield item;
			}
		}
		example1 = generx(example1);
		const result = example1().reduce((accum,item) => accum += item); // result = 15
		chai.expect(result).equal(15);
		done();
	});
	it("example2",async function() {
		async function* example2() {
			for(const item of [1,2,3,4,5]) {
				yield item;
			}
		}
		example2 = generx(example2);
		const result = await example2().reduce((accum,item) => accum += item); // result = 15
		chai.expect(result).equal(15);
	});
	it("example3",async function() {
		async function* example3() {
			for(const item of [1,2,3,4,5]) {
				yield item;
			}
		}
		example3 = generx(example3);
		const result = await example3().reduce(async (accum,item) => accum += item); // result = 15
		chai.expect(result).equal(15);
	});
	it("example4",function(done) {
		function* example4() {
			for(const item of [1,2,3,4,5]) {
				yield item;
			}
		}
		example4 = generx(example4);
		const result = example4()[2]; // result = 3
		chai.expect(result).equal(3);
		done();
	});
	it("example5",async function() {
		async function* example5() {
			for(const item of [1,2,3,4,5]) {
				yield item;
			}
		}
		example5 = generx(example5);
		const	values = example5(),
			promise = values[0],
			result = await values[1]; // result = 2
		chai.expect(promise).to.be.instanceof(Promise);
		chai.expect(result).equal(2);
	});
	it("example6",async function() {
		async function* example6() {
			for(const item of [1,2,3,4,5]) {
				yield item;
			}
		}
		example6 = generx(example6);
		const values = example6();
		for(let i=0;await values[i] && i<values.length;i++) {
			chai.expect(values[i]).equal(i+1);
		}
	});
	it("example7",async function() {
		async function* example7() {
			for(const item of [1,2,3,4,5]) {
				yield item;
			}
		}
		example7 = generx(example7);
		const values = example7();
		for(let i=0;await values[i] && i<values.length;i++) {
			chai.expect(values[i]).equal(i+1);
		}
		values.reset();
		for(let i=0;await values[i] && i<values.length;i++) {
			chai.expect(values[i]).equal(i+1);
		}
	})
})
		
		



