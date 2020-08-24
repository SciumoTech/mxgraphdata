import { mxfile, isMxFile } from "./interfaces/mxfile";
import { diagram, isDiagramDeflated } from "./interfaces/diagram";
import { MxGraphD } from "./mxgraphd";
import { parse, X2jOptionsOptional } from "fast-xml-parser";
import { inflateRaw } from "pako";
import { mxGraphModel, isMxGraphModel } from "./interfaces/mxgraphmodel";
import { decode as hedecode } from "he";
import { INSPECT_MAX_BYTES } from "buffer";
import { Shapes } from "./interfaces/shape";

export type TagProcessor = (tagValue: string, tagName: string) => string;
export type AttrProcessor = (attrValue: string, attrName: string) => string;

export type MxData  = mxfile | mxGraphModel | Shapes;

/**
 * Decompose dictionary string as Object
 * Attempt to parse number/bool fields.
 * If no field or value separators, then just return str
 * @param str string serialized dictionary
 * @param fieldSep
 * @param valueSep
 */
export function parseDictionary(
  str: string,
  fieldSep = ";",
  valueSep = "="
): any {
  var result: any = {};
  if (str) {
    const fields = str.split(fieldSep);
    for (var idx = 0; idx < fields.length; idx++) {
      var kv = fields[idx];
      var kvs = kv.split(valueSep);
      if (kvs.length > 1) {
        const key = kvs[0];
        const value = kvs[1];
        if (value == "true") {
          result[key] = true;
        } else if (value == "false") {
          result[key] = false;
        } else {
          try {
            const num = parseFloat(value);
            if (isNaN(num)) {
              result[key] = value;
            } else {
              result[key] = num;
            }
          } catch (e) {
            result[key] = value;
          }
        }
      } else {
        /**
         *
         */
        if (fields.length == 1) {
          return str;
        }
      }
    }
  }
  return result;
}

/**
 * Value is often HTML encoded
 * Style is a stringified dictionary. Parse as Object to remain pure JSON
 * @param attrValue
 * @param attrName
 */
export function mxAttrProcessor(attrValue: string, attrName: string): string {
  if (attrName == "value") {
    return hedecode(attrValue, { isAttributeValue: true });
  } else if (attrName == "style") {
    return parseDictionary(attrValue);
  }
  return attrValue;
}

export const DEFAULT_OPTIONS: X2jOptionsOptional = {
  attributeNamePrefix: "_",
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: true,
  attrValueProcessor: mxAttrProcessor,
};

/**
 * Preserver array order
 */
export const DEFAULT_ARRAY_OPTIONS: X2jOptionsOptional = {
  attributeNamePrefix: "_",
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: true,
  arrayMode: "strict",
  attrValueProcessor: mxAttrProcessor,
};

export function decodeMxFile(
  drawIOFile: string,
  options = DEFAULT_OPTIONS
): MxData | null {
  if( !drawIOFile ){
    return null;
  }
  const json = parse(drawIOFile, (drawIOFile.startsWith("<shapes>") ? DEFAULT_ARRAY_OPTIONS : options) );
  if (!json) {
    return null;
  }
  if (json["mxfile"]) {
    var mxf = json["mxfile"] as mxfile;
    /**
     * Decode diagram if it exists.
     */
    if (mxf.diagram) {
      if (isDiagramDeflated(mxf.diagram)) {
        /**
         * Pako.inflate/deflate are the canonical implementations.
         */
        mxf.diagram.graphXml = decompressDiagram(mxf.diagram);
        return mxf;
      }
    }
  } else if (json["mxGraphModel"]) {
    var mxgm = json["mxGraphModel"] as mxGraphModel;
    return mxgm;
  }else if (json["shapes"]) {
    var mxs = json["shapes"] as Shapes;
    return mxs;
  }
  return null;
}

export function decompressDiagram(dia: diagram): any {
  var data = Buffer.from(dia["#text"], "base64");
  var str = inflateRaw(data, { to: "string" });
  str = decodeURIComponent(str);
  return str;
}

/**
 * Extract embedded graphmodel
 * @param mxf
 * @param options
 */
export function decodeGraphModel(
  graphXml: string,
  options = DEFAULT_OPTIONS
): mxGraphModel | undefined {
  /**
   * Result is an XML string which still needs to be parsed
   * into possible mxGraphModel
   */

  var maybeGraphModel = parse(graphXml, options);
  if (maybeGraphModel && maybeGraphModel["mxGraphModel"]) {
    var graphModel = maybeGraphModel["mxGraphModel"] as mxGraphModel;
    return graphModel;
  }
  return undefined;
}

/**
 * Returns the parsed and possibly deflated graphmodel of a Draw.IO file.
 * No model is built, just the raw JSON objects are returned.
 * @param drawIOFile text contents of Draw.IO file
 * @param options fast-xml-parser xml parsing options, default == DEFAULT_OPTIONS
 */
export async function parseDrawIO(
  drawIOFile: string,
  options = DEFAULT_OPTIONS,
  clean = true
): Promise<MxData> {
  var mxf = decodeMxFile(drawIOFile, options);
  if (!mxf) {
    throw new Error("Malformed Draw.io file.");
  }
  if (isMxFile(mxf)) {
    if (mxf.diagram.graphXml) {
      if (clean) {
        /**
         * No longer need possibly large compressed #text
         * If caller needs it, save it.
         */
        delete mxf.diagram["#text"];
      }
      mxf.diagram.graphModel = decodeGraphModel(mxf.diagram.graphXml, options);
      if (clean && mxf.diagram.graphModel) {
        /**
         * No longer need possibly large diagram xml.
         */
        mxf.diagram.graphXml = undefined;
      }
    }
  }
  return mxf;
}
