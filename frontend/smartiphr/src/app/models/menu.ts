import { SubMenu } from "./subItem";

export class Menu {
  static clone(obj: Menu) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  title: string;
  link: string;
  icon: string;
  roles: [string]; // Lista delle mansioni
  subMenu: SubMenu[];
  active: boolean;
  order: number;

}
