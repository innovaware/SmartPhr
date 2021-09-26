
export class Menu {
  _id?: string;
  title: string;
  link: string;
  icon: string;
  subMenu: [
      {
          title: string,
          link: string,
          icon: string,
          active: boolean
      }
  ];
  active: boolean;
  order: number;
}
