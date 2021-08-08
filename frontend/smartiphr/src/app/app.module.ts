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
import { DialogPisicologicaComponent } from './dialogs/dialog-pisicologica/dialog-pisicologica.component';
import { PazienteGeneraleComponent } from './component/paziente-generale/paziente-generale.component';
import { EsamePisicoComponent } from './component/psicologica/esame-pisico/esame-pisico.component';
import { ValutaPisicoComponent } from './component/psicologica/valuta-pisico/valuta-pisico.component';
import { DiarioPisicoComponent } from './component/psicologica/diario-pisico/diario-pisico.component';
import { DialogDiarioComponent } from './dialogs/dialog-diario/dialog-diario.component';

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
    DialogDiarioComponent
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
    FormsModule,
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent],
  entryComponents: [DialogPisicologicaComponent, DialogDiarioComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
