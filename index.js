var Benchmark = require('benchmark');

var angleNormals = require('angle-normals');
var angleNormalsPacked = require('./angle-normals-packed');
var pack = require('array-pack-2d');
var dragon = require('stanford-dragon/1');

var flatDragon = {
  positions: pack(dragon.positions),
  cells: pack(dragon.cells, 'uint32'),
};

var normalsOut = new Float32Array(flatDragon.positions.length);

console.log('Cell count:', dragon.cells.length);
console.log('Vertex count:', dragon.positions.length);

var suite = new Benchmark.Suite;

suite
  .add('                  array-of-arrays angle-normals', function () {
    angleNormals(
      dragon.cells,
      dragon.positions
    );
  })

  .add('                     flat-storage angle-normals', function () {
    angleNormalsPacked(
      null,
      flatDragon.cells,
      flatDragon.positions,
    );
  })

  .add('flat-storage angle-normals with in-place output', function () {
    angleNormalsPacked(
      normalsOut,
      flatDragon.cells,
      flatDragon.positions,
    );
  })

  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
