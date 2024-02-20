import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCaptureSpreadsheetFuelsFieldsComponent } from './data-capture-spreadsheet-fuels-fields.component';

describe('DataCaptureSpreadsheetFuelsFieldsComponent', () => {
  let component: DataCaptureSpreadsheetFuelsFieldsComponent;
  let fixture: ComponentFixture<DataCaptureSpreadsheetFuelsFieldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataCaptureSpreadsheetFuelsFieldsComponent]
    });
    fixture = TestBed.createComponent(DataCaptureSpreadsheetFuelsFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
