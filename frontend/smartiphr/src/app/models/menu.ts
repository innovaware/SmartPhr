import { SubMenu } from "./subItem";

export class Menu {
  _id?: string;
  title: string;
  link: string;
  icon: string;
  subMenu: SubMenu[];
  active: boolean;
  order: number;

}
