import { usefulTagsNode, usefulTagsWay } from "../settings";
type NodesUsefulTags = typeof usefulTagsNode[number];
type WaysUsefulTags = typeof usefulTagsWay[number];

export type TPreparedGraphNode = {
  [key in NodesUsefulTags]?: string;
} & {
  x: number;
  y: number;
};

export type TPreparedGraphWay = {
  [key in WaysUsefulTags]?: string | boolean;
} & {
  osmid: number;
  nodes: number[];
};

export interface TGraphNode {
  [key: number | string]: TPreparedGraphNode;
}
export interface TGraphWay {
  [key: number]: TPreparedGraphWay;
}

export type TGraphEdges = number[][];
