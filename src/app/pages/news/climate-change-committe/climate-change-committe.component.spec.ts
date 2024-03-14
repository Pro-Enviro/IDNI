import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimateChangeCommitteComponent } from './climate-change-committe.component';

describe('ClimateChangeCommitteComponent', () => {
  let component: ClimateChangeCommitteComponent;
  let fixture: ComponentFixture<ClimateChangeCommitteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimateChangeCommitteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClimateChangeCommitteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
