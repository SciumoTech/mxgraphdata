import {mxGraphModel} from "./mxgraphmodel";

export interface mxGraph {
  model : mxGraphModel;
  multiplicities : any[];
  imageBundles : any[];
}