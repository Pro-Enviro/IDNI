import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatExchangeComponent } from './heat-exchange.component';

describe('HeatExchangeComponent', () => {
  let component: HeatExchangeComponent;
  let fixture: ComponentFixture<HeatExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatExchangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeatExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
