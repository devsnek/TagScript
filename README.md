## TagScript ##

A better way to deal with the modern issues of tag parsing.

It's a pretty simple system, you just put text in, maybe define some functions,
and out comes parsed tags and such.

There are three basic things you can pass as functions to the compiler.

1. Basic replacements. these are simple key/value strings.
2. Basic functions. These are simple __syncronous__ functions that take
arguments and return a string,
3. Promise functions. These are __asyncronous__ functions that take arguments and resolve a string. __Note: any promise that rejects will be replaced with an empty string.__

You can see all of these as examples in `example.js`

There are a number of builtin replacements and functions.
They can be viewed in `builtin.js`

Please note that two functions (`get` and `set`) are kept in the actual compiler due to internal variables they rely on.
