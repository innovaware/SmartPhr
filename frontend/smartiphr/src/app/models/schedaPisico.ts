import { Diario } from './diario';

export class schedaPisico {
    esame?: {
      statoEmotivo: string[];
      personalita: string[];
      linguaggio: string[];
      memoria: string[];
      orientamento: string[];
      abilitaPercettivo: string[];
      abilitaEsecutive: string[];
      ideazione: string[];
      umore: string[];

      partecipazioni: string;
      ansia: string;
      testEsecutivi: string;
    };
    valutazione: string;
    diario: Diario[]
}


