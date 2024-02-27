import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsxTplComponent } from './msx-tpl.component';

describe('MsxTplComponent', () => {
  let component: MsxTplComponent;
  let fixture: ComponentFixture<MsxTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsxTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MsxTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
