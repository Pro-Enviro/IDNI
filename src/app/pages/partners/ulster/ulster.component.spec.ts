import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UlsterComponent } from './ulster.component';

describe('UlsterComponent', () => {
  let component: UlsterComponent;
  let fixture: ComponentFixture<UlsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UlsterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UlsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
