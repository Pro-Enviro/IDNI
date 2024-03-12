import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestniComponent } from './investni.component';

describe('InvestniComponent', () => {
  let component: InvestniComponent;
  let fixture: ComponentFixture<InvestniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestniComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvestniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
