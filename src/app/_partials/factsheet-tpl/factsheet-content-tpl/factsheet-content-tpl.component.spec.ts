import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactsheetContentTplComponent } from './factsheet-content-tpl.component';

describe('FactsheetContentTplComponent', () => {
  let component: FactsheetContentTplComponent;
  let fixture: ComponentFixture<FactsheetContentTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactsheetContentTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactsheetContentTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
