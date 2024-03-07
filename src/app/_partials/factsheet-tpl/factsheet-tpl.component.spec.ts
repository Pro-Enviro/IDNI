import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactsheetTplComponent } from './factsheet-tpl.component';

describe('FactsheetTplComponent', () => {
  let component: FactsheetTplComponent;
  let fixture: ComponentFixture<FactsheetTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactsheetTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactsheetTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
