# flat typed arrays vs. array of arrays for mesh data

## Motivation

In order to help guide mesh storage format decisions, this repository performs a simple benchmark of the venerable [angle-normals](https://www.npmjs.com/package/angle-normals) module using array-of-arrays storage as well as using flat typed arrays.

My hypothesis is that flat typed arrays not only facilitate interop with WebGL, but are actually significantly faster. When challenged though, I realized my evidence was anecdotal and hand-wavy at best.

## Setup

I've benchmarked a very simple translation of angle-normals to flat array storage. I've run this on the different detail levels of [stanford-dragon](https://www.npmjs.com/package/stanford-dragon). The three tests are:

1. Array-of-arrays storage with freshly allocated output storage for each successive run.
2. Flat Float32Array storage with freshly allocated output for each successive run.
3. Flat Float32Array storage with the same pre-allocated output destination for each run.

## Results

The tests are run on a MacBook Pro (2018, OS X 10.14.2, 2.7GHz Intel Core i7 with 16GB 2133 MHz LPDDR3 RAM) running node v10.13.0.

```
Coarseness level 4:
  Cell count: 11102
  Vertex count: 5205
                    array-of-arrays angle-normals x 882 ops/sec ±1.15% (94 runs sampled)
                       flat-storage angle-normals x 978 ops/sec ±0.37% (94 runs sampled)
  flat-storage angle-normals with in-place output x 1,008 ops/sec ±0.33% (96 runs sampled)
  Fastest is flat-storage angle-normals with in-place output

Coarseness level 3:
  Cell count: 47794
  Vertex count: 22998
                    array-of-arrays angle-normals x 186 ops/sec ±1.14% (79 runs sampled)
                       flat-storage angle-normals x 223 ops/sec ±0.37% (86 runs sampled)
  flat-storage angle-normals with in-place output x 234 ops/sec ±0.35% (91 runs sampled)
  Fastest is flat-storage angle-normals with in-place output

Coarseness level 2:
  Cell count: 202520
  Vertex count: 100250
                    array-of-arrays angle-normals x 38.48 ops/sec ±1.51% (52 runs sampled)
                       flat-storage angle-normals x 53.17 ops/sec ±1.02% (69 runs sampled)
  flat-storage angle-normals with in-place output x 54.92 ops/sec ±0.96% (71 runs sampled)
  Fastest is flat-storage angle-normals with in-place output

Coarseness level 1:
  Cell count: 871414
  Vertex count: 437645
                    array-of-arrays angle-normals x 4.48 ops/sec ±13.79% (17 runs sampled)
                       flat-storage angle-normals x 12.15 ops/sec ±1.32% (34 runs sampled)
  flat-storage angle-normals with in-place output x 12.40 ops/sec ±0.67% (35 runs sampled)
  Fastest is flat-storage angle-normals with in-place output
```

## Conclusions

For small meshes, the differences aren't significant. As the face/vertex count grows though, the differences can easily add up to 100% overhead, in addition to needing to then repack array-of-arrays into a typed array for usage in WebGL.

Of course you must also keep in mind that adding or removing a vertex from a typed array—or performing similar topological operations—is much more expensive than with array-of-arrays. I'm not trying to say which format is better. My goal here is only to clarify the costs/benefits.
