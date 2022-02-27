export const usefulTagsNode = ["ref", "highway"] as const;
export const usefulTagsWay = [
  "bridge",
  "tunnel",
  "oneway",
  "lanes",
  "ref",
  "name",
  "highway",
  "maxspeed",
  "service",
  "access",
  "area",
  "landuse",
  "width",
  "est_width",
  "junction",
] as const;

export const onewayValues = {
  yes: true,
  true: true,
  "1": true,
  "-1": true,
  reverse: true,
  T: true,
  F: true,
};

export const reversedValues = { "-1": true, reverse: true, T: true };
