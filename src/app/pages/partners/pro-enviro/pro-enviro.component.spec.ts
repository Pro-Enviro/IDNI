import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProEnviroComponent } from './pro-enviro.component';

describe('ProEnviroComponent', () => {
  let component: ProEnviroComponent;
  let fixture: ComponentFixture<ProEnviroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProEnviroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProEnviroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
