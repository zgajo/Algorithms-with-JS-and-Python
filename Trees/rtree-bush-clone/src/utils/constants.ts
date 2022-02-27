import { DistTypeEnum, NetworkTypeEnum } from "../graph/osmnx/interface/graph";

export const COUNTRY = "croatia";
export const ENCODE = 9;

export const nominatimEndpoint = "https://nominatim.openstreetmap.org/";

export const graphFromAdressDefaultParams = {
  dist: 1000,
  distType: DistTypeEnum.BBOX,
  networkType: NetworkTypeEnum.ALL_PRIVATE,
  simplify: true,
  retainAll: false,
  truncateByEdge: false,
  returnCoords: false,
  cleanPeriphery: true,
  customFilter: null,
};
