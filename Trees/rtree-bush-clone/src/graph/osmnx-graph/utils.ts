import {Graph} from "./graph";

interface IGraphToGdfs {
  G: Graph;
  nodes?: boolean;
  edges?: boolean;
  nodeGeometry?: boolean;
  fillEdgeGeometry?: boolean;
}

export interface IGdfEdges {
  name: any[][];
  length: any[][];
  speedKph: [number[], number][];
  maxspeed?: any[][] | undefined;
  u: number[];
  v: number[];
  data: any[];
  k: number[];
  highway: any[][];
  highwayTypes: string[];
}

const defaultParams = {
  nodes: true,
  edges: true,
  nodeGeometry: true,
  fillEdgeGeometry: true,
};

export const graphToGdfs = (props: IGraphToGdfs) => {
  props = { ...defaultParams, ...props };
  const G = props.G;

  if (props.nodes) {
  }

  let u: number[] = [],
    columns: never[] = [],
    v: number[] = [],
    k: number[] = [],
    data: any[] = [],
    highway: any[][] = [],
    highwayTypes: string[] = [],
    maxspeed: any[][] = [],
    name: any[][] = [],
    length: any[][] = [],
    speedKph: any[][] | null = [];

  if (props.edges) {
    if (!G.edges.length) {
      throw new Error("graph contains no edges");
    }

    G.edges.forEach((edge) => {
      u.push(edge[0]);
      v.push(edge[1]);
      k.push(edge[2]);

      const way = G._succ[edge[0]][edge[1]][edge[2]];

      data.push(way);
      highway.push([edge, way.highway]);
      name.push([edge, way.name]);
      length.push([edge, way.length]);
      maxspeed.push([edge, way.maxspeed]);
    });
  }

  highway = highway.map((el) => {
    if (el[1]?.constructor.name === "Object") {
      const highwayType = [...el[1]][0];

      if (!highwayTypes.includes(highwayType)) {
        highwayTypes.push(highwayType);
      }
      return [el[0], highwayType];
    }

    if (!highwayTypes.includes(el[1])) {
      highwayTypes.push(el[1]);
    }

    return el;
  });

  if (maxspeed) {
    maxspeed = maxspeed.map((el) => {
      if (el[1]?.constructor.name === "Object") {
        const set = new Set(el[1]);
        let sum = 0;
        set.forEach((el: any) => {
          sum += Number(el);
        });
        return [el[0], sum / set.size];
      }

      return el;
    });

    speedKph = maxspeed;
  } else {
    speedKph = null;
  }

  const hwySpeedAvg: {[key: string]: null|any[]} = {};

  const groupByHighway = highway.reduce((entryMap, e, index) => {
    console.log(e[1]);
    if (!(e[1] in hwySpeedAvg)) {
      hwySpeedAvg[e[1]] = null;
    }

    if (speedKph && speedKph[index][1]) {
      hwySpeedAvg[e[1]] = [
      // @ts-ignore
        ...(hwySpeedAvg[e[1]] ? hwySpeedAvg[e[1]] : []),
        speedKph[index][1],
      ];
    }
    return entryMap.set(e[1], [...(entryMap.get(e[1]) || []), e]);
  }, new Map());

  //* Stavljamo speed za svako road
  const arrAvg = (arr: any[]) =>
    arr.reduce((a, b) => Number(a) + Number(b), 0) / arr.length;

  let avg = 0;

  for (const key in hwySpeedAvg) {
    if (hwySpeedAvg[key]) {
      const speedAvg = arrAvg(hwySpeedAvg[key] || []);
      hwySpeedAvg[key] = speedAvg as any;

      if (avg) {
        avg += speedAvg / 2;
      } else {
        avg += speedAvg;
      }
    }
  }

  for (const key in hwySpeedAvg) {
    if (!hwySpeedAvg[key]) {
      hwySpeedAvg[key] = avg as any;
    }
  }

  speedKph = highway.map((el, index) => {
    if (speedKph && speedKph[index][1]) {
      return [el[1], Number(speedKph[index][1])];
    }
    return [el[1], hwySpeedAvg[el[1]]];
  });

  speedKph = speedKph.map((el, index) => {
    return [highway[index][0], parseFloat(el[1]).toFixed(1)];
  });

  const gdfEdges = {
    u,
    v,
    data,
    k,
    highway,
    highwayTypes,
    ...(maxspeed.length ? { maxspeed } : null),
    name,
    length,
    speedKph,
  };

  if (props.nodes && props.edges) {
    return;
  } else if (props.nodes) {
    return;
  } else if (props.edges) {
    return gdfEdges;
  } else {
    throw new Error("you must request nodes or edges or both");
  }
};
