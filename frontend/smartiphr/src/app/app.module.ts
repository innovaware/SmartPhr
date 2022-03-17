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
import { PisicologicaComponent } from "./pages/pisicologica/pisicologica.component";
import { PazienteGeneraleComponent } from "./component/paziente-generale/paziente-generale.component";
import { EsamePisicoComponent } from "./component/psicologica/esame-pisico/esame-pisico.component";
import { ValutaPisicoComponent } from "./component/psicologica/valuta-pisico/valuta-pisico.component";
import { DiarioPisicoComponent } from "./component/diario/diario.component";

import { DialogPisicologicaComponent } from "./dialogs/dialog-pisicologica/dialog-pisicologica.component";
import { DialogDiarioComponent } from "./dialogs/dialog-diario/dialog-diario.component";
import { DialogCartellaClinicaComponent } from "./dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component";
import { DialogCartellaInfermeristicaComponent } from "./dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component";

import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import {
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MAT_DATE_LOCALE,
} from "@angular/material";
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
import { SchedaMNARComponent } from "./component/infermeristica/scheda-mnar/scheda-mnar.component";
import { SchedaVASComponent } from "./component/infermeristica/scheda-vas/scheda-vas.component";
import { SchedaUlcereDiabeteComponent } from "./component/infermeristica/scheda-ulcere-diabete/scheda-ulcere-diabete.component";
import { SchedaLesioniCutaneeComponent } from "./component/infermeristica/scheda-lesioni-cutanee/scheda-lesioni-cutanee.component";
import { SchedaLesioniDecubitoComponent } from "./component/infermeristica/scheda-lesioni-decubito/scheda-lesioni-decubito.component";
import { SchedaInterventiComponent } from "./component/infermeristica/scheda-interventi/scheda-interventi.component";
import { DecessoComponent } from "./component/medica/decesso/decesso.component";
import { DialogEventComponent } from "./dialogs/dialog-event/dialog-event.component";

import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from "@angular-material-components/datetime-picker";

import { ConsulentiComponent } from "./pages/consulenti/consulenti.component";
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
import { DialogRiabilitazioneDiarioComponent } from './dialogs/dialog-riabilitazione-diario/dialog-riabilitazione-diario.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterInformationDipendenteComponent } from './component/register-information-dipendente/register-information-dipendente.component';
import { GeneralePersonaleComponent } from './pages/generale-personale/generale-personale.component';
import { EsamiPrivacyPersonaleComponent } from './pages/esami-privacy-personale/esami-privacy-personale.component';
import { LavoroPersonaleComponent } from './pages/lavoro-personale/lavoro-personale.component';
import { FerieAltroPersonaleComponent } from './pages/ferie-altro-personale/ferie-altro-personale.component';
import { DebugComponent } from './component/debug/debug.component';
import { PrettyprintPipe } from './pipe/prettyprint.pipe';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { AreaOssComponent } from './pages/area-oss/area-oss.component';
import { DialogPreIngressoComponent } from './dialogs/dialog-pre-ingresso/dialog-pre-ingresso.component';
import { DialogIngressoComponent } from './dialogs/dialog-ingresso/dialog-ingresso.component';
import { DialogAttivitaComponent } from './dialogs/dialog-attivita/dialog-attivita.component';
import { DialogArmadioComponent } from './dialogs/dialog-armadio/dialog-armadio.component';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuItemComponent,
    PisicologicaComponent,
    DialogPisicologicaComponent,
    PazienteGeneraleComponent,
    EsamePisicoComponent,
    ValutaPisicoComponent,
    DiarioPisicoComponent,
    DialogDiarioComponent,
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
    DialogStanzaComponent,
    CalendarComponent,
    DashboardComponent,
    DialogCartellaClinicaComponent,
    DialogCartellaInfermeristicaComponent,
    AnamnesiFamigliareComponent,
    EsameGeneraleComponent,
    EsameNeurologicaComponent,
    MezziContenzioneComponent,
    ValutazioneTecnicheComponent,
    VisiteSpecialisticheComponent,
    AnamnesiPatologicaComponent,
    SchedaBAIComponent,
    SchedaUlcereComponent,
    SchedaMNARComponent,
    SchedaVASComponent,
    SchedaUlcereDiabeteComponent,
    SchedaLesioniCutaneeComponent,
    SchedaLesioniDecubitoComponent,
    SchedaInterventiComponent,
    DialogEventComponent,
    ConsulentiComponent,
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
    DialogFarmacoComponent,
    DialogDipendenteComponent,
    DialogConsulenteComponent,
    DialogFornitoreComponent,
    DialogAspComponent,
    DialogMessageErrorComponent,
    AdminPazientiComponent,
    DialogPazienteComponent,
    UploadComponent,
    LoginComponent,
    TableDipendentiComponent,
    FerieComponent,
    PermessiComponent,
    TurnimensiliComponent,
    CambiturnoComponent,
    PresenzeComponent,
    FornitoreGeneraleComponent,
    DipendenteGeneraleComponent,
    DialogDocumentComponent,
    TableDocumentComponent,
    CvComponent,
    DialogCvComponent,
    TableFattureFornitoriComponent,
    DialogCaricadocumentoComponent,
    DialogQuestionComponent,
    DiarioClinicoComponent,
    DialogDiarioClinicoComponent,
    DialogVisitespecialisticheComponent,
    DialogInterventiComponent,
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
    DialogCartellaAssistenteSocialeComponent,
    AreaSocialeComponent,
    ValutazioneSocialeComponent,
    IndiceSocializzazioneComponent,
    DiarioSocialeComponent,
    DialogCartellaEducativaComponent,
    DiarioEducativoComponent,
    ValutazioneEducativaComponent,
    SchedaADLComponent,
    SocializzazioneEducativaComponent,
    SchedaIADLComponent,
    DialogRiabilitazioneComponent,
    DialogDiarioAsssocialeComponent,
    DialogDiarioEducativoComponent,
    ValutazioneMotoriaComponent,
    AreaRiabilitativaComponent,
    DialogRiabilitazioneLesioneComponent,
    AreaRiabilitazioneProgrammaComponent,
    AreaRiabilitazioneDiarioComponent,
    DialogRiabilitazioneDiarioComponent,
    RegisterComponent,
    RegisterInformationDipendenteComponent,
    GeneralePersonaleComponent,
    EsamiPrivacyPersonaleComponent,
    LavoroPersonaleComponent,
    FerieAltroPersonaleComponent,
    DebugComponent,
    PrettyprintPipe,
    AuthorizationComponent,
    AreaOssComponent,
    DialogPreIngressoComponent,
    DialogIngressoComponent,
    DialogAttivitaComponent,
    DialogArmadioComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
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
    FormsModule,
    HttpClientModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    ChartsModule,
  ],
  providers: [
    AuthGuardService,
    MatDatepickerModule,
    ThemeService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: "it-IT" },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogPisicologicaComponent,
    DialogDiarioComponent,
    DialogStanzaComponent,
    DialogCartellaClinicaComponent,
    DialogCartellaInfermeristicaComponent,
    DialogCartellaAssistenteSocialeComponent,
    DialogCartellaEducativaComponent,
    DialogEventComponent,
    DialogFarmacoComponent,
    DialogDipendenteComponent,
    DialogConsulenteComponent,
    DialogFornitoreComponent,
    DialogAspComponent,
    DialogMessageErrorComponent,
    DialogPazienteComponent,
    DialogCvComponent,
    DialogCaricadocumentoComponent,
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
    DialogAttivitaComponent,
    DialogArmadioComponent,
  ],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
