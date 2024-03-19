import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeYearChartComponent } from './type-year-chart.component';

describe('TypeYearChartComponent', () => {
  let component: TypeYearChartComponent;
  let fixture: ComponentFixture<TypeYearChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeYearChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeYearChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
