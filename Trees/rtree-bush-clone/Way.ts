import { Node } from "./Node";

export class Way {
  id: string;
  tags: { [key: string]: any } | undefined;
  nodeRefs: Node[];

  constructor(
    id: string,
    tags: { [key: string]: any } | undefined,
    nodeRefs: Node[]
  ) {
    this.id = id;
    this.tags = tags;
    this.nodeRefs = nodeRefs;
  }
}
