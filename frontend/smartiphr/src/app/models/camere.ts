export class Camere {
  static clone(obj: Camere) {
    return JSON.parse(JSON.stringify(obj));
  }

  static copy(src: Camere, dst: Camere) {
    dst._id = src._id;
    dst.camera = src.camera;
    dst.piano = src.piano;
    dst.geometry = src.geometry;
    dst.geometryObject = src.geometryObject;
    dst.forPatient = src.forPatient;
    dst.order = src.order;
    dst.numPostiLiberi = src.numPostiLiberi;
    dst.numMaxPosti = src.numMaxPosti;
    dst.sanificata = src.sanificata;
  }

  _id?: string;
  camera: string;
  piano: string;
  geometry: string;
  geometryObject: any;
  forPatient: boolean;
  order: number;
  numPostiLiberi: number;
  numMaxPosti: number;
  sanificata?: boolean; // True Sanificata; False Non Sanificata

  constructor() {
    const empty = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [[]],
          },
        },
      ],
    };

    this.geometry = JSON.stringify(empty);
    this.geometryObject = empty;
  }
}
