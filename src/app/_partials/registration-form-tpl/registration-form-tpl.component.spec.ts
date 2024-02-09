import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationFormTplComponent } from './registration-form-tpl.component';

describe('RegistrationFormTplComponent', () => {
  let component: RegistrationFormTplComponent;
  let fixture: ComponentFixture<RegistrationFormTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationFormTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrationFormTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
