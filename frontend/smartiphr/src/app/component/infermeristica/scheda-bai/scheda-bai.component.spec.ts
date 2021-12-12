import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { SchedaBAI } from "src/app/models/SchedaBAI";

import { SchedaBAIComponent } from "./scheda-bai.component";

describe("SchedaBAIComponent", () => {
  let component: SchedaBAIComponent;
  let fixture: ComponentFixture<SchedaBAIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SchedaBAIComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaBAIComponent);
    component = fixture.componentInstance;
    component.data = new SchedaBAI();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
