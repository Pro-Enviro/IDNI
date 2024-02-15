import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportHeatmapComponent } from './envirotrack-report-heatmap.component';

describe('EnvirotrackReportHeatmapComponent', () => {
  let component: EnvirotrackReportHeatmapComponent;
  let fixture: ComponentFixture<EnvirotrackReportHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportHeatmapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
