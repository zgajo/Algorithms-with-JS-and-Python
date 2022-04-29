// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { GTreeNode } from '../g-tree/g-tree-node';


export class GTreeBox {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):GTreeBox {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsGTreeBox(bb:flatbuffers.ByteBuffer, obj?:GTreeBox):GTreeBox {
  return (obj || new GTreeBox()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsGTreeBox(bb:flatbuffers.ByteBuffer, obj?:GTreeBox):GTreeBox {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new GTreeBox()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

key():string|null
key(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
key(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

data(index: number, obj?:GTreeBox):GTreeBox|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new GTreeBox()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

dataLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

values(index: number, obj?:GTreeNode):GTreeNode|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new GTreeNode()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

valuesLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startGTreeBox(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addKey(builder:flatbuffers.Builder, keyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, keyOffset, 0);
}

static addData(builder:flatbuffers.Builder, dataOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, dataOffset, 0);
}

static createDataVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startDataVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addValues(builder:flatbuffers.Builder, valuesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, valuesOffset, 0);
}

static createValuesVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startValuesVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endGTreeBox(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createGTreeBox(builder:flatbuffers.Builder, keyOffset:flatbuffers.Offset, dataOffset:flatbuffers.Offset, valuesOffset:flatbuffers.Offset):flatbuffers.Offset {
  GTreeBox.startGTreeBox(builder);
  GTreeBox.addKey(builder, keyOffset);
  GTreeBox.addData(builder, dataOffset);
  GTreeBox.addValues(builder, valuesOffset);
  return GTreeBox.endGTreeBox(builder);
}
}