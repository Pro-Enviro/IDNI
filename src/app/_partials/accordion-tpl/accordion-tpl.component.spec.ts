import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionTplComponent } from './accordion-tpl.component';

describe('AccordionTplComponent', () => {
  let component: AccordionTplComponent;
  let fixture: ComponentFixture<AccordionTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccordionTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
