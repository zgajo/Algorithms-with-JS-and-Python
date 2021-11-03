import { Builder, ByteBuffer } from "flatbuffers";
import { Test } from "./flatbuffers/test/test";
import { TestNode } from "./flatbuffers/test/test-node";

// Create a `flatbuffer.Builder`, which will be used to create our
// monsters' FlatBuffers.
var builder = new Builder(1024);

const name = builder.createString("Name");

TestNode.startTestNode(builder);
TestNode.addName(builder, name);
const tnode1 = TestNode.endTestNode(builder);
const v = Test.createVecVector(builder, [tnode1]);

Test.startTest(builder);
Test.addVec(builder, v);
const test = Test.endTest(builder);
builder.finish(test); // You could also call `MyGame.Sample.Monster.finishMonsterBuffer(builder, orc);`.

// This must be called after `finish()`.
var buf = builder.asUint8Array(); // Of type `Uint8Array`.

var buf2 = new ByteBuffer(buf);

// Get an accessor to the root object inside the buffer.
var t = Test.getRootAsTest(buf2);
console.log(t.vec(1, new TestNode())?.name());
