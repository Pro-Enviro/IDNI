import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonCaptureComponent } from './carbon-capture.component';

describe('CarbonCaptureComponent', () => {
  let component: CarbonCaptureComponent;
  let fixture: ComponentFixture<CarbonCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonCaptureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarbonCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
