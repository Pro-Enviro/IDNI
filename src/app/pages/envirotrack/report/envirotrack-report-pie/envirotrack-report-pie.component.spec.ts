import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportPieComponent } from './envirotrack-report-pie.component';

describe('EnvirotrackReportPieComponent', () => {
  let component: EnvirotrackReportPieComponent;
  let fixture: ComponentFixture<EnvirotrackReportPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportPieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
