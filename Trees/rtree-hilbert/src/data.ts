import { Relation, Way, Node } from "./r-tree";
import JSOn from "../t.json";

// export const way: Way = {
//   id: 540434097,
//   nodes: [
//     {
//       id: 1454283147,
//       lat: 45.1111499,
//       lon: 13.7105957,
//     },
//     {
//       id: 4684945984,
//       lat: 45.1111909,
//       lon: 13.7103798,
//     },
//     {
//       id: 1454283184,
//       lat: 45.111218,
//       lon: 13.7100053,
//     },
//     {
//       id: 4684945985,
//       lat: 45.1112496,
//       lon: 13.7097428,
//     },
//     {
//       id: 4684945985,
//       lat: 45.1112496,
//       lon: 13.7097428,
//     },
//     {
//       id: 1454283198,
//       lat: 45.1113003,
//       lon: 13.7095193,
//     },
//     {
//       id: 1454283161,
//       lat: 45.1113422,
//       lon: 13.7093524,
//     },
//     {
//       id: 4393834627,
//       lat: 45.1113288,
//       lon: 13.7092666,
//     },
//     {
//       id: 1454283110,
//       lat: 45.110571,
//       lon: 13.7094278,
//     },
//   ],
// };

// export const relations: [Relation] = [
//   {
//     id: 474573515,
//     nodes: [
//       {
//         id: 4684945615,
//         lat: 45.1109466,
//         lon: 13.7092826,
//       },
//       {
//         id: 4684945614,
//         lat: 45.1108988,
//         lon: 13.7090579,
//       },
//       {
//         id: 4684945613,
//         lat: 45.1110662,
//         lon: 13.7089863,
//       },
//       {
//         id: 4684945612,
//         lat: 45.1111075,
//         lon: 13.7091801,
//       },
//       {
//         id: 4684945611,
//         lat: 45.1109765,
//         lon: 13.7092361,
//       },
//       {
//         id: 4684945610,
//         lat: 45.1109831,
//         lon: 13.709267,
//       },
//       {
//         id: 4684945615,
//         lat: 45.1109466,
//         lon: 13.7092826,
//       },
//     ],
//   },
// ];

export const nodes: [Node] = JSOn.osm.node;
export const relations: [Relation] = JSOn.osm.relation;
export const ways: [Way] = JSOn.osm.way;

// Global variables - bounding box
export let latMin = 45.113032;
export let latMax = 45.105678;

export let lonMin = 13.707472;
export let lonMax = 13.721853;
