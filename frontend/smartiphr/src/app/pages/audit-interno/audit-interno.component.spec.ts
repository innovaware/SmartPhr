import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditInternoComponent } from './audit-interno.component';


describe('AuditInternoComponent', () => {
  let component: AuditInternoComponent;
  let fixture: ComponentFixture<AuditInternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditInternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
