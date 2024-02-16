import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportBarComponent } from './envirotrack-report-bar.component';

describe('EnvirotrackReportBarComponent', () => {
  let component: EnvirotrackReportBarComponent;
  let fixture: ComponentFixture<EnvirotrackReportBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
