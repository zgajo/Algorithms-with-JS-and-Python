// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class Short {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
__init(i:number, bb:flatbuffers.ByteBuffer):Short {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

k():number {
  return this.bb!.readInt16(this.bb_pos);
}

mutate_k(value:number):boolean {
  this.bb!.writeInt16(this.bb_pos + 0, value);
  return true;
}

static sizeOf():number {
  return 2;
}

static createShort(builder:flatbuffers.Builder, k: number):flatbuffers.Offset {
  builder.prep(2, 2);
  builder.writeInt16(k);
  return builder.offset();
}

}