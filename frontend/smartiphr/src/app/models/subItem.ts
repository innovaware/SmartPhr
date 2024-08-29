export class SubMenu {
  static clone(obj: SubMenu) {
    return JSON.parse(JSON.stringify(obj));
  }
  title: string;
  link: string;
  icon: string;
  active: boolean;
  subMenu: SubMenu[];
  roles: [string]; // Lista delle mansioni
  status?: boolean; //If true then subMenu is opened else closed
  order?: number;
}
