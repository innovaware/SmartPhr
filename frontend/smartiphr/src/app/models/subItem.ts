export class SubMenu {
  title: string;
  link: string;
  icon: string;
  active: boolean;
  subMenu: SubMenu[];

  status: boolean;  //If true then subMenu is opened else closed
}
