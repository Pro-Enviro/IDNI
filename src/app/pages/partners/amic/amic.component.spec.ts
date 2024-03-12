import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmicComponent } from './amic.component';

describe('AmicComponent', () => {
  let component: AmicComponent;
  let fixture: ComponentFixture<AmicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
