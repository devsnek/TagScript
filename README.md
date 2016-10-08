## TagScript ##

A better way to deal with the modern issues of tag parsing.

It's a pretty simple system, you just put text in, maybe define some functions,
and out comes parsed tags and such.

Check `test.js` for examples.

Note, there are three basic things you can pass as functions to the compiler.

1. Basic replacements. these are simple key/value strings.
2. Basic functions. These are simple __syncronous__ functions that take
arguments and return a string
3. Promise functions. These are __asyncronous__ and resolve a single string.

You can see all of these as examples in `test.js`
