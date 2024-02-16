import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportComponent } from './envirotrack-report.component';

describe('EnvirotrackReportComponent', () => {
  let component: EnvirotrackReportComponent;
  let fixture: ComponentFixture<EnvirotrackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
