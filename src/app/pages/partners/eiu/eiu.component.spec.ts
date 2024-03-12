import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EiuComponent } from './eiu.component';

describe('EiuComponent', () => {
  let component: EiuComponent;
  let fixture: ComponentFixture<EiuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EiuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EiuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
