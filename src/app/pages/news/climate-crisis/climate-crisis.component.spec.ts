import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimateCrisisComponent } from './climate-crisis.component';

describe('ClimateCrisisComponent', () => {
  let component: ClimateCrisisComponent;
  let fixture: ComponentFixture<ClimateCrisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimateCrisisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClimateCrisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
