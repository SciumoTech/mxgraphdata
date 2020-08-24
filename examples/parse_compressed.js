/**
 * Externals:
 * You must add these to your application.
 */
global.pako = require("pako");

var mxd = require( "../dist/mxgraphd");
var fs = require("fs");

var fname = "./data/cisco1.drawio";
var drawfile = fs.readFileSync(fname, {encoding:"utf-8", flag : "r" });
mxd.parseDrawIO(drawfile).then( (mxfile) => {
  console.log("MXFile name:", fname );
  console.log("MXFile version:", mxfile._version );
  console.log("Diagram name:", mxfile.diagram._name );
});
