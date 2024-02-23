import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackBarSmallComponent } from './envirotrack-bar-small.component';

describe('EnvirotrackBarSmallComponent', () => {
  let component: EnvirotrackBarSmallComponent;
  let fixture: ComponentFixture<EnvirotrackBarSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvirotrackBarSmallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvirotrackBarSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
