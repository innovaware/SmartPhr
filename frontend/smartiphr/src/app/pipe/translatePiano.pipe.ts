import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translatepiano'
})
export class TranslatePianoPipe implements PipeTransform {

  transform(val) {
    switch (val) {
      case "2p":
        return 'Primo Piano';
      case "1c":
        return 'Piano Terra';
      case "2c":
        return 'Chiesa - Primo';
      case "1p":
      default:
        return 'Chiesa - Terra';
    }
  }

}
