import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalDecarbonisationComponent } from './local-decarbonisation.component';

describe('LocalDecarbonisationComponent', () => {
  let component: LocalDecarbonisationComponent;
  let fixture: ComponentFixture<LocalDecarbonisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalDecarbonisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalDecarbonisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
