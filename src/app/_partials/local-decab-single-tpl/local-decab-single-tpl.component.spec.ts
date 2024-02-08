import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalDecabSingleTplComponent } from './local-decab-single-tpl.component';

describe('LocalDecabSingleTplComponent', () => {
  let component: LocalDecabSingleTplComponent;
  let fixture: ComponentFixture<LocalDecabSingleTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalDecabSingleTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalDecabSingleTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
