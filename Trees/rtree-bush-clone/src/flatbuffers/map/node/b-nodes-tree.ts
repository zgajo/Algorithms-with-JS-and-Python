// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { BTreeNode } from '../../map/node/b-tree-node';


export class BNodesTree {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):BNodesTree {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsBNodesTree(bb:flatbuffers.ByteBuffer, obj?:BNodesTree):BNodesTree {
  return (obj || new BNodesTree()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsBNodesTree(bb:flatbuffers.ByteBuffer, obj?:BNodesTree):BNodesTree {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new BNodesTree()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

size():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

mutate_size(value:number):boolean {
  const offset = this.bb!.__offset(this.bb_pos, 4);

  if (offset === 0) {
    return false;
  }

  this.bb!.writeInt16(this.bb_pos + offset, value);
  return true;
}

maxNodeSize():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : 0;
}

mutate_max_node_size(value:number):boolean {
  const offset = this.bb!.__offset(this.bb_pos, 6);

  if (offset === 0) {
    return false;
  }

  this.bb!.writeUint8(this.bb_pos + offset, value);
  return true;
}

root(obj?:BTreeNode):BTreeNode|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new BTreeNode()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

static startBNodesTree(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addSize(builder:flatbuffers.Builder, size:number) {
  builder.addFieldInt16(0, size, 0);
}

static addMaxNodeSize(builder:flatbuffers.Builder, maxNodeSize:number) {
  builder.addFieldInt8(1, maxNodeSize, 0);
}

static addRoot(builder:flatbuffers.Builder, rootOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, rootOffset, 0);
}

static endBNodesTree(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishBNodesTreeBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedBNodesTreeBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

}
