export class Camere {
  static clone(obj: Camere) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  camera: string;
  piano: Number;
}
