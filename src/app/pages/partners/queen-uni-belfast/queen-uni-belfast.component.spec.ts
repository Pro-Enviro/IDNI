import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueenUniBelfastComponent } from './queen-uni-belfast.component';

describe('QueenUniBelfastComponent', () => {
  let component: QueenUniBelfastComponent;
  let fixture: ComponentFixture<QueenUniBelfastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueenUniBelfastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueenUniBelfastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
