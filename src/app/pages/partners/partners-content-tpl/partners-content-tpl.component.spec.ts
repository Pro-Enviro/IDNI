import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersContentTplComponent } from './partners-content-tpl.component';

describe('PartnersContentTplComponent', () => {
  let component: PartnersContentTplComponent;
  let fixture: ComponentFixture<PartnersContentTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnersContentTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnersContentTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
