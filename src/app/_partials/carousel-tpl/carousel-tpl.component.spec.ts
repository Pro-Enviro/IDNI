import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselTplComponent } from './carousel-tpl.component';

describe('CarouselTplComponent', () => {
  let component: CarouselTplComponent;
  let fixture: ComponentFixture<CarouselTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarouselTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
