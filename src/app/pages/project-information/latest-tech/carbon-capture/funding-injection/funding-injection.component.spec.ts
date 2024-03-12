import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingInjectionComponent } from './funding-injection.component';

describe('FundingInjectionComponent', () => {
  let component: FundingInjectionComponent;
  let fixture: ComponentFixture<FundingInjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundingInjectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundingInjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
