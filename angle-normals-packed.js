'use strict';

// From: https://github.com/mikolalysenko/angle-normals
// Adapted for use with packed vertex and cell data
//
// The MIT License (MIT)
//
// Copyright (c) 2013 Mikola Lysenko
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

module.exports = computeAngleNormals;

function computeAngleNormals (normalsOut, faces, vertices) {
  var vertexDataLength = vertices.length;
  var faceDataLength = faces.length;

  if (!normalsOut) {
    normalsOut = new Float32Array(vertexDataLength);
  } else if (normalsOut.length !== vertexDataLength) {
    normalsOut = new Float32Array(vertexDataLength);
  } else {
    normalsOut.fill(0);
  }

  for(var facePtr = 0; facePtr < faceDataLength; facePtr += 3) {
    var aIdx = faces[facePtr] * 3;
    var bIdx = faces[facePtr + 1] * 3;
    var cIdx = faces[facePtr + 2] * 3;

    var abx = vertices[bIdx] - vertices[aIdx];
    var aby = vertices[bIdx + 1] - vertices[aIdx + 1];
    var abz = vertices[bIdx + 2] - vertices[aIdx + 2];
    var ab = Math.sqrt(abx * abx + aby * aby + abz * abz);

    var bcx = vertices[bIdx] - vertices[cIdx];
    var bcy = vertices[bIdx + 1] - vertices[cIdx + 1];
    var bcz = vertices[bIdx + 2] - vertices[cIdx + 2];
    var bc = Math.sqrt(bcx * bcx + bcy * bcy + bcz * bcz);

    var cax = vertices[cIdx] - vertices[aIdx];
    var cay = vertices[cIdx + 1] - vertices[aIdx + 1];
    var caz = vertices[cIdx + 2] - vertices[aIdx + 2];
    var ca = Math.sqrt(cax * cax + cay * cay + caz * caz);

    if(Math.min(ab, bc, ca) < 1e-6) {
      continue;
    }

    var s = 0.5 * (ab + bc + ca);
    var r = Math.sqrt((s - ab) * (s - bc) * (s - ca) / s);

    var nx = -aby * bcz + abz * bcy;
    var ny = -abz * bcx + abx * bcz;
    var nz = -abx * bcy + aby * bcx;
    var nl = Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx /= nl;
    ny /= nl;
    nz /= nl;

    var w = Math.atan2(r, s - bc);
    normalsOut[aIdx] += w * nx;
    normalsOut[aIdx + 1] += w * ny;
    normalsOut[aIdx + 2] += w * nz;

    w = Math.atan2(r, s - ca);
    normalsOut[bIdx] += w * nx;
    normalsOut[bIdx + 1] += w * ny;
    normalsOut[bIdx + 2] += w * nz;

    w = Math.atan2(r, s - ab);
    normalsOut[cIdx] += w * nx;
    normalsOut[cIdx + 1] += w * ny;
    normalsOut[cIdx + 2] += w * nz;
  }

  // Normalize all the normals
  for(var i = 0; i < vertexDataLength; i += 3) {
    var l = Math.sqrt(
      normalsOut[i] * normalsOut[i] +
      normalsOut[i + 1] * normalsOut[i + 1] +
      normalsOut[i + 2] * normalsOut[i + 2]
    );

    if(l < 1e-8) {
      normalsOut[i] = 1;
      normalsOut[i + 1] = 0;
      normalsOut[i + 2] = 0;
      continue;
    }
    normalsOut[i] /= l;
    normalsOut[i + 1] /= l;
    normalsOut[i + 2] /= l;
  }

  return normalsOut;
}
