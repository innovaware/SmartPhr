import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";


import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  FontAwesomeModule,
  FaIconLibrary,
} from "@fortawesome/angular-fontawesome";

import { MenuItemComponent } from "./component/menu-item/menu-item.component";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import { MenuComponent } from "./component/menu/menu.component";
import { PsicologicaComponent } from "./pages/psicologica/psicologica.component";
import { SegnalazioneComponent } from "./pages/segnalazioni/segnalazioni.component";
import { PazienteGeneraleComponent } from "./component/paziente-generale/paziente-generale.component";
import { EsamePisicoComponent } from "./component/psicologica/esame-pisico/esame-pisico.component";
import { ValutaPisicoComponent } from "./component/psicologica/valuta-pisico/valuta-pisico.component";
import { DiarioPisicoComponent } from "./component/diario/diario.component";

import { DialogPisicologicaComponent } from "./dialogs/dialog-psicologica/dialog-psicologica.component";
import { DialogDiarioComponent } from "./dialogs/dialog-diario/dialog-diario.component";
import { DialogCartellaClinicaComponent } from "./dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component";
import { DialogCartellaInfermeristicaComponent } from "./dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component";

import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import { OspitiComponent } from "./pages/ospiti/ospiti.component";
import { TableOspitiComponent } from "./component/table-ospiti/table-ospiti.component";
import { TableFornitoriComponent } from "./component/table-fornitori/table-fornitori.component";
import { AreaEducativaComponent } from "./pages/area-educativa/area-educativa.component";
import { AreaFisioterapiaComponent } from "./pages/area-fisioterapia/area-fisioterapia.component";
import { AreaMedicaComponent } from "./pages/area-medica/area-medica.component";
import { AreaInfermieristicaComponent } from "./pages/area-infermieristica/area-infermieristica.component";
import { GestUtentiComponent } from "./pages/gest-utenti/gest-utenti.component";
import { GestStanzeComponent } from "./pages/gest-stanze/gest-stanze.component";
import { DialogStanzaComponent } from "./dialogs/dialog-stanza/dialog-stanza.component";
import { CalendarComponent } from "./component/calendar/calendar.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AnamnesiFamigliareComponent } from "./component/medica/anamnesi-famigliare/anamnesi-famigliare.component";
import { EsameGeneraleComponent } from "./component/medica/esame-generale/esame-generale.component";
import { EsameNeurologicaComponent } from "./component/medica/esame-neurologica/esame-neurologica.component";
import { MezziContenzioneComponent } from "./component/medica/mezzi-contenzione/mezzi-contenzione.component";
import { ValutazioneTecnicheComponent } from "./component/medica/valutazione-tecniche/valutazione-tecniche.component";
import { VisiteSpecialisticheComponent } from "./component/medica/visite-specialistiche/visite-specialistiche.component";
import { AnamnesiPatologicaComponent } from "./component/medica/anamnesi-patologica/anamnesi-patologica.component";
import { SchedaBAIComponent } from "./component/infermeristica/scheda-bai/scheda-bai.component";
import { SchedaUlcereComponent } from "./component/infermeristica/scheda-ulcere/scheda-ulcere.component";
import { AssegnazioneLettoComponent } from "./component/assegnazione-letto/assegnazione-letto.component";
import { SchedaMNARComponent } from "./component/infermeristica/scheda-mnar/scheda-mnar.component";
import { SchedaVASComponent } from "./component/infermeristica/scheda-vas/scheda-vas.component";
import { SchedaUlcereDiabeteComponent } from "./component/infermeristica/scheda-ulcere-diabete/scheda-ulcere-diabete.component";
import { SchedaLesioniCutaneeComponent } from "./component/infermeristica/scheda-lesioni-cutanee/scheda-lesioni-cutanee.component";
import { SchedaLesioniDecubitoComponent } from "./component/infermeristica/scheda-lesioni-decubito/scheda-lesioni-decubito.component";
import { SchedaInterventiComponent } from "./component/infermeristica/scheda-interventi/scheda-interventi.component";
import { DecessoComponent } from "./component/medica/decesso/decesso.component";
import { DialogEventComponent } from "./dialogs/dialog-event/dialog-event.component";
import { DialogTurniComponent } from "./dialogs/dialog-turni/dialog-turni.component";


// import {
//   NgxMatDatetimePickerModule,
//   NgxMatTimepickerModule,
//   NgxMatNativeDateModule,
// } from "@angular-material-components/datetime-picker";

import { ConsulentiComponent } from "./pages/consulenti/consulenti.component";
import { FattureConsulentiComponent } from "./pages/fatture-consulenti/fatture-consulenti.component";
import { BonificiConsulentiComponent } from "./pages/bonifici-consulenti/bonifici-consulenti.component";
import { AdminFornitoriComponent } from "./pages/admin-fornitori/admin-fornitori.component";
import { FattureFornitoriComponent } from "./pages/fatture-fornitori/fatture-fornitori.component";
import { BonificiFornitoriComponent } from "./pages/bonifici-fornitori/bonifici-fornitori.component";
import { FattureSSRComponent } from "./pages/fatture-ssr/fatture-ssr.component";
import { FattureSSComponent } from "./pages/fatture-ss/fatture-ss.component";

import { AnticipoFattureASPComponent } from "./pages/anticipo-fatture-asp/anticipo-fatture-asp.component";
import { NoteCreditoASPComponent } from "./pages/note-credito-asp/note-credito-asp.component";
import { ProspettoCMASPComponent } from "./pages/prospetto-cm-asp/prospetto-cm-asp.component";
import { PuntoFattureASPComponent } from "./pages/punto-fatture-asp/punto-fatture-asp.component";

import { AspComponent } from "./pages/asp/asp.component";
import { PagenotfoundComponent } from "./pages/pagenotfound/pagenotfound.component";
import { FarmaciComponent } from "./pages/farmaci/farmaci.component";
import { DialogFarmacoComponent } from "./dialogs/dialog-farmaco/dialog-farmaco.component";
import { DialogDipendenteComponent } from "./dialogs/dialog-dipendente/dialog-dipendente.component";
import { DialogConsulenteComponent } from "./dialogs/dialog-consulente/dialog-consulente.component";
import { DialogFornitoreComponent } from "./dialogs/dialog-fornitore/dialog-fornitore.component";
import { DialogAspComponent } from "./dialogs/dialog-asp/dialog-asp.component";
import { DialogMessageErrorComponent } from "./dialogs/dialog-message-error/dialog-message-error.component";
import { AdminPazientiComponent } from "./pages/admin-pazienti/admin-pazienti.component";
import { DialogPazienteComponent } from "./dialogs/dialog-paziente/dialog-paziente.component";
import { UploadComponent } from "./components/upload/upload.component";
import { BasicAuthInterceptor } from "./_helpers/basic-auth.interceptor";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { LoginComponent } from "./pages/login/login.component";
import { AuthGuardService } from "./guard/auth-guard.service";
import { TableDipendentiComponent } from "./component/table-dipendenti/table-dipendenti.component";
import { FerieComponent } from "./component/ferie/ferie.component";
import { PermessiComponent } from "./component/permessi/permessi.component";
import { TurnimensiliComponent } from "./component/turnimensili/turnimensili.component";
import { CambiturnoComponent } from "./component/cambiturno/cambiturno.component";
import { ContrattoConsulentiComponent } from "./component/contratto-consulenti/contratto-consulenti.component";
import { PresenzeComponent } from "./component/presenze/presenze.component";
import { FornitoreGeneraleComponent } from "./component/fornitore-generale/fornitore-generale.component";
import { DipendenteGeneraleComponent } from "./component/dipendente-generale/dipendente-generale.component";
import { DialogDocumentComponent } from "./dialogs/dialog-document/dialog-document.component";
import { TableDocumentComponent } from "./component/table-document/table-document.component";
import { CvComponent } from "./pages/cv/cv.component";
import { DialogCvComponent } from "./dialogs/dialog-cv/dialog-cv.component";
import { TableFattureFornitoriComponent } from "./component/table-fatture-fornitori/table-fatture-fornitori.component";
import { DialogCaricadocumentoComponent } from "./dialogs/dialog-caricadocumento/dialog-caricadocumento.component";
import { DialogQuestionComponent } from "./dialogs/dialog-question/dialog-question.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DialogDiarioClinicoComponent } from "./dialogs/dialog-diario-clinico/dialog-diario-clinico.component";
import { DialogVisitespecialisticheComponent } from "./dialogs/dialog-visitespecialistiche/dialog-visitespecialistiche.component";
import { DiarioClinicoComponent } from "./component/medica/diario-clinico/diario-clinico.component";
import { DialogInterventiComponent } from "./dialogs/dialog-interventi/dialog-interventi.component";
import { AutorizzazioneUscitaComponent } from "./component/autorizzazione-uscita/autorizzazione-uscita.component";
import { DimissioniComponent } from "./component/medica/dimissioni/dimissioni.component";
import { EsitiStrumentaliComponent } from "./component/esiti-strumentali/esiti-strumentali.component";
import { ParametriVitaliComponent } from "./component/parametri-vitali/parametri-vitali.component";
import { ChartsModule, ThemeService } from "ng2-charts";
import { SliderDateComponent } from "./component/slider-date/slider-date.component";
import { ArchiviVisiteSpecialisticheComponent } from './pages/archivi/archivi-visite-specialistiche/archivi-visite-specialistiche.component';
import { ArchiveDocumentsComponent } from './component/archive-documents/archive-documents.component';
import { ArchiviEsitoStrumentaleComponent } from './pages/archivi/archivi-esito-strumentale/archivi-esito-strumentale.component';
import { ArchiviRefertiEmatochimiciComponent } from './pages/archivi/archivi-referti-ematochimici/archivi-referti-ematochimici.component';
import { ArchiviVerbaliComponent } from './pages/archivi/archivi-verbali/archivi-verbali.component';
import { ArchiviRelazioniCertificatiComponent } from './pages/archivi/archivi-relazioni-certificati/archivi-relazioni-certificati.component';
import { ArchiviImpegnativeComponent } from './pages/archivi/archivi-impegnative/archivi-impegnative.component';
import { ArchiviPAIComponent } from './pages/archivi/archivi-pai/archivi-pai.component';
import { DialogCartellaAssistenteSocialeComponent } from './dialogs/dialog-cartella-assistente-sociale/dialog-cartella-assistente-sociale.component';
import { AreaSocialeComponent } from './pages/area-sociale/area-sociale.component';
import { ValutazioneSocialeComponent } from './component/assistente-sociale/valutazione-sociale/valutazione-sociale.component';
import { IndiceSocializzazioneComponent } from './component/assistente-sociale/indice-socializzazione/indice-socializzazione.component';
import { DiarioSocialeComponent } from './component/assistente-sociale/diario-sociale/diario-sociale.component';
import { DialogCartellaEducativaComponent } from './dialogs/dialog-cartella-educativa/dialog-cartella-educativa.component';
import { DiarioEducativoComponent } from './component/cartella-educativa/diario-educativo/diario-educativo.component';
import { ValutazioneEducativaComponent } from './component/cartella-educativa/valutazione-educativa/valutazione-educativa.component';

import { SchedaADLComponent } from './component/cartella-educativa/scheda-adl/scheda-adl.component';
import { SchedaIADLComponent } from './component/cartella-educativa/scheda-iadl/scheda-iadl.component';
import { DialogRiabilitazioneComponent } from './dialogs/dialog-riabilitazione/dialog-riabilitazione.component';
import { DialogDiarioAsssocialeComponent } from './dialogs/dialog-diario-asssociale/dialog-diario-asssociale.component';
import { DialogDiarioEducativoComponent } from './dialogs/dialog-diario-educativo/dialog-diario-educativo.component';
import { SocializzazioneEducativaComponent } from "./component/cartella-educativa/socializzazione-educativa/socializzazione-educativa.component";
import { ValutazioneMotoriaComponent } from './component/valutazione-motoria/valutazione-motoria.component';
import { AreaRiabilitativaComponent } from './component/area-riabilitativa/area-riabilitativa.component';
import { DialogRiabilitazioneLesioneComponent } from './dialogs/dialog-riabilitazione-lesione/dialog-riabilitazione-lesione.component';
import { AreaRiabilitazioneProgrammaComponent } from './component/area-riabilitazione-programma/area-riabilitazione-programma.component';
import { AreaRiabilitazioneDiarioComponent } from './component/area-riabilitazione-diario/area-riabilitazione-diario.component';
import { IndumentiIngressoComponent } from './component/indumenti-ingresso/indumenti-ingresso.component';
import { DialogRiabilitazioneDiarioComponent } from './dialogs/dialog-riabilitazione-diario/dialog-riabilitazione-diario.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterInformationDipendenteComponent } from './component/register-information-dipendente/register-information-dipendente.component';
import { GeneralePersonaleComponent } from './pages/generale-personale/generale-personale.component';
import { EsamiPrivacyPersonaleComponent } from './pages/esami-privacy-personale/esami-privacy-personale.component';
//import { LavoroPersonaleComponent } from './pages/lavoro-personale/lavoro-personale.component';
import { QualitaGeneraleComponent } from "./pages/areaqualita-generale/areaqualita-generale.component";
import { NominaDPOComponent } from "./pages/nominadpo/nominadpo.component";
import { NominaResponsabileComponent } from "./pages/nomina-responsabile/nomina-responsabile.component";
import { RichiestaMaterialeComponent } from './pages/richieste-materiale/richieste-materiale.component';
import { ArchivioConsulentiComponent } from './pages/archivio-consulenti/archivio-consulenti.component';
import { FerieAltroPersonaleComponent } from './pages/ferie-altro-personale/ferie-altro-personale.component';
import { DebugComponent } from './component/debug/debug.component';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { AreaOssComponent } from './pages/area-oss/area-oss.component';
import { DialogPreIngressoComponent } from './dialogs/dialog-pre-ingresso/dialog-pre-ingresso.component';
import { DialogIngressoComponent } from './dialogs/dialog-ingresso/dialog-ingresso.component';
import { DialogAttivitaComponent } from './dialogs/dialog-attivita/dialog-attivita.component';
import { DialogArmadioComponent } from './dialogs/dialog-armadio/dialog-armadio.component';
import { CamereComponent } from './pages/camere/camere.component';
import { AttivitaOssComponent } from './pages/attivita-oss/attivita-oss.component';
import { RegistroControlliOssComponent } from './pages/registro-controlli-oss/registro-controlli-oss.component';
import { CamereListComponent } from './pages/camere-list/camere-list.component';
import { CamereDetailsComponent } from './dialogs/camere-details/camere-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AltreinfoCartellasocialeComponent } from './component/altreinfo-cartellasociale/altreinfo-cartellasociale.component';
import { DialogAttivitaQuotidianeComponent } from './dialogs/dialog-attivita-quotidiane/dialog-attivita-quotidiane.component';
import { CamereMapComponent } from './pages/camere-map/camere-map.component';
import { SanificazioneListComponent } from './pages/sanificazione-list/sanificazione-list.component';
import { SanificazioneRegistroComponent } from './pages/sanificazione-registro/sanificazione-registro.component';
import { ArmadiListComponent } from './pages/armadi-list/armadi-list.component';

import { TranslatePianoPipe } from "./pipe/translatePiano.pipe";
import { SanificatePipe } from "./pipe/sanificate.pipe";
import { ArmadiCheckerPipe } from "./pipe/armadiChecker";
import { PrettyprintPipe } from './pipe/prettyprint.pipe';
import { CastingVerificaPipe } from "./pipe/castingVerifica";
import { IndumentiListComponent } from './pages/indumenti-list/indumenti-list.component';
import { IndumentiComponent } from './dialogs/indumenti/indumenti.component';
import { DialogIndumentiIngressoComponent } from './dialogs/dialog-indumento-ingresso/dialog-indumento-ingresso.component';
import { DialogIndumentoComponent } from './dialogs/dialog-indumento/dialog-indumento.component';
import { DialogRifacimentoLettiComponent } from './dialogs/dialog-rifacimento-letti/dialog-rifacimento-letti.component';
import { DialogVerificaArmadioComponent } from './dialogs/dialog-verifica-armadio/dialog-verifica-armadio.component';
//import { ChiaviOssComponent } from './pages/chiavi-oss/chiavi-oss.component';
//import { RifacimentoLettiOssComponent } from './pages/rifacimento-letti-oss/rifacimento-letti-oss.component';
import { LavanderiaInternaComponent } from './pages/lavanderia-interna/lavanderia-interna.component';
import { LavanderiaEsternaComponent } from './pages/lavanderia-esterna/lavanderia-esterna.component';
import { GestFarmaciComponent } from './pages/gest-farmaci/gest-farmaci.component';
import { GestPresidiComponent } from './pages/gest-presidi/gest-presidi.component';
import { GestFarmacipresidiPazientiComponent } from './pages/gest-farmacipresidi-pazienti/gest-farmacipresidi-pazienti.component';
import { DialogPresidioComponent } from './dialogs/dialog-presidio/dialog-presidio.component';
import { DialogSegnalazioneComponent } from './dialogs/dialog-segnalazione/dialog-segnalazione.component';
import { ModulisticafarmaciComponent } from './pages/modulisticafarmaci/modulisticafarmaci.component';
import { DialogPresidiPazienteComponent } from './dialogs/dialog-presidi-paziente/dialog-presidi-paziente.component';
import { DialogFarmaciPazienteComponent } from './dialogs/dialog-farmaci-paziente/dialog-farmaci-paziente.component';
import { DialogFarmacoPazienteComponent } from './dialogs/dialog-farmaco-paziente/dialog-farmaco-paziente.component';
import { DialogPresidioPazienteComponent } from './dialogs/dialog-presidio-paziente/dialog-presidio-paziente.component';
import { DialogModulisticaPazienteComponent } from './dialogs/dialog-modulistica-paziente/dialog-modulistica-paziente.component';
import { AttivitaFarmaciComponent } from './pages/attivita-farmaci/attivita-farmaci.component';
import { AttivitaPresidiComponent } from './pages/attivita-presidi/attivita-presidi.component';
import { AreaPaiComponent } from './pages/area-pai/area-pai.component';
import { DialogPaiComponent } from './dialogs/dialog-pai/dialog-pai.component';
import { GestionePuliziaAmbientiComponent } from './pages/gestione-pulizia-ambienti/gestione-pulizia-ambienti.component';
import { DialogPuliziaAmbientiComponent } from './dialogs/dialog-pulizia-ambienti/dialog-pulizia-ambienti.component';
import { LavanderiaComponent } from './pages/lavanderia/lavanderia.component';
import { DialogLavanderiaComponent } from './dialogs/dialog-lavanderia/dialog-lavanderia.component';
import { MenuPersonalizzatiComponent } from './pages/menu-personalizzati/menu-personalizzati.component';
import { DialogMenuPersonalizzatoComponent } from './dialogs/dialog-menu-personalizzato/dialog-menu-personalizzato.component';
import { DialogArchivioMenuPersonalizzatoComponent } from './dialogs/dialog-archivio-menu-personalizzato/dialog-archivio-menu-personalizzato.component';
import { MenuGeneraleComponent } from './pages/menu-generale/menu-generale.component';
import { DialogMenuGeneraleComponent } from './dialogs/dialog-menu-generale/dialog-menu-generale.component';
import { DatePipe } from "@angular/common";
import { MagazzinoComponent } from './pages/magazzino/magazzino.component';
import { DialogMagazzinoComponent } from './dialogs/dialog-magazzino/dialog-magazzino.component';
import { DialogCaricoMagazzinoComponent } from './dialogs/dialog-carico-magazzino/dialog-carico-magazzino.component';
import { CucinaSanificazioneAmbientiComponent } from './pages/cucina-sanificazione-ambienti/cucina-sanificazione-ambienti.component';
import { CucinaControlloTamponiComponent } from './pages/cucina-controllo-tamponi/cucina-controllo-tamponi.component';
import { CucinaAutoControlloComponent } from './pages/cucina-auto-controllo/cucina-auto-controllo.component';
import { CucinaDerrateAlimentariComponent } from './pages/cucina-derrate-alimentari/cucina-derrate-alimentari.component';
import { DialogCucinaDerranteAlimentiComponent } from './dialogs/dialog-cucina-derrante-alimenti/dialog-cucina-derrante-alimenti.component';
import { DialogCucinaDerranteAlimentiCaricoComponent } from './dialogs/dialog-cucina-derrante-alimenti-carico/dialog-cucina-derrante-alimenti-carico.component';
import { calendarioTurniComponent } from "./pages/calendario-turni/calendario-turni.component";
import { ArchivioCertificatiComponent } from "./pages/archivio-certificati/archivio-certificati.component";
import { AuditInternoComponent } from "./pages/audit-interno/audit-interno.component";
import { OrganigrammaComponent } from "./pages/organigramma/organigramma.component";
import { DialogControlloMensileComponent } from "./dialogs/dialog-controllo-mensile/dialog-controllo-mensile.component";
import { ControlloMensileComponent } from "./pages/controllo-mensile/controllo-mensile.component";
import { ReportControlloMensileComponent } from "./pages/Report-controllo-mensile/Report-controllo-mensile.component";
import { PianificazioneCorsiComponent } from "./pages/pianificazione-corsi/pianificazione-corsi.component";
import { ElencoModulisticaComponent } from "./pages/elenco-modulistica/elenco-modulistica.component";
import { ICFComponent } from "./component/assistente-sociale/ICF/ICF.component";
import { DialogTestRiabilitativoComponent } from "./dialogs/dialog-test/dialog-test.component";
import { VisitePreAssunzioniComponent } from "./pages/visita-pre-assunzioni/visita-pre-assunzioni.component";
import { VisitePeriodicheComponent } from "./pages/visita-periodica/visita-periodica.component";
import { MedicoLavoroComponent } from "./pages/medico-lavoro/medico-lavoro.component";
import { RLSComponent } from "./pages/rls/rls.component";
import { RSPPComponent } from "./pages/rspp/rspp.component";
import { AntincendioComponent } from "./pages/antincendio/antincendio.component";
import { AreaFormazioneComponent } from "./pages/area-formazione-sicurezza/area-formazione-sicurezza.component";
import { ControlloAntincendioComponent } from "./pages/controllo-antincendio/controllo-antincendio.component";
import { UploadDocComponent } from "./component/upload-doc/upload-doc.component";
import { ApparecchiatureComponent } from "./pages/apparecchiature-impianti/apparecchiature-impianti.component";
import { AutocertificazioniComponent } from "./pages/autocertificazioni/autocertificazioni.component";
import { CertificazioniComponent } from "./pages/certificazioni/certificazioni.component";
import { PianoScadenzeComponent } from "./pages/piano-scadenze/piano-scadenze.component";
import { VerificaAscensoriComponent } from "./pages/verifica-ascensori/verifica-ascensori.component";
import { PrevenzioneRischiComponent } from "./pages/prevenzione-rischi/prevenzione-rischi.component";
import { ControlloLegionellosiComponent } from "./pages/controllo-legionellosi/controllo-legionellosi.component";
import { AgendaClinicaComponent } from "./pages/agendaClinica/agendaClinica.component";
import { DialogAgendaClinicaComponent } from "./dialogs/dialog-agendaClinica/dialog-agendaClinica.component";
import { DialogCaricadocumentoMedicinaComponent } from "./dialogs/dialog-caricadocumentoMedicina/dialog-caricadocumentoMedicina.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { UtenzaComponent } from "./component/utenza/utenza.component";
import { ContrattiConsulentiComponent } from "./pages/contratti-consulenti/contratti-consulenti.component";
import { DialogRichiestaPresidiComponent } from "./dialogs/dialog-richiesta/dialog-richiesta.component";
import { RichiestaPresidiComponent } from "./component/richiestePresidi/richiestePresidi.component";

const materialModules = [
  MatTableModule,
  MatCheckboxModule,
  MatButtonModule,
  MatPaginatorModule,
  MatInputModule,
  MatSelectModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatDialogModule,
  MatCardModule,
  MatIconModule,
  MatTabsModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,

  FormsModule,

];

//const dataPicker = [
//   NgxMatDatetimePickerModule,
//   NgxMatTimepickerModule,
//   NgxMatNativeDateModule,
//   MatDatepickerModule
//];

const dialogModule = [
  DialogPisicologicaComponent,
  DialogDiarioComponent,
  DialogTestRiabilitativoComponent,
  DialogStanzaComponent,
  DialogCartellaClinicaComponent,
  DialogCartellaInfermeristicaComponent,
  DialogEventComponent,
  DialogTurniComponent,
  DialogFarmacoComponent,
  DialogPresidioComponent,
  DialogDipendenteComponent,
  DialogConsulenteComponent,
  DialogFornitoreComponent,
  DialogAspComponent,
  DialogMessageErrorComponent,
  DialogPazienteComponent,
  DialogDocumentComponent,
  DialogCvComponent,
  DialogCaricadocumentoComponent,
  DialogCaricadocumentoMedicinaComponent,
  DialogQuestionComponent,
  DialogDiarioClinicoComponent,
  DialogVisitespecialisticheComponent,
  DialogInterventiComponent,
  DialogSegnalazioneComponent,
  DialogAgendaClinicaComponent,
  DialogRichiestaPresidiComponent,
  DialogCartellaAssistenteSocialeComponent,
  DialogCartellaEducativaComponent,
  DialogRiabilitazioneComponent,
  DialogDiarioAsssocialeComponent,
  DialogDiarioEducativoComponent,
  DialogRiabilitazioneLesioneComponent,
  DialogRiabilitazioneDiarioComponent,
  DialogPreIngressoComponent,
  DialogIngressoComponent,
  DialogControlloMensileComponent,
  DialogAttivitaComponent,
  DialogArmadioComponent,
  CamereDetailsComponent,
  IndumentiComponent,
  DialogIndumentiIngressoComponent,
  DialogRifacimentoLettiComponent,
  DialogIndumentoComponent,
  DialogVerificaArmadioComponent,
];

const pipes = [
  PrettyprintPipe,
  TranslatePianoPipe,
  SanificatePipe,
  ArmadiCheckerPipe,
  CastingVerificaPipe,
];
@NgModule({
  declarations: [
    AppComponent,
    ...dialogModule,
    ...pipes,
    DiarioPisicoComponent,
    MenuComponent,
    MenuItemComponent,
    PsicologicaComponent,
    SegnalazioneComponent,
    PazienteGeneraleComponent,
    EsamePisicoComponent,
    ValutaPisicoComponent,
    OspitiComponent,
    TableOspitiComponent,
    TableFornitoriComponent,
    AreaEducativaComponent,
    AreaFisioterapiaComponent,
    AreaMedicaComponent,
    AreaInfermieristicaComponent,
    GestUtentiComponent,
    GeneralePersonaleComponent,
    GestStanzeComponent,
    CalendarComponent,
    VisitePreAssunzioniComponent,
    VisitePeriodicheComponent,
    MedicoLavoroComponent,
    RLSComponent,
    RSPPComponent,
    AntincendioComponent,
    ContrattiConsulentiComponent,
    AgendaClinicaComponent,
    ApparecchiatureComponent,
    AutocertificazioniComponent,
    PrevenzioneRischiComponent,
    ControlloLegionellosiComponent,
    VerificaAscensoriComponent,
    PianoScadenzeComponent,
    CertificazioniComponent,
    AreaFormazioneComponent,
    ControlloAntincendioComponent,
    DashboardComponent,
    calendarioTurniComponent,
    AnamnesiFamigliareComponent,
    EsameGeneraleComponent,
    EsameNeurologicaComponent,
    MezziContenzioneComponent,
    ValutazioneTecnicheComponent,
    VisiteSpecialisticheComponent,
    AnamnesiPatologicaComponent,
    SchedaBAIComponent,
    SchedaUlcereComponent,
    AssegnazioneLettoComponent,
    SchedaMNARComponent,
    SchedaVASComponent,
    SchedaUlcereDiabeteComponent,
    SchedaLesioniCutaneeComponent,
    SchedaLesioniDecubitoComponent,
    SchedaInterventiComponent,
    ConsulentiComponent,
    FattureConsulentiComponent,
    BonificiConsulentiComponent,
    AdminFornitoriComponent,
    FattureFornitoriComponent,
    BonificiFornitoriComponent,
    FattureSSRComponent,
    FattureSSComponent,
    AnticipoFattureASPComponent,
    NoteCreditoASPComponent,
    ProspettoCMASPComponent,
    PuntoFattureASPComponent,
    AspComponent,
    PagenotfoundComponent,
    FarmaciComponent,
    AdminPazientiComponent,
    UploadComponent,
    LoginComponent,
    TableDipendentiComponent,
    FerieComponent,
    UploadDocComponent,
    RichiestaPresidiComponent,
    UtenzaComponent,
    PermessiComponent,
    TurnimensiliComponent,
    CambiturnoComponent,
    ContrattoConsulentiComponent,
    PresenzeComponent,
    FornitoreGeneraleComponent,
    DipendenteGeneraleComponent,
    TableDocumentComponent,
    CvComponent,
    TableFattureFornitoriComponent,
    DiarioClinicoComponent,
    AutorizzazioneUscitaComponent,
    DimissioniComponent,
    DecessoComponent,
    EsitiStrumentaliComponent,
    ParametriVitaliComponent,
    SliderDateComponent,
    ArchiviVisiteSpecialisticheComponent,
    ArchiveDocumentsComponent,
    ArchiviEsitoStrumentaleComponent,
    ArchiviRefertiEmatochimiciComponent,
    ArchiviVerbaliComponent,
    ArchiviRelazioniCertificatiComponent,
    ArchiviImpegnativeComponent,
    ArchiviPAIComponent,
    AreaSocialeComponent,
    ValutazioneSocialeComponent,
    IndiceSocializzazioneComponent,
    ICFComponent,
    DiarioSocialeComponent,
    DiarioEducativoComponent,
    ValutazioneEducativaComponent,
    SchedaADLComponent,
    SocializzazioneEducativaComponent,
    SchedaIADLComponent,
    ValutazioneMotoriaComponent,
    AreaRiabilitativaComponent,
    AreaRiabilitazioneProgrammaComponent,
    IndumentiIngressoComponent,
    AreaRiabilitazioneDiarioComponent,
    RegisterComponent,
    RegisterInformationDipendenteComponent,
    GeneralePersonaleComponent,
    EsamiPrivacyPersonaleComponent,
    //LavoroPersonaleComponent,
    QualitaGeneraleComponent,
    ElencoModulisticaComponent,
    NominaDPOComponent,
    PianificazioneCorsiComponent,
    AuditInternoComponent,
    OrganigrammaComponent,
    ArchivioCertificatiComponent,
    ControlloMensileComponent,
    ReportControlloMensileComponent,
    NominaResponsabileComponent,
    RichiestaMaterialeComponent,
    ArchivioConsulentiComponent,
    FerieAltroPersonaleComponent,
    DebugComponent,
    AuthorizationComponent,
    SettingsComponent,
    AreaOssComponent,
    CamereComponent,
    AttivitaOssComponent,
    RegistroControlliOssComponent,
    CamereListComponent,
    CamereMapComponent,
    SanificazioneListComponent,
    SanificazioneRegistroComponent,
    ArmadiListComponent,
    AltreinfoCartellasocialeComponent,
    DialogAttivitaQuotidianeComponent,
    IndumentiListComponent,
    //ChiaviOssComponent,
    //RifacimentoLettiOssComponent,
    LavanderiaInternaComponent,
    LavanderiaEsternaComponent,
    GestFarmaciComponent,
    GestPresidiComponent,
    GestFarmacipresidiPazientiComponent,
    DialogPresidioComponent,
    ModulisticafarmaciComponent,
    DialogPresidiPazienteComponent,
    DialogFarmaciPazienteComponent,
    DialogFarmacoPazienteComponent,
    DialogPresidioPazienteComponent,
    DialogSegnalazioneComponent,
    DialogAgendaClinicaComponent,
    DialogRichiestaPresidiComponent,
    DialogModulisticaPazienteComponent,
    AttivitaFarmaciComponent,
    AttivitaPresidiComponent,
    AreaPaiComponent,
    DialogPaiComponent,
    GestionePuliziaAmbientiComponent,
    DialogPuliziaAmbientiComponent,
    LavanderiaComponent,
    DialogLavanderiaComponent,
    MenuPersonalizzatiComponent,
    DialogMenuPersonalizzatoComponent,
    DialogArchivioMenuPersonalizzatoComponent,
    MenuGeneraleComponent,
    DialogMenuGeneraleComponent,
    MagazzinoComponent,
    DialogMagazzinoComponent,
    DialogCaricoMagazzinoComponent,
    CucinaSanificazioneAmbientiComponent,
    CucinaControlloTamponiComponent,
    CucinaAutoControlloComponent,
    CucinaDerrateAlimentariComponent,
    DialogCucinaDerranteAlimentiComponent,
    DialogCucinaDerranteAlimentiCaricoComponent,
  ],
  imports: [
    ...materialModules,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    HttpClientModule,
    ChartsModule,
  ],
  providers: [
    AuthGuardService,
    MatDatepickerModule,
    ThemeService,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: "it-IT" },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogPisicologicaComponent,
    DialogDiarioComponent,
    DialogTestRiabilitativoComponent,
    DialogStanzaComponent,
    DialogCartellaClinicaComponent,
    DialogCartellaInfermeristicaComponent,
    DialogCartellaAssistenteSocialeComponent,
    DialogCartellaEducativaComponent,
    DialogEventComponent,
    DialogFarmacoComponent,
    DialogPresidioComponent,
    DialogDipendenteComponent,
    DialogConsulenteComponent,
    DialogFornitoreComponent,
    DialogAspComponent,
    DialogMessageErrorComponent,
    DialogPazienteComponent,
    DialogCvComponent,
    DialogCaricadocumentoComponent,
    DialogCaricadocumentoMedicinaComponent,
    DialogQuestionComponent,
    DialogDiarioClinicoComponent,
    DialogVisitespecialisticheComponent,
    DialogInterventiComponent,
    DialogRiabilitazioneComponent,
    DialogRiabilitazioneLesioneComponent,
    DialogRiabilitazioneDiarioComponent,
    DialogDiarioEducativoComponent,
    DialogDiarioAsssocialeComponent,
    DialogPreIngressoComponent,
    DialogIngressoComponent,
    DialogControlloMensileComponent,
    DialogAttivitaComponent,
    DialogArmadioComponent,
  ],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
