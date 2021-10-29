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
import { DiarioPisicoComponent } from "./component/psicologica/diario-pisico/diario-pisico.component";

import { DialogPisicologicaComponent } from "./dialogs/dialog-pisicologica/dialog-pisicologica.component";
import { DialogDiarioComponent } from "./dialogs/dialog-diario/dialog-diario.component";
import { DialogCartellaClinicaComponent } from "./dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component";
import { DialogCartellaInfermeristicaComponent } from "./dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component";

import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule, MatNativeDateModule } from "@angular/material";
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

 
import { AnticipoFattureASPComponent } from './pages/anticipo-fatture-asp/anticipo-fatture-asp.component';
import { NoteCreditoASPComponent } from './pages/note-credito-asp/note-credito-asp.component';
import { ProspettoCMASPComponent } from './pages/prospetto-cm-asp/prospetto-cm-asp.component';
import { PuntoFattureASPComponent } from './pages/punto-fatture-asp/punto-fatture-asp.component';

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
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './guard/auth-guard.service';
import { TableDipendentiComponent } from './component/table-dipendenti/table-dipendenti.component';
import { FerieComponent } from './component/ferie/ferie.component';
import { PermessiComponent } from './component/permessi/permessi.component';
import { TurnimensiliComponent } from './component/turnimensili/turnimensili.component';
import { CambiturnoComponent } from './component/cambiturno/cambiturno.component';
import { PresenzeComponent } from './component/presenze/presenze.component';
import { FornitoreGeneraleComponent } from './component/fornitore-generale/fornitore-generale.component';
import { DipendenteGeneraleComponent } from './component/dipendente-generale/dipendente-generale.component';
import { DialogDocumentComponent } from './dialogs/dialog-document/dialog-document.component';
import { TableDocumentComponent } from './component/table-document/table-document.component';
import { CvComponent } from './pages/cv/cv.component';
import { DialogCvComponent } from './dialogs/dialog-cv/dialog-cv.component';
//import { TableFattureFornitoriComponent } from './component/table-fatture-fornitori/table-fatture-fornitori.component';
import { DialogCaricadocumentoComponent } from './dialogs/dialog-caricadocumento/dialog-caricadocumento.component';
import { DialogQuestionComponent } from './dialogs/dialog-question/dialog-question.component';

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
    //TableFattureFornitoriComponent,
    DialogCaricadocumentoComponent,
    DialogQuestionComponent,
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
  ],
  providers: [
    AuthGuardService,
    MatDatepickerModule,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogPisicologicaComponent,
    DialogDiarioComponent,
    DialogStanzaComponent,
    DialogCartellaClinicaComponent,
    DialogCartellaInfermeristicaComponent,
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
  ],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
