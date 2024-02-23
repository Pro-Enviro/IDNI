import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardWidgetsComponent } from './dasboard-widgets.component';

describe('DasboardWidgetsComponent', () => {
  let component: DasboardWidgetsComponent;
  let fixture: ComponentFixture<DasboardWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardWidgetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DasboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
