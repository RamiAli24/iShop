we are using redux toolkit's slice to create reducer
it uses immer under the hood

direct mutation must happen
1- array.filter( x => x !== 2) WRONG

2- array = array.filter( x => x !== 2) CORRECT
