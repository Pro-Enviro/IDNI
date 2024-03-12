import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTechComponent } from './latest-tech.component';

describe('LatestTechComponent', () => {
  let component: LatestTechComponent;
  let fixture: ComponentFixture<LatestTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestTechComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LatestTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
