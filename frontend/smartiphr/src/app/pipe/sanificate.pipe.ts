import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanificate'
})
export class SanificatePipe implements PipeTransform {

  transform(val: boolean) {
    return val == true ? 'Sanificata': 'Da sanificare';
  }

}
