import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulisticafarmaciComponent } from './modulisticafarmaci.component';

describe('ModulisticafarmaciComponent', () => {
  let component: ModulisticafarmaciComponent;
  let fixture: ComponentFixture<ModulisticafarmaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulisticafarmaciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulisticafarmaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
