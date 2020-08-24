import {
  parseDrawIO,
  mxfile,
  parseDictionary,
  DEFAULT_OPTIONS,
  mxGraphModel,
  isMxFile,
  isMxGraphModel,
  MxData,
  isShapes,
  MxGraphD,
  Style
} from "../src/index";
import { readFileSync } from "fs";



const mxfiles = [
  "./data/cisco1.drawio",
  "./data/cisco2.drawio",
  "./data/fileio.xml",
];

describe("parseDictionary", () => {
  test("parse dictionary on dictionary", () => {
    const dict =
      "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=none;endFill=0;strokeColor=#23445D;strokeWidth=4;fontSize=14;fontColor=#990000;flag=true";
    const result = parseDictionary(dict);
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
    expect(result.flag).toBeTruthy();
    expect(result.strokeColor).toBe("#23445D");
  });
  test("parse dictionary on string", () => {
    const dict = "edgeStyle";
    const result = parseDictionary(dict);
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result).toBe("edgeStyle");
  });
});

describe("parseDrawIO() GraphModel", () => {
  mxfiles.forEach((file) => {
    test(`parse ${file}`, async (done) => {
      const drawio = readFileSync(file, { encoding: "utf8", flag: "r" });
      const result: MxData = await parseDrawIO(drawio);
      var graph: mxGraphModel;
      expect(result).toBeDefined();
      if (isMxFile(result)) {
        expect(result._version).toBeDefined();
        expect(result.diagram).toBeDefined();
        expect(result.diagram!.graphModel).toBeDefined();
        graph = result.diagram!.graphModel!;
      } else {
        graph = result as mxGraphModel;
      }
      const root = graph.root;
      expect(root).toBeDefined();
      expect(root.mxCell).toBeDefined();
      expect(Array.isArray(root.mxCell)).toBeTruthy();
      expect(root.mxCell.length).toBeGreaterThan(0);
      var cells = root.mxCell;
      var cell = cells[0];
      expect(cell._id).toBe("0");
      for (var idx = 0; idx < cells.length; idx++) {
        cell = cells[idx];
        if (cell.mxGeometry) {
          expect(cell.mxGeometry!._as!).toBe("geometry");
        }
        if (cell._style) {
          expect(
            typeof cell._style == "string" || typeof cell._style == "object"
          ).toBeTruthy();
          if (typeof cell._style == "object") {
            var style = cell._style as Style;
            if (style.fontSize) {
              expect(typeof style.fontSize).toBe("number");
            }
            if (style.shape) {
              expect(typeof style.shape).toBe("string");
            }
          }
        }
      }
      done();
    });
  });
});

describe("MxGraphD", () => {
  mxfiles.forEach((file) => {
    test(`parse ${file}`, async (done) => {
      const drawio = readFileSync(file, { encoding: "utf8", flag: "r" });
      const result: MxData = await parseDrawIO(drawio);
      var graph: mxGraphModel;
      if (isMxFile(result)) {
        graph = result.diagram!.graphModel!;
      } else {
        graph = result as mxGraphModel;
      }
      var graphd = new MxGraphD(graph);
      expect(graphd.cellsById).toBeDefined();
      expect(graphd.cellsById.size).toBeGreaterThan(0);
      graphd.links.forEach((link) => {
        var src = link._source;
        if (src) {
          expect(graphd.linksFrom.has(src)).toBeTruthy();
        }
        var tgt = link._target;
        if (tgt) {
          expect(graphd.linksTo.has(tgt)).toBeTruthy();
        }
      });
      done();
    });
  });
});

/**
 * Test for Shapes stencil content.
 */
describe("parseDrawIO() Shapes", () => {
  const file = "./data/stencils.xml";
  console.warn(
    " * fast-xml-parser does *not* preserve order and so is not suitable for stencils."
  );
  test(`parse ${file}`, async () => {
    const drawio = readFileSync(file, { encoding: "utf8", flag: "r" });
    const result: MxData = await parseDrawIO(drawio);
    expect(result).toBeDefined();
    if (isShapes(result)) {
      expect(result.shape).toBeDefined();
    }
  });
});
