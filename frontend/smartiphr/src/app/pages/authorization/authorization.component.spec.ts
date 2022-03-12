import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MansioniService } from "src/app/service/mansioni.service";

import { AuthorizationComponent } from "./authorization.component";

describe("AuthorizationComponent", () => {
  let component: AuthorizationComponent;
  let fixture: ComponentFixture<AuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AuthorizationComponent],
    }).compileComponents();


  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {



    expect(component).toBeTruthy();
  });
});
