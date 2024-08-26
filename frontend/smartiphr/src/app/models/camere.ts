import { User } from "./user";

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
    dst.operatore = src.operatore;
    dst.dataSanificazione = src.dataSanificazione;
    dst.firmaSanificazione = src.firmaSanificazione;
    dst.userSanificazione = src.userSanificazione;
    dst.numPostiOccupati = src.numPostiOccupati;
    dst.armadioCheck = src.armadioCheck;
    dst.dataArmadioCheck = src.dataArmadioCheck;
    dst.firmaArmadio = src.firmaArmadio;
    dst.userArmadio = src.userArmadio;
    dst.trappola = src.trappola;
    dst.verificaDerattificazione = src.verificaDerattificazione;
  }

  _id?: string;
  camera: string;
  piano: string;
  geometry: string;
  geometryObject: any;
  forPatient: boolean;
  order: number;
  numPostiLiberi: number;
  numPostiOccupati?: number;
  numMaxPosti: number;

  sanificata?: boolean; // True Sanificata; False Non Sanificata
  dataSanificazione?: Date;
  firmaSanificazione?: string;
  userSanificazione?: User;
  operatore?: String;

  armadioCheck?: number; // 0 non controllato, 1: parziale; 2 Controllato
  dataArmadioCheck?: Date;
  firmaArmadio?: string;
  userArmadio?: User;

  //Stato pulizia Camera
  statoPulizia: number; //0 Sporco; 1 In Corso; 2 Pulito; 3 Straordinario
  trappola?: Boolean;
  verificaDerattificazione?: Boolean;

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

    this.statoPulizia = 0;
  }
}
