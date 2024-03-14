import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetZeroBusinessComponent } from './net-zero-business.component';

describe('NetZeroBusinessComponent', () => {
  let component: NetZeroBusinessComponent;
  let fixture: ComponentFixture<NetZeroBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetZeroBusinessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetZeroBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
