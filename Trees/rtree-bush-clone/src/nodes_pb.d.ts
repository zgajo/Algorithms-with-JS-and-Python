// package: 
// file: src/nodes.proto

import * as jspb from "google-protobuf";

export class Node extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getLat(): number;
  setLat(value: number): void;

  getLon(): number;
  setLon(value: number): void;

  clearPointstoList(): void;
  getPointstoList(): Array<Node>;
  setPointstoList(value: Array<Node>): void;
  addPointsto(value?: Node, index?: number): Node;

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
    id: number,
    lat: number,
    lon: number,
    pointstoList: Array<Node.AsObject>,
  }
}

export class Nodes extends jspb.Message {
  clearNodesList(): void;
  getNodesList(): Array<Node>;
  setNodesList(value: Array<Node>): void;
  addNodes(value?: Node, index?: number): Node;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Nodes.AsObject;
  static toObject(includeInstance: boolean, msg: Nodes): Nodes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Nodes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Nodes;
  static deserializeBinaryFromReader(message: Nodes, reader: jspb.BinaryReader): Nodes;
}

export namespace Nodes {
  export type AsObject = {
    nodesList: Array<Node.AsObject>,
  }
}

