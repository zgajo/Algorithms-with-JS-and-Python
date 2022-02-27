// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { GTreeBox } from '../map-data/g-tree-box';


export class GTree {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):GTree {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsGTree(bb:flatbuffers.ByteBuffer, obj?:GTree):GTree {
  return (obj || new GTree()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsGTree(bb:flatbuffers.ByteBuffer, obj?:GTree):GTree {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new GTree()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

precision():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt8(this.bb_pos + offset) : 0;
}

data(index: number, obj?:GTreeBox):GTreeBox|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new GTreeBox()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

dataLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startGTree(builder:flatbuffers.Builder) {
  builder.startObject(2);
}

static addPrecision(builder:flatbuffers.Builder, precision:number) {
  builder.addFieldInt8(0, precision, 0);
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

static endGTree(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createGTree(builder:flatbuffers.Builder, precision:number, dataOffset:flatbuffers.Offset):flatbuffers.Offset {
  GTree.startGTree(builder);
  GTree.addPrecision(builder, precision);
  GTree.addData(builder, dataOffset);
  return GTree.endGTree(builder);
}
}
