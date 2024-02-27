import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColTplComponent } from './two-col-tpl.component';

describe('TwoColTplComponent', () => {
  let component: TwoColTplComponent;
  let fixture: ComponentFixture<TwoColTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoColTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TwoColTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
