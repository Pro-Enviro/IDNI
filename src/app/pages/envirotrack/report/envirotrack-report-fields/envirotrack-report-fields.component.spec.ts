import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackReportFieldsComponent } from './envirotrack-report-fields.component';

describe('EnvirotrackReportFieldsComponent', () => {
  let component: EnvirotrackReportFieldsComponent;
  let fixture: ComponentFixture<EnvirotrackReportFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvirotrackReportFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvirotrackReportFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
