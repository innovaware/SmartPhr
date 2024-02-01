import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppRoutingModule } from "src/app/app-routing.module";
import { CalendarComponent } from "src/app/component/calendar/calendar.component";
import { CambiturnoComponent } from "src/app/component/cambiturno/cambiturno.component";
import { DiarioPisicoComponent } from 'src/app/component/diario/diario.component';
import { DipendenteGeneraleComponent } from "src/app/component/dipendente-generale/dipendente-generale.component";
import { FerieComponent } from "src/app/component/ferie/ferie.component";
import { FornitoreGeneraleComponent } from "src/app/component/fornitore-generale/fornitore-generale.component";
import { SchedaBAIComponent } from "src/app/component/infermeristica/scheda-bai/scheda-bai.component";
import { SchedaInterventiComponent } from "src/app/component/infermeristica/scheda-interventi/scheda-interventi.component";
import { SchedaLesioniCutaneeComponent } from "src/app/component/infermeristica/scheda-lesioni-cutanee/scheda-lesioni-cutanee.component";
import { SchedaLesioniDecubitoComponent } from "src/app/component/infermeristica/scheda-lesioni-decubito/scheda-lesioni-decubito.component";
import { SchedaMNARComponent } from "src/app/component/infermeristica/scheda-mnar/scheda-mnar.component";
import { SchedaUlcereDiabeteComponent } from "src/app/component/infermeristica/scheda-ulcere-diabete/scheda-ulcere-diabete.component";
import { SchedaUlcereComponent } from "src/app/component/infermeristica/scheda-ulcere/scheda-ulcere.component";
import { SchedaVASComponent } from "src/app/component/infermeristica/scheda-vas/scheda-vas.component";
import { AnamnesiFamigliareComponent } from "src/app/component/medica/anamnesi-famigliare/anamnesi-famigliare.component";
import { AnamnesiPatologicaComponent } from "src/app/component/medica/anamnesi-patologica/anamnesi-patologica.component";
import { DiarioClinicoComponent } from "src/app/component/medica/diario-clinico/diario-clinico.component";
import { EsameGeneraleComponent } from "src/app/component/medica/esame-generale/esame-generale.component";
import { EsameNeurologicaComponent } from "src/app/component/medica/esame-neurologica/esame-neurologica.component";
import { MezziContenzioneComponent } from "src/app/component/medica/mezzi-contenzione/mezzi-contenzione.component";
import { ValutazioneTecnicheComponent } from "src/app/component/medica/valutazione-tecniche/valutazione-tecniche.component";
import { VisiteSpecialisticheComponent } from "src/app/component/medica/visite-specialistiche/visite-specialistiche.component";
import { PazienteGeneraleComponent } from "src/app/component/paziente-generale/paziente-generale.component";
import { PermessiComponent } from "src/app/component/permessi/permessi.component";
import { PresenzeComponent } from "src/app/component/presenze/presenze.component";
import { EsamePisicoComponent } from "src/app/component/psicologica/esame-pisico/esame-pisico.component";
import { ValutaPisicoComponent } from "src/app/component/psicologica/valuta-pisico/valuta-pisico.component";
import { TableDipendentiComponent } from "src/app/component/table-dipendenti/table-dipendenti.component";
import { TableDocumentComponent } from "src/app/component/table-document/table-document.component";
import { TableFattureFornitoriComponent } from "src/app/component/table-fatture-fornitori/table-fatture-fornitori.component";
import { TableFornitoriComponent } from "src/app/component/table-fornitori/table-fornitori.component";
import { TableOspitiComponent } from "src/app/component/table-ospiti/table-ospiti.component";
import { TurnimensiliComponent } from "src/app/component/turnimensili/turnimensili.component";
import { UploadComponent } from "src/app/components/upload/upload.component";
import { AuthGuardService } from "src/app/guard/auth-guard.service";
import { Paziente } from 'src/app/models/paziente';
import { AdminFornitoriComponent } from "src/app/pages/admin-fornitori/admin-fornitori.component";
import { AdminPazientiComponent } from "src/app/pages/admin-pazienti/admin-pazienti.component";
import { AnticipoFattureASPComponent } from "src/app/pages/anticipo-fatture-asp/anticipo-fatture-asp.component";
import { AreaEducativaComponent } from "src/app/pages/area-educativa/area-educativa.component";
import { AreaFisioterapiaComponent } from "src/app/pages/area-fisioterapia/area-fisioterapia.component";
import { AreaInfermieristicaComponent } from "src/app/pages/area-infermieristica/area-infermieristica.component";
import { AreaMedicaComponent } from "src/app/pages/area-medica/area-medica.component";
import { AspComponent } from "src/app/pages/asp/asp.component";
import { BonificiFornitoriComponent } from "src/app/pages/bonifici-fornitori/bonifici-fornitori.component";
import { ConsulentiComponent } from "src/app/pages/consulenti/consulenti.component";
import { CvComponent } from "src/app/pages/cv/cv.component";
import { DashboardComponent } from "src/app/pages/dashboard/dashboard.component";
import { FarmaciComponent } from "src/app/pages/farmaci/farmaci.component";
import { FattureFornitoriComponent } from "src/app/pages/fatture-fornitori/fatture-fornitori.component";
import { FattureSSComponent } from "src/app/pages/fatture-ss/fatture-ss.component";
import { FattureSSRComponent } from "src/app/pages/fatture-ssr/fatture-ssr.component";
import { GestStanzeComponent } from "src/app/pages/gest-stanze/gest-stanze.component";
import { GestUtentiComponent } from "src/app/pages/gest-utenti/gest-utenti.component";
import { LoginComponent } from "src/app/pages/login/login.component";
import { NoteCreditoASPComponent } from "src/app/pages/note-credito-asp/note-credito-asp.component";
import { OspitiComponent } from "src/app/pages/ospiti/ospiti.component";
import { PagenotfoundComponent } from "src/app/pages/pagenotfound/pagenotfound.component";
import { PisicologicaComponent } from "src/app/pages/pisicologica/pisicologica.component";
import { ProspettoCMASPComponent } from "src/app/pages/prospetto-cm-asp/prospetto-cm-asp.component";
import { PuntoFattureASPComponent } from "src/app/pages/punto-fatture-asp/punto-fatture-asp.component";
import { BasicAuthInterceptor } from "src/app/_helpers/basic-auth.interceptor";
import { DialogAspComponent } from "../dialog-asp/dialog-asp.component";
import { DialogCaricadocumentoComponent } from "../dialog-caricadocumento/dialog-caricadocumento.component";
import { DialogCartellaClinicaComponent } from "../dialog-cartella-clinica/dialog-cartella-clinica.component";
import { DialogConsulenteComponent } from "../dialog-consulente/dialog-consulente.component";
import { DialogCvComponent } from "../dialog-cv/dialog-cv.component";
import { DialogDiarioComponent } from "../dialog-diario/dialog-diario.component";
import { DialogDipendenteComponent } from "../dialog-dipendente/dialog-dipendente.component";
import { DialogDocumentComponent } from "../dialog-document/dialog-document.component";
import { DialogEventComponent } from "../dialog-event/dialog-event.component";
import { DialogFarmacoComponent } from "../dialog-farmaco/dialog-farmaco.component";
import { DialogFornitoreComponent } from "../dialog-fornitore/dialog-fornitore.component";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";
import { DialogPazienteComponent } from "../dialog-paziente/dialog-paziente.component";
import { DialogPisicologicaComponent } from "../dialog-psicologica/dialog-psicologica.component";
import { DialogQuestionComponent } from "../dialog-question/dialog-question.component";
import { DialogStanzaComponent } from "../dialog-stanza/dialog-stanza.component";

import { DialogCartellaInfermeristicaComponent } from "./dialog-cartella-infermeristica.component";

describe("DialogCartellaInfermeristicaComponent", () => {
  let component: DialogCartellaInfermeristicaComponent;
  let fixture: ComponentFixture<DialogCartellaInfermeristicaComponent>;




  beforeEach(async(() => {
    const createPatient = () => {
      let patient: Paziente = new Paziente();
      patient.cognome = 'TEST';

      return patient;
    }

    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        MatDatepickerModule,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BasicAuthInterceptor,
          multi: true,
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue:  { paziente: createPatient(), readonly: false }},
      ],
      declarations: [
        DialogCartellaInfermeristicaComponent,
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
        PisicologicaComponent,
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
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCartellaInfermeristicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
