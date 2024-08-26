import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'castingVerifica'
})
export class CastingVerificaPipe implements PipeTransform {

  transform(val: number) {
    if (val >= 100) return "Completa";
    if (val === 0) return "Da Verificare";

    return "Parziale";
  }

}
