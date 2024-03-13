import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HydrogenPowerComponent } from './hydrogen-power.component';

describe('HydrogenPowerComponent', () => {
  let component: HydrogenPowerComponent;
  let fixture: ComponentFixture<HydrogenPowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HydrogenPowerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HydrogenPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
