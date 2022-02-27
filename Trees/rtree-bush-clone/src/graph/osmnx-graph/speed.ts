import { Graph } from "./graph";
import { graphToGdfs, IGdfEdges } from "./utils";

export const addEdgeSpeeds = (
  G: Graph,
  _hwySpeeds?: undefined,
  fallback?: undefined,
  precision = 1
) => {
  const edges = graphToGdfs({
    G,
    fillEdgeGeometry: false,
    nodes: false,
  }) as IGdfEdges;

  if (edges) {
    G.setEdgeAttributes(edges.speedKph, "speed_kph");
  }

  return G;
};

export const addEdgeTravelTimes = (G: Graph, precision = 1) => {
  const edges = graphToGdfs({ G, nodes: false }) as IGdfEdges;

  //  convert distance meters to km, and speed km per hour to km per second
  const distanceKm = edges.length.map((el) => {
    return [el[0], el[1] / 1000];
  });
  const speedKmSec = edges.speedKph.map((el) => {
    return [el[0], el[1] / (60 * 60)];
  });

  const travelTime: [number[], number][] = distanceKm.map((el, index) => {
    const speed = speedKmSec[index][1] as number;
    return [el[0], parseFloat(Number(el[1] / speed).toFixed(1))];
  });

  G.setEdgeAttributes(travelTime, "travel_time");

  return G;
};
