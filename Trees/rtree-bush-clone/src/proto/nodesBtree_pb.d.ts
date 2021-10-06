// package: 
// file: src/nodesBtree.proto

import * as jspb from "google-protobuf";

export class BTreeWay extends jspb.Message {
  getSize(): number;
  setSize(value: number): void;

  getMaxnodesize(): number;
  setMaxnodesize(value: number): void;

  hasRoot(): boolean;
  clearRoot(): void;
  getRoot(): BTreeWayNode | undefined;
  setRoot(value?: BTreeWayNode): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BTreeWay.AsObject;
  static toObject(includeInstance: boolean, msg: BTreeWay): BTreeWay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BTreeWay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BTreeWay;
  static deserializeBinaryFromReader(message: BTreeWay, reader: jspb.BinaryReader): BTreeWay;
}

export namespace BTreeWay {
  export type AsObject = {
    size: number,
    maxnodesize: number,
    root?: BTreeWayNode.AsObject,
  }
}

export class BTreeWayNode extends jspb.Message {
  clearKeysList(): void;
  getKeysList(): Array<string>;
  setKeysList(value: Array<string>): void;
  addKeys(value: string, index?: number): string;

  clearValuesList(): void;
  getValuesList(): Array<Way>;
  setValuesList(value: Array<Way>): void;
  addValues(value?: Way, index?: number): Way;

  hasIsshared(): boolean;
  clearIsshared(): void;
  getIsshared(): boolean;
  setIsshared(value: boolean): void;

  clearChildrenList(): void;
  getChildrenList(): Array<BTreeWayNode>;
  setChildrenList(value: Array<BTreeWayNode>): void;
  addChildren(value?: BTreeWayNode, index?: number): BTreeWayNode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BTreeWayNode.AsObject;
  static toObject(includeInstance: boolean, msg: BTreeWayNode): BTreeWayNode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BTreeWayNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BTreeWayNode;
  static deserializeBinaryFromReader(message: BTreeWayNode, reader: jspb.BinaryReader): BTreeWayNode;
}

export namespace BTreeWayNode {
  export type AsObject = {
    keysList: Array<string>,
    valuesList: Array<Way.AsObject>,
    isshared: boolean,
    childrenList: Array<BTreeWayNode.AsObject>,
  }
}

export class BNodesTree extends jspb.Message {
  getSize(): number;
  setSize(value: number): void;

  getMaxnodesize(): number;
  setMaxnodesize(value: number): void;

  hasRoot(): boolean;
  clearRoot(): void;
  getRoot(): BTreeNode | undefined;
  setRoot(value?: BTreeNode): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BNodesTree.AsObject;
  static toObject(includeInstance: boolean, msg: BNodesTree): BNodesTree.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BNodesTree, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BNodesTree;
  static deserializeBinaryFromReader(message: BNodesTree, reader: jspb.BinaryReader): BNodesTree;
}

export namespace BNodesTree {
  export type AsObject = {
    size: number,
    maxnodesize: number,
    root?: BTreeNode.AsObject,
  }
}

export class BTreeNode extends jspb.Message {
  clearKeysList(): void;
  getKeysList(): Array<string>;
  setKeysList(value: Array<string>): void;
  addKeys(value: string, index?: number): string;

  clearValuesList(): void;
  getValuesList(): Array<Node>;
  setValuesList(value: Array<Node>): void;
  addValues(value?: Node, index?: number): Node;

  hasIsshared(): boolean;
  clearIsshared(): void;
  getIsshared(): boolean;
  setIsshared(value: boolean): void;

  clearChildrenList(): void;
  getChildrenList(): Array<BTreeNode>;
  setChildrenList(value: Array<BTreeNode>): void;
  addChildren(value?: BTreeNode, index?: number): BTreeNode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BTreeNode.AsObject;
  static toObject(includeInstance: boolean, msg: BTreeNode): BTreeNode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BTreeNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BTreeNode;
  static deserializeBinaryFromReader(message: BTreeNode, reader: jspb.BinaryReader): BTreeNode;
}

export namespace BTreeNode {
  export type AsObject = {
    keysList: Array<string>,
    valuesList: Array<Node.AsObject>,
    isshared: boolean,
    childrenList: Array<BTreeNode.AsObject>,
  }
}

export class Node extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getLat(): number;
  setLat(value: number): void;

  getLon(): number;
  setLon(value: number): void;

  clearPartofwaysList(): void;
  getPartofwaysList(): Array<string>;
  setPartofwaysList(value: Array<string>): void;
  addPartofways(value: string, index?: number): string;

  clearPointstoList(): void;
  getPointstoList(): Array<string>;
  setPointstoList(value: Array<string>): void;
  addPointsto(value: string, index?: number): string;

  clearDistanceList(): void;
  getDistanceList(): Array<number>;
  setDistanceList(value: Array<number>): void;
  addDistance(value: number, index?: number): number;

  getTagsMap(): jspb.Map<string, string>;
  clearTagsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Node.AsObject;
  static toObject(includeInstance: boolean, msg: Node): Node.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Node, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Node;
  static deserializeBinaryFromReader(message: Node, reader: jspb.BinaryReader): Node;
}

export namespace Node {
  export type AsObject = {
    id: string,
    lat: number,
    lon: number,
    partofwaysList: Array<string>,
    pointstoList: Array<string>,
    distanceList: Array<number>,
    tagsMap: Array<[string, string]>,
  }
}

export class Way extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  clearNoderefsList(): void;
  getNoderefsList(): Array<string>;
  setNoderefsList(value: Array<string>): void;
  addNoderefs(value: string, index?: number): string;

  getTagsMap(): jspb.Map<string, string>;
  clearTagsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Way.AsObject;
  static toObject(includeInstance: boolean, msg: Way): Way.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Way, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Way;
  static deserializeBinaryFromReader(message: Way, reader: jspb.BinaryReader): Way;
}

export namespace Way {
  export type AsObject = {
    id: string,
    noderefsList: Array<string>,
    tagsMap: Array<[string, string]>,
  }
}

