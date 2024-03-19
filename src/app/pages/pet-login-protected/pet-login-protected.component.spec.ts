import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetLoginProtectedComponent } from './pet-login-protected.component';

describe('PetLoginProtectedComponent', () => {
  let component: PetLoginProtectedComponent;
  let fixture: ComponentFixture<PetLoginProtectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetLoginProtectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetLoginProtectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
