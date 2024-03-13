import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamirusComponent } from './camirus.component';

describe('CamirusComponent', () => {
  let component: CamirusComponent;
  let fixture: ComponentFixture<CamirusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CamirusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CamirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
