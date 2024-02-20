import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackDayLineComponent } from './envirotrack-day-line.component';

describe('EnvirotrackDayLineComponent', () => {
  let component: EnvirotrackDayLineComponent;
  let fixture: ComponentFixture<EnvirotrackDayLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvirotrackDayLineComponent]
    });
    fixture = TestBed.createComponent(EnvirotrackDayLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
