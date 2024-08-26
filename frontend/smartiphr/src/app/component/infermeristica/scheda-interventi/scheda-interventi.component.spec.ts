import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SchedaInterventiComponent } from "./scheda-interventi.component";

describe("SchedaInterventiComponent", () => {
  let component: SchedaInterventiComponent;
  let fixture: ComponentFixture<SchedaInterventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatTableModule,
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      declarations: [SchedaInterventiComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaInterventiComponent);
    component = fixture.componentInstance;
    component.data = [{
      data: new Date(),
      diagnosi: "Diagnosi",
      obiettivi: "Obiettivi",
      intervento: "Intervento",
      firma: "firma",
      valutazione: "valutazione"
    }];
    fixture.detectChanges();



  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
