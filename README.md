mxGraph Draw.IO File Parser and JSON Data Model
===

Parses [Draw.io or diagrams.net](diagrams.net) file that may be compressed into pure JSON.

Also provides simple Typescript interfaces and an indexing data model for searching the graph model.

*You must include Pako*

```javascript
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
```

Usage:
```bash
node ./examples/parse_compressed.js 
MXFile name: ./data/cisco1.drawio
MXFile version: 13.6.0
Diagram name: Page-1
```
