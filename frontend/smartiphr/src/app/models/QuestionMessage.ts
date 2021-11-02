export class QuestionMessage {
  static clone(obj: QuestionMessage) {
    return JSON.parse(JSON.stringify(obj));
  }
  message: string;
  // response: any;
}
