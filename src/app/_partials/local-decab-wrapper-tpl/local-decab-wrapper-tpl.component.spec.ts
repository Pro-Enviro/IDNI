import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalDecabWrapperTplComponent } from './local-decab-wrapper-tpl.component';

describe('LocalDecabWrapperTplComponent', () => {
  let component: LocalDecabWrapperTplComponent;
  let fixture: ComponentFixture<LocalDecabWrapperTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalDecabWrapperTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalDecabWrapperTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
