import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCaptureSpreadsheetFuelsComponent } from './data-capture-spreadsheet-fuels.component';

describe('DataCaptureSpreadsheetFuelsComponent', () => {
  let component: DataCaptureSpreadsheetFuelsComponent;
  let fixture: ComponentFixture<DataCaptureSpreadsheetFuelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataCaptureSpreadsheetFuelsComponent]
    });
    fixture = TestBed.createComponent(DataCaptureSpreadsheetFuelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
