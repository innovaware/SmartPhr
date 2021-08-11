import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MenuItemComponent } from './component/menu-item/menu-item.component';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { MenuComponent } from './component/menu/menu.component';
import { PisicologicaComponent } from './pages/pisicologica/pisicologica.component';
import { PazienteGeneraleComponent } from './component/paziente-generale/paziente-generale.component';
import { EsamePisicoComponent } from './component/psicologica/esame-pisico/esame-pisico.component';
import { ValutaPisicoComponent } from './component/psicologica/valuta-pisico/valuta-pisico.component';
import { DiarioPisicoComponent } from './component/psicologica/diario-pisico/diario-pisico.component';

import { DialogPisicologicaComponent } from './dialogs/dialog-pisicologica/dialog-pisicologica.component';
import { DialogDiarioComponent } from './dialogs/dialog-diario/dialog-diario.component';
import { DialogCartellaClinicaComponent } from './dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component';
import { DialogCartellaInfermeristicaComponent } from './dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component';

import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule, MatNativeDateModule } from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { OspitiComponent } from './pages/ospiti/ospiti.component';
import { TableOspitiComponent } from './component/table-ospiti/table-ospiti.component';
import { AreaEducativaComponent } from './pages/area-educativa/area-educativa.component';
import { AreaFisioterapiaComponent } from './pages/area-fisioterapia/area-fisioterapia.component';
import { AreaMedicaComponent } from './pages/area-medica/area-medica.component';
import { AreaInfermieristicaComponent } from './pages/area-infermieristica/area-infermieristica.component';
import { GestUtentiComponent } from './pages/gest-utenti/gest-utenti.component';
import { GestStanzeComponent } from './pages/gest-stanze/gest-stanze.component';
import { DialogStanzaComponent } from './dialogs/dialog-stanza/dialog-stanza.component';
import { CalendarComponent } from './component/calendar/calendar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { AnamnesiFamigliareComponent } from './component/medica/anamnesi-famigliare/anamnesi-famigliare.component';
import { EsameGeneraleComponent } from './component/medica/esame-generale/esame-generale.component';
import { EsameNeurologicaComponent } from './component/medica/esame-neurologica/esame-neurologica.component';
import { MezziContenzioneComponent } from './component/medica/mezzi-contenzione/mezzi-contenzione.component';
import { ValutazioneTecnicheComponent } from './component/medica/valutazione-tecniche/valutazione-tecniche.component';
import { VisiteSpecialisticheComponent } from './component/medica/visite-specialistiche/visite-specialistiche.component';
import { AnamnesiPatologicaComponent } from './component/medica/anamnesi-patologica/anamnesi-patologica.component';
import { SchedaBAIComponent } from './component/infermeristica/scheda-bai/scheda-bai.component';
import { SchedaUlcereComponent } from './component/infermeristica/scheda-ulcere/scheda-ulcere.component';
import { SchedaMNARComponent } from './component/infermeristica/scheda-mnar/scheda-mnar.component';
import { SchedaVASComponent } from './component/infermeristica/scheda-vas/scheda-vas.component';
import { SchedaUlcereDiabeteComponent } from './component/infermeristica/scheda-ulcere-diabete/scheda-ulcere-diabete.component';
import { SchedaLesioniCutaneeComponent } from './component/infermeristica/scheda-lesioni-cutanee/scheda-lesioni-cutanee.component';
import { SchedaLesioniDecubitoComponent } from './component/infermeristica/scheda-lesioni-decubito/scheda-lesioni-decubito.component';
import { SchedaInterventiComponent } from './component/infermeristica/scheda-interventi/scheda-interventi.component';


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
    FormsModule,
    HttpClientModule,
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogPisicologicaComponent,
    DialogDiarioComponent,
    DialogStanzaComponent,
    DialogCartellaClinicaComponent,
    DialogCartellaInfermeristicaComponent,
  ]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
