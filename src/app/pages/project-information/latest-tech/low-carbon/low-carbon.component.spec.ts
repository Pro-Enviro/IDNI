import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowCarbonComponent } from './low-carbon.component';

describe('LowCarbonComponent', () => {
  let component: LowCarbonComponent;
  let fixture: ComponentFixture<LowCarbonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LowCarbonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LowCarbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
