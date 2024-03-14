import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyEfficiencyComponent } from './energy-efficiency.component';

describe('EnergyEfficiencyComponent', () => {
  let component: EnergyEfficiencyComponent;
  let fixture: ComponentFixture<EnergyEfficiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyEfficiencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnergyEfficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
