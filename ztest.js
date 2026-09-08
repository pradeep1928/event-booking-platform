// function role (...role) {
//     console.log(role)
// }

// role('admin', 'user')

// function constfun () {
//     var func = []
//     for (let i = 0; i < 10; i++)
//         func[i] = function() {
//             return i
//         }
//         return func
// }
// var func = constfun()
// console.log(func[6]())

// for (var i = 0; i < 10; i++)
//     console.log('start')
//     console.log(i)
//     console.log('done')

// function constfun() {
//     return Array.from({ length: 10 }, (_, i) => () => i);
// }

// var func = constfun();
// console.log(func[3]); // ✅ 6

// console.log(Array.from('hello', (v) => v))




// console.log("A");

// Promise.resolve().then(() => {
//   console.log("C");
// });

// process.nextTick(() => {
//   console.log("D");
// });

// console.log("outside E");

// const fs = require('fs');

// // Inside an active I/O operation callback
// fs.readFile(__filename, (err, data) => {
//     console.log("--- Inside I/O Callback ---");
//     console.log("data")

// setTimeout(() => {
//     console.log("file: B");
// }, 0);

// Promise.resolve().then(() => {
//     console.log("file: C");
// });

// process.nextTick(() => {
//     console.log("file: D");
// });

//     console.log("file: E");
// });

// setTimeout(() => {
//     console.log("timeout B");
// }, 10);

// setImmediate(() => console.log('setimmediate'))

// var x = "20";
// function func1(z) {
//   var x = "5";
//   console.log(this.x, z);
//   function func2() {
//     console.log(x);
//   }

//   func2();
// }
// let obj = {
//     x: 39
// }
// func1.call(obj, 4);
// func1()



const arr = [2, 5, 'hi', true]
arr.foo = 'hello'
// console.log('arr', arr)
// for (let i in arr) {
//     console.log(i)
// }
for (let val of arr) {
    console.log(val)
}
// console.log('arr length', arr.length)
// console.log(arr['foo'])

// console.log(arr.foo); // "hello"
// console.log(Object.keys(arr)); // ["0", "1", "2"]
// console.log(Object.getOwnPropertyNames(arr)); // ["0","1","2","length","foo"]

const arr2 = [1, 5, 8, 'hi', true]
arr2[100] = 'Hii'
console.log('arr2', arr2)
console.log('arr2 length', arr2.length)
console.log(arr2[100]); 
console.log(Object.keys(arr2)); 
console.log(Object.getOwnPropertyNames(arr2)); 
for (let i in arr2) {
    console.log('in arr2', i)
}
for (let i = 0; i < arr2.length; i++) {
    console.log(arr2[i])
}

