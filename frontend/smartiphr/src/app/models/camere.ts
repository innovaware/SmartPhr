export class Camere {
  static clone(obj: Camere) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  camera: string;
  piano: string;
  geometry: string;
  geometryObject: any;
  forPatient: boolean;
  order: number;

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
