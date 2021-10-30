
export class DinamicButton {

  static clone(obj: DinamicButton) {
    return JSON.parse(JSON.stringify(obj));
  }

  label: string;

  cmd: any;
  css?: string;
  icon?: string;
  images?: string;
  tooltip?: string;
}
