import * as moment from "moment";

export class ParametriVitali {
  static clone(obj: ParametriVitali) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  gg: number;
  pa: { x: Date; y: number; modify: boolean }[];
  tc: { x: Date; y: number; modify: boolean }[];
  spo2: { x: Date; y: number; modify: boolean }[];
  diurisi: { x: Date; y: number; modify: boolean }[];
  glic: { x: Date; y: number; modify: boolean }[];
  annotazioni: string;

  constructor(date: moment.Moment, gg: number) {
      this.gg = gg;
      this.pa = [
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${8}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${12}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${16}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${20}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
      ];
      this.tc = [
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${8}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${11}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${14}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${17}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${20}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
      ],
      this.spo2 = [
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${8}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${12}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${16}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${20}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
      ];
      this.diurisi = [
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${8}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${12}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${16}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${20}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
      ];
      this.glic = [
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${8}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${12}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${16}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
        { x: moment(`${date.format('YYYY-MM-')}${gg} ${20}:00:00`, 'YYYY-MM-DD HH:mm:ss').toDate(), y: -1, modify: false},
      ];
      this.annotazioni = "";
    }
}
