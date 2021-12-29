import Btree from "../trees/Btree";
import { Way } from "../trees/Way";
import { OSMHelper } from "./OSMHelper";

interface IWayHelper {
  findMiddleCoordinate(
    way: Way,
    bTreeNode: Btree
  ): { middleLat: number; middleLon: number };
  isWayToStore(way: any): boolean;
}

export class WayHelper extends OSMHelper implements IWayHelper {
  constructor() {
    super();
  }

  findMiddleCoordinate(way: Way, bTreeNode: Btree) {
    let minLon = Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let maxLat = -Infinity;

    way.nodeRefs.forEach((ref) => {
      const currentNode = bTreeNode.get(Number(ref));
      if (currentNode.lat < minLat) {
        minLat = currentNode.lat;
      }
      if (currentNode.lon < minLon) {
        minLon = currentNode.lon;
      }
      if (currentNode.lat > maxLat) {
        maxLat = currentNode.lat;
      }
      if (currentNode.lon > maxLon) {
        maxLon = currentNode.lon;
      }
    });

    const middleLat = (minLat + maxLat) / 2;
    const middleLon = (minLon + maxLon) / 2;

    return {
      middleLat,
      middleLon,
    };
  }

  isWayToStore(way: any) {
    return (
      way.tags.highway &&
      (way.tags.highway === "motorway" ||
        way.tags.highway === "trunk" ||
        way.tags.highway === "primary" ||
        way.tags.highway === "tertiary" ||
        way.tags.highway === "unclassified" ||
        way.tags.highway === "residential" ||
        way.tags.highway === "trunk_link" ||
        way.tags.highway === "motorway_link" ||
        way.tags.highway === "primary_link" ||
        way.tags.highway === "secondary_link" ||
        way.tags.highway === "tertiary_link" ||
        way.tags.highway === "service" ||
        way.tags.highway === "secondary")
    );
  }
}
