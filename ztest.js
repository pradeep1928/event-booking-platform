

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
// console.log(func); // ✅ 6


console.log(Array.from('hello', (v) => v))