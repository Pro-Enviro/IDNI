import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportScatterComponent } from './envirotrack-report-scatter.component';

describe('EnvirotrackReportScatterComponent', () => {
  let component: EnvirotrackReportScatterComponent;
  let fixture: ComponentFixture<EnvirotrackReportScatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportScatterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
