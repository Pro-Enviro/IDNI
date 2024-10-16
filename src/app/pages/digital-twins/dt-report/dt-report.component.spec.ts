import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtReportComponent } from './dt-report.component';

describe('DtReportComponent', () => {
  let component: DtReportComponent;
  let fixture: ComponentFixture<DtReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DtReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DtReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
