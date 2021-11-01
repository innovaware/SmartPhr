export class UserInfo {
  static clone(obj: UserInfo) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  identify: string;
  mansione: string;
}
