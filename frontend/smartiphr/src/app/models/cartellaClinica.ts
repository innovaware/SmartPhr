import { Diario } from './diario';
import { schedaPisico } from './schedaPisico';

export class CartellaClinica {
  _id: number;
  ipertensione?: boolean;
  diabete?: boolean;
  malatCardiovascolari?: boolean;
  malatCerebrovascolari?: boolean;
  demenza?: boolean;
  neoplasie?: boolean;
  altro?: boolean;
  testoAltro?: String;
  antitetanica?: boolean;
  antiepatiteB?: boolean;
  antinfluenzale?: boolean;
  altre?: boolean;
  testoAltre?: String;
  attLavorative?: String;
  scolarita?: String;
  servizioMilitare?: String;
  menarca?: String;
  menopausa?: number;
  attFisica?: String;
  alimentazione?: String;
  alvo?: String;
  diurisi?: String;
  alcolici?: String;
  fumo?: String;
  sonno?: String;

  anamnesiRemota?: String;
  anamnesiProssima?: String;
  terapiaDomicilio?: String;
  reazioneAFarmaci?: String;


  user: String;
}
