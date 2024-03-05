import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalDecabMultiTplComponent } from './local-decab-multi-tpl.component';

describe('LocalDecabMultiTplComponent', () => {
  let component: LocalDecabMultiTplComponent;
  let fixture: ComponentFixture<LocalDecabMultiTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalDecabMultiTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalDecabMultiTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
