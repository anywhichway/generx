export {generx as default};

const ASYNCPROTO = Object.getPrototypeOf(async function(){}),
	ASYNCGENERATORPROTO = Object.getPrototypeOf(async function*() {}());

export function generx(f,recursed) {
	const generator = typeof(f)==="function" ? f("") : f,
		proto = Object.getPrototypeOf(generator),
		isasync = Object.getPrototypeOf(generator).constructor===ASYNCGENERATORPROTO.constructor;
	if(isasync) {
		proto.every = async function(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(!(await f(this[i],i,this))) return false;
			}
			return true;
		}
		proto.fill = async function(value,start=0,end) {
			const etype = typeof(end);
			if(etype==="number") {
				await this.proxy[end];
			}
			for(let i=start;(etype==="number" ? i<end : i<this.length);i++) {
				etype==="number" || await this.proxy[i];
				this.proxy[i] = value;
			}
			return this;
		}
		proto.find = async function(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(await f(this[i],i,this)) return this[i];
			}
		}
		proto.findIndex = async function(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(await f(this[i],i,this)) return i;
			}
		}
		proto.forEach = async function(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				await f(this[i],i,this);
			}
		}
		proto.includes = async function(value) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(this[i]===value) {
					return true;
				}
			}
			return false;
		}
		proto.indexOf = async function(value) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(this[i]===value) {
					return i;
				}
			}
			return -1;
		}
		proto.join = async function(separator=",") {
			let str = "";
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				str += (i===0 ? "" : separator) + this[i];
			}
			return str;
		}
		proto.lastIndexOf = async function(value) {
			let last = -1;
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(this[i]===value) {
					last = i;
				}
			}
			return last;
		}
		proto.map = async function*(f) {
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				yield await f(this[i],i,this);
			}
		}
		if(!recursed) proto.map = generx(proto.map,true);
		proto.pop = async function() {
			let result;
			if(this.length===Infinity) {
				for(let i=this.count();await this.proxy[i] && i<this.length;i++) {
					;
				}
			}
			result = this[this.length-1];
			this.length--;
			return result;
		}
		proto.push = async function(value) {
			let result;
			if(this.length===Infinity) {
				for(let i=this.count();await this.proxy[i] && i<this.length;i++) {
					;
				}
			}
			this[this.length] = value;
			return this.length;
		}
		proto.reduce = async function(f,accum) {
			let initialized = accum!==undefined;
			for(let i=0;await this.proxy[i] && i<this.length;i++) {
				if(initialized) {
					accum = await f(accum,this[i],i,this);
				} else {
					accum = this[i];
					initialized = true;
				}
			}
			return accum;
		}
		proto.reverse = async function*() {
			const result = [];
			for(let i=0;i<this.length;i++) {
				result.unshift(await this.proxy[i]);
			}
			return generx(async function*() { 
				while(result.length>0) {
					yield result.pop();
				}
			})();
		}
		proto.shift = async function() {
			const result = await this.proxy[0],
				count = await this.count();
			for(let i=0;i<count;i++) {
				this.proxy[i] = await this.proxy[i+1];
			}
			this.length = count - 1;
			return result;
		}
		proto.slice = async function*(start=0,end=Infinity) {
			for(let i=start,j=0;i<end && await this.proxy[i] && i<this.length;i++,j++) {
					yield this[i];
			}
		}
		if(!recursed) proto.slice = generx(proto.slice,true);
		proto.sort = async function(f) {
			return this.slice().sort(f)
		}
		proto.some = async function(f) {
			let i = 0;
			for(let i=start;await this.proxy[i] && i<this.length;i++) {
				if(await f(this[i],i,this)) return true;
			}
		}
		proto.realize = async function() {
			if(this.length===Infinity) {
				for(let i=await this.count();await this.proxy[i] && i<this.length;i++) {
					;
				}
			}
			return this.realized;
		}
		proto.unshift = function(value) {
			const values = this.realized;
			this.proxy[0] = value;
			for(let i=0;i<values.length;i++) {
				this.proxy[i+1] = values[i];
			}
			return this.count();
		}
	} else {
		proto.every = function(f) {
			for(let i=0;i<this.length;i++) {
				if(!f(this.proxy[i],i,this)) return false;
			}
			return true;
		}
		proto.fill = function(value,start=0,end) {
			const etype = typeof(end);
			if(etype==="number") {
				this.proxy[end];
			}
			for(let i=start;(etype==="number" ? i<end : i<this.length);i++) {
				etype==="number" || this.proxy[i];
				this.proxy[i] = value;
			}
			return this;
		}
		proto.find = function(f) {
			for(let i=0;i<this.length;i++) {
				const item = this.proxy[i];
				if(f(item,i,this)) return item;
			}
		}
		proto.findIndex = function(f) {
			for(let i=0;i<this.length;i++) {
				if(f(this.proxy[i],i,this)) return i;
			}
		}
		proto.forEach = function(f) {
			for(let i=0;i<this.length;i++) {
				f(this.proxy[i],i,this);
			}
		}
		proto.includes = function(value) {
			for(let i=0;i<this.length;i++) {
				if(this.proxy[i]===value) {
					return true;
				}
			}
			return false;
		}
		proto.indexOf = function(value) {
			for(let i=0;i<this.length;i++) {
				if(this.proxy[i]===value) {
					return i;
				}
			}
			return -1;
		}
		proto.join = function(separator=",") {
			let str = "";
			for(let i=0;i<this.length;i++) {
				str += (i===0 ? "" : separator) + this.proxy[i];
			}
			return str;
		}
		proto.lastIndexOf = function(value) {
			let last = -1;
			for(let i=0;i<this.length;i++) {
				if(this.proxy[i]===value) {
					last = i;
				}
			}
			return last;
		}
		proto.map = function*(f) {
			for(let i=0;i<this.length;i++) {
				yield f(this.proxy[i],i,this);
			}
		}
		if(!recursed) proto.map = generx(proto.map,true);
		proto.pop = function() {
			let result;
			if(this.length===Infinity) {
				for(let i=this.count();i<this.length;i++) {
					this.proxy[i];
				}
			}
			result = this[this.length-1];
			this.length--;
			return result;
		}
		proto.push = function(value) {
			let result;
			if(this.length===Infinity) {
				for(let i=this.count();i<this.length;i++) {
					this.proxy[i];
				}
			}
			this[this.length] = value;
			return this.length;
		}
		proto.shift = function() {
			const result = this.proxy[0],
				count = this.count();
			for(let i=0;i<count;i++) {
				this.proxy[i] = this.proxy[i+1];
			}
			this.length = count - 1;
			return result;
		}
		proto.reduce = function(f,accum) {
			let initialized = accum!==undefined;
			for(let i=0;i<this.length;i++) {
				if(initialized) {
					accum = f(accum,this.proxy[i],i,this);
				} else {
					accum = this.proxy[i];
					initialized = true;
				}
			}
			return accum;
		}
		proto.reverse = function() {
			const result = [];
			for(let i=0;i<this.length;i++) {
				result.unshift(this.proxy[i]);
			}
			return generx(function*() { 
				while(result.length>0) {
					yield result.pop();
				}
			})();
		}
		proto.slice = function*(start=0,end=Infinity) {
			for(let i=start,j=0;i<end && i<this.length;i++,j++) {
				yield this.proxy[i];
			}
		}
		if(!recursed) proto.slice = generx(proto.slice,true);
		proto.sort = function(f) {
			return this.slice().sort(f)
		}
		proto.some = function(f) {
			let i = 0;
			for(let i=start;i<this.length;i++) {
				if(f(this.proxy[i],i,this)) return true;
			}
		}
		proto.realize = function() {
			if(this.length===Infinity) {
				for(let i=this.count();i<this.length;i++) {
					this.proxy[i];
				}
			}
			return this.realized;
		}
		proto.unshift = function(value) {
			const values = this.realized;
			this.proxy[0] = value;
			for(let i=0;i<values.length;i++) {
				this.proxy[i+1] = values[i];
			}
			return this.count();
		}
	}

	function ResettableState(target, self, args) {
		this.generator = target.apply(self, args);
		this.next = this.generator.next.bind(this.generator);
		// mutable, so can't be set on prototype & must be reset for new states
		this.realized = [];
	}
	ResettableState.prototype = {
		// immutables, so can be set on prototype without requiring reset
		count: 0,
		length: Infinity,
	};
	
	return new Proxy(f,{
		apply(target,thisArg,argumentsList) {
			let state = new ResettableState(...arguments);
			// bounce to `next`, which can be overwritten to replace the current generator
			Object.defineProperty(state.generator, "next", {
				enumerable:false,
				value: (value) => state.next(value),
			});
			// define reset to use the original arguments to create
			// a new generator and assign it to the generator variable
			Object.defineProperty(state.generator,"reset",{
				enumerable:false,
				value: () => {
					state = new ResettableState(...arguments);
					return state.generator;
				},
			});
			const proxy = new Proxy(state.generator,{
					deleteProperty(target,property) {
						delete target[property];
						delete state.realized[property];
						return true;
					},
					get(target,property) {
						if(typeof(property)==="symbol") {
							return target[property];
						}
						const i = parseInt(property);
						if(i>=0) {
							if(i<state.realized.length-1) {
								if(i>=state.count) {
									state.count = i+1;
								}
								return state.realized[i];
							}
							let next = state.next();
							// Note: The apparent duplicate code below ensures generator looks ahead to see if it is done
							while(state.length===Infinity && !next.done) {
								let value = isasync ? next : next.value;
								if(isasync) {
									value = new Promise(resolve => {
										let j = state.realized.length;
										resolve(next.then(item => {
											// replace Promise with resolved value
											if(item.done) {
												// if last value if not undefined, add it
												// unfortunately, if the value was intended to be
												// an undefined member of the array we will miss
												if(item.value!==undefined) {
													target[j] = state.realized[j] = item.value;
													j++;
												}
												state.length = state.realized.length = Math.min(j,state.realized.length);
												// delete evidence of the final Promise which resolved to done
												delete target[j];
												delete target[j+1];
											} else {
											  // do not try to optimize by moving this up, results can legitimately contain undefined
												target[j] = state.realized[j] = item.value;
											}
											return item.value;
										}))
									});
								}
								// save the value to result array, might be a promise
								target[state.realized.length] = state.realized[state.realized.length] = value;
								if(i<state.realized.length-1) {
									if(i>=state.count) {
										state.count = i+1;
									}
									return state.realized[i];
								}
								// peek ahead so length gets set properly
								next = state.next();
								value = isasync ? next : next.value;
								if(isasync) {
									value = new Promise(resolve => {
										let k = state.realized.length;
										resolve(next.then(item => {
											// replace Promise with resolved value
											if(item.done) {
												// if last value if not undefined, add it
												// unfortunately, if the value was intended to be
												// an undefined member of the array we will miss
												if(item.value!==undefined) {
													target[k] = state.realized[k] = item.value;
													k++;
												}
												state.length = state.realized.length = Math.min(k,state.realized.length);
												// delete evidence of the final Promise which resolved to done
												delete target[k];
												delete target[k+1];
											} else {
												target[k] = state.realized[k] = item.value;
											}
											return item.value;
										}))
									});
								} else {
									if(next.done) {
										if(value!==undefined) {
											target[state.realized.length] = state.realized[state.realized.length] = value;
										}
										state.length = state.realized.length;
									} else {
										// do not try to optimize by moving this up, results can legitimately contain undefined
										target[state.realized.length] = state.realized[state.realized.length] = value;
										next = state.next();
									}
								}
							}
							state.length = state.realized.length; // change length from Infinity to actual length
							if(i>=state.count) {
								state.count = i+1;
							}
							return state.realized[i];
						}
						return target[property];
					},
					ownKeys(target) {
						target.realize();
						return Object.keys(target).concat("count","length","next","proxy","realized","reset");
					},
					set(target,property,value) {
						const i = parseInt(property);
						if(i>=0) {
							// force resolution of values before the set point
							for(let j=state.realized.length;j<i && state.length===Infinity;j++) {
								proxy[j];
							}
							state.realized[i] = value;
							if(i>=state.count) {
								state.count = i + 1;
							}
							if(i>=state.length) {
								state.length = i + 1;
							}
						}
						target[property] = value;
						return true;
					},
				});
		Object.defineProperty(state.generator,"count",{value:() => state.count});
		Object.defineProperty(state.generator,"length",{
			get() { 
				return state.length;
			},
			set(value) { 
				if(value<Infinity) { 
					state.length = state.realized.length = value;
				}
				state.count = Math.min(state.count, state.realized.length);
			}
		});
		Object.defineProperty(state.generator,"proxy",{value:proxy});
		Object.defineProperty(state.generator,"realized",{get() { return state.realized.slice(); },set() { throw new Error("'realized' is read-only");}});
		return proxy;
		},
	});
}
