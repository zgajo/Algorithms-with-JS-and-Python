import { Node } from "../trees/Node";
import { Way } from "../trees/Way";

export class OSMHelper {
  constructor() {}

  isPlace(node: Node | Way): boolean {
    if (!node.tags?.name || !node.tags?.place) {
      return false;
    }

    // https://wiki.openstreetmap.org/wiki/Key:place
    if (
      node.tags?.place === "town" ||
      node.tags?.place === "village" ||
      node.tags?.place === "hamlet" ||
      node.tags?.place === "isolated_dwelling" ||
      node.tags?.place === "farm" ||
      node.tags?.place === "allotments" ||
      node.tags?.place === "city_block" ||
      node.tags?.place === "neighbourhood" ||
      node.tags?.place === "quarter" ||
      node.tags?.place === "suburb" ||
      node.tags?.place === "city" ||
      node.tags?.place === "borough" ||
      node.tags?.place === "square"
    ) {
      return true;
    }

    return false;
  }

  isTourism(node: Node | Way): boolean {
    if (node.tags?.tourism && node.tags?.name) {
      return true;
    }

    return false;
  }

  isHistoric(node: Node | Way): boolean {
    if (node.tags?.historic && node.tags?.name) {
      return true;
    }

    return false;
  }

  isWaterway(node: Node | Way): boolean {
    if (node.tags?.waterway && node.tags?.name) {
      // List of waterways we want to store
      if (
        node.tags.waterway === "dam" &&
        node.tags.waterway === "weir" &&
        node.tags.waterway === "waterfall" &&
        node.tags.waterway === "rapids" &&
        node.tags.waterway === "lock_gate"
      ) {
        return true;
      }
    }

    return false;
  }
}
