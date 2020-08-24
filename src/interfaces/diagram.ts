import {mxGraphModel} from "./mxgraphmodel";

export interface diagram {
  _name: string;
  _id: string;
  "#text": string;
  /**
   * Extracted xml of #text segment
   */
  graphXml?: string;
  graphModel?: mxGraphModel;
}

export function isDiagramDeflated( dia: diagram ){
  return !(dia["#text"] === undefined);
}