import * as geohash from "ngeohash";
import * as path from "path";

import { Builder, ByteBuffer } from "flatbuffers";
import * as fs from "fs";

import {
  degreesToRadians,
  distanceInKmBetweenEarthCoordinates,
} from "../../utils/helper";
import BTree from "../Btree";
import { NodesTable } from "../../flatbuffers/geo-table/nodes-table";
import { GTree } from "../../flatbuffers/geo-table/g-tree";
import { GTreeNode } from "../../flatbuffers/geo-table/g-tree-node";
import { GTreeBox } from "../../flatbuffers/geo-table/g-tree-box";

export class GeoTreeNode {
  id: string;
  pointsTo?: string[];
  distance?: number[];
  tags?: { [key: string]: any } | undefined;
  linkCount?: number;

  constructor(node: {
    id: string;
    pointsTo?: string[];
    distance?: number[];
    tags?: { [key: string]: any };
    linkCount?: number;
  }) {
    this.id = node.id;
    this.pointsTo = node.pointsTo;
    this.distance = node.distance;
    this.linkCount = node.linkCount;
    this.tags = node.tags;
  }
}
export class GeoTreeBox {
  key: string;
  data: GeoTreeBox[];
  values: GeoTreeNode[];

  constructor(key: string) {
    this.key = key;
    this.data = [];
    this.values = [];
  }

  addNode(node: GeoTreeNode) {
    this.values.push(node);
    this.sortNodes();
    return this;
  }

  addData(box: GeoTreeBox) {
    this.data.push(box);
    this.sortData();
    return this;
  }

  sortNodes() {
    this.values.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      } else if (a.id < b.id) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  sortData() {
    this.data.sort((a, b) => {
      if (a.key > b.key) {
        return 1;
      } else if (a.key < b.key) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}

export class GeoTree {
  precision: number;
  data: GeoTreeBox[];
  index: BTree<string, number> | null;

  constructor(precision?: number) {
    this.precision = precision || 10;
    this.data = [];
    this.index = null;
  }

  insert(geohash: string, node: GeoTreeNode, geolevel = 0) {
    if (node) {
      this._insert(geohash, node, geolevel, this.data);
    }
  }

  _insert(
    hash: string,
    node: GeoTreeNode,
    geolevel: number,
    data: GeoTreeBox[]
  ) {
    const hashStr = hash.substring(0, geolevel + 1);

    // Leaf
    if (geolevel + 1 === this.precision) {
      const d = this.insertIntoLeaf(hashStr, node, data);

      return d;
    }

    const hashIndex = this.hashIndex(hashStr, data);

    // create all the hashes from this level to the leaf
    if (hashIndex === -1) {
      const box = new GeoTreeBox(hashStr);

      this._insert(hash, node, ++geolevel, box.data);

      box.sortData();
      box.sortNodes();

      data.push(box);

      return data;
    }

    this._insert(hash, node, ++geolevel, data[hashIndex].data);

    data[hashIndex].sortData();
    data[hashIndex].sortNodes();

    // hash on this level is found
    return data;
  }

  insertIntoLeaf(hashStr: string, node: GeoTreeNode, data: GeoTreeBox[]) {
    const box = new GeoTreeBox(hashStr);
    box.addNode(node);
    data.push(box);
    return data;
  }

  hashIndex(hash: string, data: GeoTreeBox[]) {
    function search(value: GeoTreeBox) {
      return value.key === hash;
    }

    return data.findIndex(search);
  }

  getNode(hash: string) {
    let geolevel = 1;
    let tmpData: GeoTreeBox[] | undefined = this.data;
    let node: GeoTreeNode[] | undefined;

    while (geolevel <= this.precision && tmpData) {
      const hashStr = hash.substring(0, geolevel);

      if (geolevel === this.precision) {
        return this.searchLeafNode(tmpData, hashStr);
      } else {
        tmpData = this.searchInternalNode(tmpData, hashStr);
      }

      if (!tmpData) return;

      ++geolevel;
    }

    return node;
  }

  searchInternalNode(tmpData: GeoTreeBox[] | undefined, hashStr: string) {
    return (tmpData || []).find((value) => {
      return value.key === hashStr;
    })?.data;
  }

  searchLeafNode(tmpData: GeoTreeBox[] | undefined, hashStr: string) {
    return (tmpData || []).find((value) => {
      return value.key === hashStr;
    })?.values;
  }

  prepareIndex() {
    this.index = new BTree();

    return this;
  }

  generateDataStructures(builder: Builder) {
    const preparedData = this.prepareForFileStorage(this.data, builder);
    const preparedDataV = GTree.createDataVector(builder, preparedData);

    GTree.startGTree(builder);
    GTree.addData(builder, preparedDataV);
    GTree.addPrecision(builder, this.precision);
    const nodes = GTree.endGTree(builder);

    const index = this.index ? this.index.createIndexForFlat(builder) : null;

    return { nodes, index };
  }

  prepareForFileStorage(data: GeoTreeBox[], builder: Builder) {
    return data.map((el) => {
      if (el.values.length) {
        // store leaf

        const gNodesArray = el.values.map((value) => {
          const id = builder.createString(value.id);
          const distance = value.distance
            ? GTreeNode.createDistanceVector(builder, value.distance)
            : null;
          const points = value.pointsTo
            ? value.pointsTo.map((p) => builder.createString(p))
            : null;
          const pointsVector = points
            ? GTreeNode.createPointsToVector(builder, points)
            : null;
          const tags = value.tags
            ? builder.createString(JSON.stringify(value.tags))
            : null;

          GTreeNode.startGTreeNode(builder);
          GTreeNode.addId(builder, id);
          if (distance) {
            GTreeNode.addDistance(builder, distance);
          }

          if (pointsVector) {
            GTreeNode.addPointsTo(builder, pointsVector);
          }

          if (tags) {
            GTreeNode.addTags(builder, tags);
          }

          const gTreeNode = GTreeNode.endGTreeNode(builder);

          if (value.tags?.name && this.index) {
            this.index.set(value.tags?.name, gTreeNode);
          }

          return gTreeNode;
        });

        const key = builder.createString(el.key);

        const values = GTreeBox.createValuesVector(builder, gNodesArray);

        GTreeBox.startGTreeBox(builder);

        GTreeBox.addKey(builder, key);
        GTreeBox.addValues(builder, values);

        return GTreeBox.endGTreeBox(builder);
      }
      // go lower
      const gBoxData = this.prepareForFileStorage(el.data, builder);
      const key = builder.createString(el.key);
      const dataV = GTreeBox.createDataVector(builder, gBoxData);

      GTreeBox.startGTreeBox(builder);

      GTreeBox.addKey(builder, key);
      GTreeBox.addData(builder, dataV);

      return GTreeBox.endGTreeBox(builder);
    });
  }
}
