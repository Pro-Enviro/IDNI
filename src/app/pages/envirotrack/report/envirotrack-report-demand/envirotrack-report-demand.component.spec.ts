import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportDemandComponent } from './envirotrack-report-demand.component';

describe('EnvirotrackReportDemandComponent', () => {
  let component: EnvirotrackReportDemandComponent;
  let fixture: ComponentFixture<EnvirotrackReportDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportDemandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
