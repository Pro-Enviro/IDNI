import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroCarbonComponent } from './zero-carbon.component';

describe('ZeroCarbonComponent', () => {
  let component: ZeroCarbonComponent;
  let fixture: ComponentFixture<ZeroCarbonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZeroCarbonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZeroCarbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
