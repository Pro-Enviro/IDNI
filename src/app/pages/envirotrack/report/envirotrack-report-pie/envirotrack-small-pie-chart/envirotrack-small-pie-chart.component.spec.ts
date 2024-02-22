import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvirotrackSmallPieChartComponent } from './envirotrack-small-pie-chart.component';

describe('EnvirotrackSmallPieChartComponent', () => {
  let component: EnvirotrackSmallPieChartComponent;
  let fixture: ComponentFixture<EnvirotrackSmallPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvirotrackSmallPieChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvirotrackSmallPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
