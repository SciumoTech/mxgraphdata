/**
 * MxGraphD provides data indexing and searching of a
 * pure JSON mxGraphModel.
 */
import { mxGraph, mxGraphModel, mxCell } from "./";
import jsonata from "jsonata";

export function addMMap( cell : mxCell, mmap:Map<string, Set<mxCell>>, key: keyof mxCell ) : Set<mxCell> | undefined{
  var id = cell[key] as string;
  if( !id ){
    return undefined;
  }
  var mset = mmap.get(id);
  if( !mset ){
    mset = new Set();
    mmap.set(id, mset);
  }
  mset.add(cell);
  return mset;
}

/**
 * Indexed mxGraphModel. Maintains object references, not suitable for
 * serialization. Use pure JSON mxGraphModel for serialization.
 * NB! Not all edges have _source | _target
 */
export class MxGraphD implements mxGraph {
  multiplicities: any[] = [];
  imageBundles: any[] = [];
  cells: mxCell[] = [];
  nodes: mxCell[] = [];
  links: mxCell[] = [];
  /**
   * All cells by _id
   */
  cellsById: Map<string, mxCell> = new Map();
  /**
   * Set of Links by _source _id
   */
  linksFrom: Map<string, Set<mxCell>> = new Map();
  /**
   * Links by _target _id
   */
  linksTo: Map<string, Set<mxCell>> = new Map();
  constructor(public model: mxGraphModel) {
    if (!model) {
      return;
    }
    this.index();
  }

  /**
   * Index mxGraphModel
   */
  index() {
    this.indexCells();
  }

  /**
   * Index root mxCells and build link source/target indices.
   */
  indexCells() {
    var cells = (this.cells = this.model.root.mxCell);
    var nodes = this.nodes;
    var links = this.links;
    var linkF = this.linksFrom
    var linkT = this.linksTo
    for (var idx = 0; idx < cells.length; idx++) {
      const cell = cells[idx];
      this.cellsById.set(cell._id, cell);
      if( cell._edge ){
        links.push(cell);
        addMMap( cell, linkF, "_source");
        addMMap( cell, linkT, "_target");
      }else{
        nodes.push(cell);
      }
    }
  }

  /**
   * Search mxGraphModel, search just cells @see searchCells
   * @param query
   */
  search(query: string) {
    const expr = jsonata(query);
    return expr.evaluate(this.model);
  }

  /**
   * Search just the mxCells
   * @param query
   */
  searchCells(query: string) {
    const expr = jsonata(query);
    return expr.evaluate(this.cells);
  }
}
