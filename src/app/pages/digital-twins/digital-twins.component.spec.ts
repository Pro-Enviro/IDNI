import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalTwinsComponent } from './digital-twins.component';

describe('DigitalTwinsComponent', () => {
  let component: DigitalTwinsComponent;
  let fixture: ComponentFixture<DigitalTwinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalTwinsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DigitalTwinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
