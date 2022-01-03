import { GeoTree } from "../../trees/GeoTree/GeoTree";
import BTree from "../../trees/Btree";
import { ENCODE } from "../../utils/constants";

interface INodesTbl {
  wayNodes: GeoTree;
  placeNodes: GeoTree;
  poiNodes: GeoTree;
  index: {
    streets: BTree<string, any>;
    places: BTree<string, any>;
    pois: BTree<string, any[]>;
  };
}

const NodesTbl: INodesTbl = {
  wayNodes: new GeoTree(ENCODE),
  poiNodes: new GeoTree(ENCODE),
  placeNodes: new GeoTree(ENCODE),
  index: { pois: new BTree(), places: new BTree(), streets: new BTree() },
};

export default NodesTbl;
