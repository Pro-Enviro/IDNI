import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeChartComponent } from './scope-chart.component';

describe('ScopeChartComponent', () => {
  let component: ScopeChartComponent;
  let fixture: ComponentFixture<ScopeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScopeChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
