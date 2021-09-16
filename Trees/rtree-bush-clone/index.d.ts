declare module "osm-read" {
  export function parse(arg0: {
    filePath: string;
    endDocument: () => void;
    bounds: (bounds: any) => void;
    node: (node: any) => void;
    way: (way: any) => void;
    relation: (relation: any) => void;
    error: (msg: any) => void;
  }) {
    throw new Error("Function not implemented.");
  }
}
