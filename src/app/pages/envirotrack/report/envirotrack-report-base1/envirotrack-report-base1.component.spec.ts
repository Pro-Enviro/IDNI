import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportBase1Component } from './envirotrack-report-base1.component';

describe('EnvirotrackReportBase1Component', () => {
  let component: EnvirotrackReportBase1Component;
  let fixture: ComponentFixture<EnvirotrackReportBase1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportBase1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportBase1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
