import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalBecabSingleContentComponent } from './local-becab-single-content.component';

describe('LocalBecabSingleContentComponent', () => {
  let component: LocalBecabSingleContentComponent;
  let fixture: ComponentFixture<LocalBecabSingleContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalBecabSingleContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalBecabSingleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
