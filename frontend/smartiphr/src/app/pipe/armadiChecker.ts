import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'armadiChecker'
})
export class ArmadiCheckerPipe implements PipeTransform {

  transform(val: number) {
    switch(val) {
      case 2: return "Controllato";
      case 1: return "Parziale";

      case 0:
      default: return "Verificare";
    }
  }

}
