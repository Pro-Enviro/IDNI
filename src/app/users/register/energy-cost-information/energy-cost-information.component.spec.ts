import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyCostInformationComponent } from './energy-cost-information.component';

describe('EnergyCostInformationComponent', () => {
  let component: EnergyCostInformationComponent;
  let fixture: ComponentFixture<EnergyCostInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnergyCostInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnergyCostInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
