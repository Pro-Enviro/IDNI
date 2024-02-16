import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCaptureImportSpreadsheetComponent } from './data-capture-import-spreadsheet.component';

describe('DataCaptureImportSpreadsheetComponent', () => {
  let component: DataCaptureImportSpreadsheetComponent;
  let fixture: ComponentFixture<DataCaptureImportSpreadsheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataCaptureImportSpreadsheetComponent]
    });
    fixture = TestBed.createComponent(DataCaptureImportSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
