import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CambiturnoComponent } from "./component/cambiturno/cambiturno.component";
import { FerieComponent } from "./component/ferie/ferie.component";
import { PermessiComponent } from "./component/permessi/permessi.component";
import { PresenzeComponent } from "./component/presenze/presenze.component";
import { TurnimensiliComponent } from "./component/turnimensili/turnimensili.component";
import { AuthGuardService as AuthGuard } from './guard/auth-guard.service';
import { AdminPazientiComponent } from './pages/admin-pazienti/admin-pazienti.component';
import { AreaEducativaComponent } from "./pages/area-educativa/area-educativa.component";
import { AreaFisioterapiaComponent } from "./pages/area-fisioterapia/area-fisioterapia.component";
import { AreaInfermieristicaComponent } from "./pages/area-infermieristica/area-infermieristica.component";
import { AreaMedicaComponent } from "./pages/area-medica/area-medica.component";
import { SegnalazioneComponent } from "./pages/segnalazioni/segnalazioni.component";
import { AspComponent } from "./pages/asp/asp.component";
import { ConsulentiComponent } from "./pages/consulenti/consulenti.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { FarmaciComponent } from "./pages/farmaci/farmaci.component";
import { AdminFornitoriComponent } from "./pages/admin-fornitori/admin-fornitori.component";
import { GestStanzeComponent } from "./pages/gest-stanze/gest-stanze.component";
import { GestUtentiComponent } from "./pages/gest-utenti/gest-utenti.component";
import { LoginComponent } from './pages/login/login.component';
import { OspitiComponent } from "./pages/ospiti/ospiti.component";
import { PagenotfoundComponent } from "./pages/pagenotfound/pagenotfound.component";
import { PsicologicaComponent } from "./pages/psicologica/psicologica.component";
import { CvComponent } from './pages/cv/cv.component';
import { FattureConsulentiComponent } from './pages/fatture-consulenti/fatture-consulenti.component';
import { BonificiConsulentiComponent } from './pages/bonifici-consulenti/bonifici-consulenti.component';
import { FattureFornitoriComponent } from './pages/fatture-fornitori/fatture-fornitori.component';
import { BonificiFornitoriComponent } from './pages/bonifici-fornitori/bonifici-fornitori.component';
import { FattureSSRComponent } from './pages/fatture-ssr/fatture-ssr.component';
import { FattureSSComponent } from './pages/fatture-ss/fatture-ss.component';


import { AnticipoFattureASPComponent } from './pages/anticipo-fatture-asp/anticipo-fatture-asp.component';
import { NoteCreditoASPComponent } from './pages/note-credito-asp/note-credito-asp.component';
import { ProspettoCMASPComponent } from './pages/prospetto-cm-asp/prospetto-cm-asp.component';
import { PuntoFattureASPComponent } from './pages/punto-fatture-asp/punto-fatture-asp.component';
import { ArchiviVisiteSpecialisticheComponent } from './pages/archivi/archivi-visite-specialistiche/archivi-visite-specialistiche.component';
import { ArchiviEsitoStrumentaleComponent } from './pages/archivi/archivi-esito-strumentale/archivi-esito-strumentale.component';
import { ArchiviRefertiEmatochimiciComponent } from './pages/archivi/archivi-referti-ematochimici/archivi-referti-ematochimici.component';
import { ArchiviVerbaliComponent } from './pages/archivi/archivi-verbali/archivi-verbali.component';
import { ArchiviRelazioniCertificatiComponent } from './pages/archivi/archivi-relazioni-certificati/archivi-relazioni-certificati.component';
import { ArchiviImpegnativeComponent } from './pages/archivi/archivi-impegnative/archivi-impegnative.component';
import { ArchiviPAIComponent } from './pages/archivi/archivi-pai/archivi-pai.component';
import { AreaSocialeComponent } from "./pages/area-sociale/area-sociale.component";
import { RegisterComponent } from './pages/register/register.component';

import { EsamiPrivacyPersonaleComponent } from "./pages/esami-privacy-personale/esami-privacy-personale.component";
import { FerieAltroPersonaleComponent } from "./pages/ferie-altro-personale/ferie-altro-personale.component";
//import { LavoroPersonaleComponent } from "./pages/lavoro-personale/lavoro-personale.component";
import { QualitaGeneraleComponent } from "./pages/areaqualita-generale/areaqualita-generale.component";
import { NominaDPOComponent } from "./pages/nominadpo/nominadpo.component";
import { RichiestaMaterialeComponent } from "./pages/richieste-materiale/richieste-materiale.component";
import { ArchivioConsulentiComponent } from "./pages/archivio-consulenti/archivio-consulenti.component";
import { GeneralePersonaleComponent } from "./pages/generale-personale/generale-personale.component";
import { AuthorizationComponent } from "./pages/authorization/authorization.component";
import { CamereComponent } from "./pages/camere/camere.component";



import { AreaOssComponent } from "./pages/area-oss/area-oss.component";
import { AttivitaOssComponent } from "./pages/attivita-oss/attivita-oss.component";
import { RegistroControlliOssComponent } from "./pages/registro-controlli-oss/registro-controlli-oss.component";
import { CamereListComponent } from "./pages/camere-list/camere-list.component";
import { CamereMapComponent } from "./pages/camere-map/camere-map.component";
import { SanificazioneListComponent } from "./pages/sanificazione-list/sanificazione-list.component";
import { SanificazioneRegistroComponent } from "./pages/sanificazione-registro/sanificazione-registro.component";
import { ArmadiListComponent } from "./pages/armadi-list/armadi-list.component";
import { IndumentiListComponent } from "./pages/indumenti-list/indumenti-list.component";


//import { ChiaviOssComponent } from './pages/chiavi-oss/chiavi-oss.component';
//import { RifacimentoLettiOssComponent } from "./pages/rifacimento-letti-oss/rifacimento-letti-oss.component";
import { LavanderiaInternaComponent } from "./pages/lavanderia-interna/lavanderia-interna.component";
import { LavanderiaEsternaComponent } from './pages/lavanderia-esterna/lavanderia-esterna.component';
import { GestFarmaciComponent } from "./pages/gest-farmaci/gest-farmaci.component";
import { GestPresidiComponent } from "./pages/gest-presidi/gest-presidi.component";
import { GestFarmacipresidiPazientiComponent } from "./pages/gest-farmacipresidi-pazienti/gest-farmacipresidi-pazienti.component";
import { ModulisticafarmaciComponent } from "./pages/modulisticafarmaci/modulisticafarmaci.component";
import { AttivitaFarmaciComponent } from "./pages/attivita-farmaci/attivita-farmaci.component";
import { AreaPaiComponent } from "./pages/area-pai/area-pai.component";
import { GestionePuliziaAmbientiComponent } from "./pages/gestione-pulizia-ambienti/gestione-pulizia-ambienti.component";
import { LavanderiaComponent } from "./pages/lavanderia/lavanderia.component";
import { MenuPersonalizzatiComponent } from "./pages/menu-personalizzati/menu-personalizzati.component";
import { MenuGeneraleComponent } from "./pages/menu-generale/menu-generale.component";
import { MagazzinoComponent } from "./pages/magazzino/magazzino.component";
import { CucinaSanificazioneAmbientiComponent } from "./pages/cucina-sanificazione-ambienti/cucina-sanificazione-ambienti.component";
import { CucinaControlloTamponiComponent } from "./pages/cucina-controllo-tamponi/cucina-controllo-tamponi.component";
import { CucinaAutoControlloComponent } from "./pages/cucina-auto-controllo/cucina-auto-controllo.component";
import { CucinaDerrateAlimentariComponent } from "./pages/cucina-derrate-alimentari/cucina-derrate-alimentari.component";
import { calendarioTurniComponent } from "./pages/calendario-turni/calendario-turni.component";
import { NominaResponsabileComponent } from "./pages/nomina-responsabile/nomina-responsabile.component";
import { ArchivioCertificatiComponent } from "./pages/archivio-certificati/archivio-certificati.component";
import { AuditInternoComponent } from "./pages/audit-interno/audit-interno.component";
import { OrganigrammaComponent } from "./pages/organigramma/organigramma.component";
import { ControlloMensileComponent } from "./pages/controllo-mensile/controllo-mensile.component";
import { ReportControlloMensileComponent } from "./pages/Report-controllo-mensile/Report-controllo-mensile.component";
import { PianificazioneCorsiComponent } from "./pages/pianificazione-corsi/pianificazione-corsi.component";
import { ElencoModulisticaComponent } from "./pages/elenco-modulistica/elenco-modulistica.component";
import { VisitePreAssunzioniComponent } from "./pages/visita-pre-assunzioni/visita-pre-assunzioni.component";
import { VisitePeriodicheComponent } from "./pages/visita-periodica/visita-periodica.component";
import { MedicoLavoroComponent } from "./pages/medico-lavoro/medico-lavoro.component";
import { RLSComponent } from "./pages/rls/rls.component";
import { RSPPComponent } from "./pages/rspp/rspp.component";
import { AntincendioComponent } from "./pages/antincendio/antincendio.component";
import { AreaFormazioneComponent } from "./pages/area-formazione-sicurezza/area-formazione-sicurezza.component";
import { ControlloAntincendioComponent } from "./pages/controllo-antincendio/controllo-antincendio.component";
import { ApparecchiatureComponent } from "./pages/apparecchiature-impianti/apparecchiature-impianti.component";
import { AutocertificazioniComponent } from "./pages/autocertificazioni/autocertificazioni.component";
import { CertificazioniComponent } from "./pages/certificazioni/certificazioni.component";
import { PianoScadenzeComponent } from "./pages/piano-scadenze/piano-scadenze.component";
import { VerificaAscensoriComponent } from "./pages/verifica-ascensori/verifica-ascensori.component";
import { PrevenzioneRischiComponent } from "./pages/prevenzione-rischi/prevenzione-rischi.component";
import { ControlloLegionellosiComponent } from "./pages/controllo-legionellosi/controllo-legionellosi.component";
import { AgendaClinicaComponent } from "./pages/agendaClinica/agendaClinica.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { ContrattiConsulentiComponent } from "./pages/contratti-consulenti/contratti-consulenti.component";
import { CarrelloComponent } from "./pages/carrello/carrello.component";
import { RifiutiSpecialiComponent } from "./pages/rifiutiSpeciali/rifiutiSpeciali.component";
import { AreaLogComponent } from "./pages/log/area-log.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent},

  { path: "ospiti", component: OspitiComponent, canActivate: [AuthGuard]  },
  { path: "educativa", component: AreaEducativaComponent, canActivate: [AuthGuard]  },
  { path: "pisicologica", component: PsicologicaComponent, canActivate: [AuthGuard]  },
  { path: "fisioterapia", component: AreaFisioterapiaComponent, canActivate: [AuthGuard]  },
  { path: "medica", component: AreaMedicaComponent, canActivate: [AuthGuard] },
  { path: "agenda_clinica", component: AgendaClinicaComponent, canActivate: [AuthGuard] },
  { path: "agendaInfermeristica", component: AgendaClinicaComponent, canActivate: [AuthGuard] },
  { path: "gest_carrello", component: CarrelloComponent, canActivate: [AuthGuard] },
  { path: "infermieristica", component: AreaInfermieristicaComponent, canActivate: [AuthGuard]  },

  //Calendario Turni

  { path: "calendario-turni", component: calendarioTurniComponent, canActivate: [AuthGuard] },

  // CARTELLA ASS.SOCIALE
  { path: "assistente-sociale", component: AreaSocialeComponent, canActivate: [AuthGuard]  },

  // PERSONALE
  { path: "gest_dipendenti", component: GestUtentiComponent, canActivate: [AuthGuard]  },
  { path: "gest_ferie", component: FerieComponent, canActivate: [AuthGuard]  },
  { path: "gest_permessi", component: PermessiComponent, canActivate: [AuthGuard]  },
  { path: "gest_cambiturno", component: CambiturnoComponent, canActivate: [AuthGuard]  },
  { path: "gest_presenze", component: PresenzeComponent, canActivate: [AuthGuard]  },
  { path: "gest_turnimensili", component: TurnimensiliComponent, canActivate: [AuthGuard]  },

  // AREA PERSONALE
  { path: "generale", component: GeneralePersonaleComponent, canActivate: [AuthGuard]  },
  { path: "cert_privacy", component: EsamiPrivacyPersonaleComponent, canActivate: [AuthGuard]  },
  //{ path: "lavoro", component: LavoroPersonaleComponent, canActivate: [AuthGuard] },
  { path: "MaterialRequest", component: RichiestaMaterialeComponent, canActivate: [AuthGuard] },
  { path: "ferie_permessi", component: FerieAltroPersonaleComponent, canActivate: [AuthGuard]  },

  // PAI
  { path: "pai", component: AreaPaiComponent, canActivate: [AuthGuard]  },

  // AREA OSS
  { path: "gest_pazienti_oss", component: AreaOssComponent, canActivate: [AuthGuard]  },
  { path: "attivita_oss", component: AttivitaOssComponent, canActivate: [AuthGuard]  },
  //{ path: "gest_chiavi", component: ChiaviOssComponent, canActivate: [AuthGuard]  },
  //{ path: "rifacimento_letti", component: RifacimentoLettiOssComponent, canActivate: [AuthGuard]  },
  { path: "Report_Controllo_Mensile", component: ReportControlloMensileComponent, canActivate: [AuthGuard]  },
  { path: "lavanderia_in", component: LavanderiaInternaComponent, canActivate: [AuthGuard]  },
  { path: "lavanderia_ext", component: LavanderiaEsternaComponent, canActivate: [AuthGuard]  },

  // AMMINISTRAZIONE
 
  { path: "gest_pazienti", component: AdminPazientiComponent, canActivate: [AuthGuard] },
  { path: "gest_consulenti", component: ConsulentiComponent, canActivate: [AuthGuard] },
  { path: "gest_contratti", component: ArchivioConsulentiComponent, canActivate: [AuthGuard] },
  { path: "fatture_consulenti", component: FattureConsulentiComponent, canActivate: [AuthGuard] },
  { path: "bonifici_consulenti", component: BonificiConsulentiComponent, canActivate: [AuthGuard] },
  { path: "contratti_consulenti", component: ContrattiConsulentiComponent, canActivate: [AuthGuard] },
  { path: "gest_fornitori", component: AdminFornitoriComponent, canActivate: [AuthGuard] },
  { path: "fatture_fornitori", component: FattureFornitoriComponent, canActivate: [AuthGuard] },
  { path: "bonifici_fornitori", component: BonificiFornitoriComponent, canActivate: [AuthGuard] },

  { path: "fatture_ssr", component: FattureSSRComponent, canActivate: [AuthGuard] },
  { path: "fatture_ss", component: FattureSSComponent, canActivate: [AuthGuard] },

  { path: "anticipi_fatture_asp", component: AnticipoFattureASPComponent, canActivate: [AuthGuard] },
  { path: "note_credito_asp", component: NoteCreditoASPComponent, canActivate: [AuthGuard] },
  { path: "prospetto_mensile_asp", component: ProspettoCMASPComponent, canActivate: [AuthGuard] },
  { path: "punto_fatture_asp", component: PuntoFattureASPComponent, canActivate: [AuthGuard] },

  { path: "gest_asp", component: AspComponent, canActivate: [AuthGuard]  },
  { path: "gest_cv", component: CvComponent, canActivate: [AuthGuard]  },

  { path: "gest_stanze", component: GestStanzeComponent, canActivate: [AuthGuard]  },
  { path: "gest_farmaci", component: FarmaciComponent, canActivate: [AuthGuard]  },

  { path: "gest_presidi", component: PagenotfoundComponent, canActivate: [AuthGuard]  },
  { path: "gest_carrello", component: PagenotfoundComponent, canActivate: [AuthGuard]  },

  // CAMERE
  { path: "gest_camere", component: CamereComponent, canActivate: [AuthGuard]  },
  { path: "gest_camerelist", component: CamereListComponent, canActivate: [AuthGuard]  },
  { path: "gest_camere_map", component: CamereMapComponent, canActivate: [AuthGuard]  },

  // SANIFICAZIONE
  { path: "gest_sanificazioneList", component: SanificazioneListComponent, canActivate: [AuthGuard]  },
  { path: "registro_sanificazione", component: SanificazioneRegistroComponent, canActivate: [AuthGuard]  },

  // ARMADI
  { path: "gest_armadiList", component: ArmadiListComponent, canActivate: [AuthGuard]  },
  { path: "gest_armadi_controlli", component: RegistroControlliOssComponent, canActivate: [AuthGuard]  },

  // INDUMENTI
  { path: "gest_indumenti", component: IndumentiListComponent, canActivate: [AuthGuard]  },

  // Area Qualità
  { path: "qualita_generale", component: QualitaGeneraleComponent, canActivate: [AuthGuard] },
  { path: "NominaDPO", component: NominaDPOComponent, canActivate: [AuthGuard] },
  { path: "Archivio_Certificati", component: ArchivioCertificatiComponent, canActivate: [AuthGuard] },
  { path: "NominaResponsabile", component: NominaResponsabileComponent, canActivate: [AuthGuard] },
  { path: "Audit_Interno", component: AuditInternoComponent, canActivate: [AuthGuard] },
  { path: "Organigramma", component: OrganigrammaComponent, canActivate: [AuthGuard] },
  { path: "controllo_mensile", component: ControlloMensileComponent, canActivate: [AuthGuard] },
  { path: "pianificazione_corsi", component: PianificazioneCorsiComponent, canActivate: [AuthGuard] },
  { path: "elenco_moduli", component: ElencoModulisticaComponent, canActivate: [AuthGuard] },
  { path: "PianoScandenzeGestionali", component: PianoScadenzeComponent, canActivate: [AuthGuard] },

  // ARCHIVI
  { path: "archio_visitespecialistiche", component: ArchiviVisiteSpecialisticheComponent, canActivate: [AuthGuard]  },
  { path: "archivio_esami_strumentali", component: ArchiviEsitoStrumentaleComponent, canActivate: [AuthGuard]  },
  { path: "archivio_referti_ematochimici", component: ArchiviRefertiEmatochimiciComponent, canActivate: [AuthGuard]  },
  { path: "archivio_verbali", component: ArchiviVerbaliComponent, canActivate: [AuthGuard]  },
  { path: "archivio_relazioni_certificati", component: ArchiviRelazioniCertificatiComponent, canActivate: [AuthGuard]  },
  { path: "archivio_impegnative", component: ArchiviImpegnativeComponent, canActivate: [AuthGuard]  },
  { path: "archivio_pai", component: ArchiviPAIComponent, canActivate: [AuthGuard]  },

  // SEGNALAZIONI

  { path: "segnalazioni", component: SegnalazioneComponent, canActivate: [AuthGuard] },

  //GEST FARMACI
  { path: "gest-farmaci", component: GestFarmaciComponent, canActivate: [AuthGuard]  },
  { path: "gest-presidi", component: GestPresidiComponent, canActivate: [AuthGuard]  },
  { path: "gest_farmacipresidi", component: GestFarmacipresidiPazientiComponent, canActivate: [AuthGuard]  },
  { path: "gest-registro", component: AttivitaFarmaciComponent, canActivate: [AuthGuard]  },
  { path: "modulistica-farmaci", component: ModulisticafarmaciComponent, canActivate: [AuthGuard]  },


  //AREA AUSILIARI
  { path: "gest-pulizia-ambienti", component: GestionePuliziaAmbientiComponent, canActivate: [AuthGuard]  },
  { path: "gest-lavanderia", component: LavanderiaComponent, canActivate: [AuthGuard]  },

  //CUCINA
  { path: "menu-personalizzati", component: MenuPersonalizzatiComponent, canActivate: [AuthGuard]  },
  { path: "menu-generali", component: MenuGeneraleComponent, canActivate: [AuthGuard]  },
  { path: "menu-magazzino", component: MagazzinoComponent, canActivate: [AuthGuard]  },
  { path: "cucina-sanificazione", component: CucinaSanificazioneAmbientiComponent, canActivate: [AuthGuard]  },
  { path: "cucina-tamponi", component: CucinaControlloTamponiComponent, canActivate: [AuthGuard]  },
  { path: "cucina-autocontrolli", component: CucinaAutoControlloComponent, canActivate: [AuthGuard]  },
  { path: "cucina-derrate", component: CucinaDerrateAlimentariComponent, canActivate: [AuthGuard]  },


  //AREA SICUREZZA
  { path: "visita_preview", component: VisitePreAssunzioniComponent, canActivate: [AuthGuard] },
  { path: "visite_periodiche", component: VisitePeriodicheComponent, canActivate: [AuthGuard] },
  { path: "medico_lavoro", component: MedicoLavoroComponent, canActivate: [AuthGuard] },
  { path: "rls", component: RLSComponent, canActivate: [AuthGuard] },
  { path: "rspp", component: RSPPComponent, canActivate: [AuthGuard] },
  { path: "antincendio", component: AntincendioComponent, canActivate: [AuthGuard] },
  { path: "area_formazione_sicurezza", component: AreaFormazioneComponent, canActivate: [AuthGuard] },
  { path: "ControlloAntincendio", component: ControlloAntincendioComponent, canActivate: [AuthGuard] },
  { path: "Apparecchiature", component: ApparecchiatureComponent, canActivate: [AuthGuard] },
  { path: "AutoCertificazioni", component: AutocertificazioniComponent, canActivate: [AuthGuard] },
  { path: "Certificazioni", component: CertificazioniComponent, canActivate: [AuthGuard] },
  { path: "Ascensori", component: VerificaAscensoriComponent, canActivate: [AuthGuard] },
  { path: "PrevenzioneRischi", component: PrevenzioneRischiComponent, canActivate: [AuthGuard] },
  { path: "ControlloLegionellosi", component: ControlloLegionellosiComponent, canActivate: [AuthGuard] },
  { path: "RifiutiSpeciali", component: RifiutiSpecialiComponent, canActivate: [AuthGuard] },
  //Impostazioni
  { path: "authorization", component: AuthorizationComponent, canActivate: [AuthGuard] },
  { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] },
  { path: "logs", component: AreaLogComponent, canActivate: [AuthGuard] },


  { path: "", component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: "**", component: PagenotfoundComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
