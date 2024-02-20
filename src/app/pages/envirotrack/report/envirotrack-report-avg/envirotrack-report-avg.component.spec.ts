import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportAvgComponent } from './envirotrack-report-avg.component';

describe('EnvirotrackReportAvgComponent', () => {
  let component: EnvirotrackReportAvgComponent;
  let fixture: ComponentFixture<EnvirotrackReportAvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportAvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportAvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
