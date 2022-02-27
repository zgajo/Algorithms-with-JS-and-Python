export enum NetworkTypeEnum {
  ALL_PRIVATE = "all_private",
  ALL = "all",
  BIKE = "bike",
  DRIVE = "drive",
  DRIVE_SERVICE = "drive_service",
  WALK = "walk",
}

export enum DistTypeEnum {
  BBOX = "bbox",
  NETWORK = "network",
}

interface GraphParams {
  dist: number;
  distType: DistTypeEnum;
  networkType: NetworkTypeEnum;
  simplify: boolean;
  retainAll: boolean;
  truncateByEdge: boolean;
  returnCoords: boolean;
  cleanPeriphery: boolean;
  customFilter: null;
}

export interface IGraphFromAddressParams extends GraphParams {
  address: string;
}

export interface IGraphFromPointParams extends GraphParams {
  centerPoint: string[];
}

export interface OverpassData {
  version: number;
  generator: string;
  osm3s: Osm3S;
  elements: Element[];
}

export interface Element {
  type: Type;
  id: number;
  lat?: number;
  lon?: number;
  tags?: Tags;
  nodes?: number[];
}

export interface Tags {
  highway: Highway;
  name?: string;
  "name:it"?: string;
  surface?: Surface;
  tracktype?: string;
  oneway?: string;
  bridge?: string;
  lanes?: string;
  layer?: string;
  "maxspeed:backward"?: string;
  "maxspeed:forward"?: string;
  ref?: Ref;
  source?: string;
  maxspeed?: string;
  "lanes:backward"?: string;
  "lanes:forward"?: string;
  "placement:forward"?: string;
  "turn:lanes:forward"?: string;
}

export enum Highway {
  Crossing = "crossing",
  Primary = "primary",
  PrimaryLink = "primary_link",
  Residential = "residential",
  TrafficSignals = "traffic_signals",
  Unclassified = "unclassified",
}

export enum Ref {
  D303 = "D303",
}

export enum Surface {
  Asphalt = "asphalt",
}

export enum Type {
  Node = "node",
  Way = "way",
}

export interface Osm3S {
  timestamp_osm_base: Date;
  copyright: string;
}
