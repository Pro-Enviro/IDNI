import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatContainersTplComponent } from './stat-containers-tpl.component';

describe('StatContainersTplComponent', () => {
  let component: StatContainersTplComponent;
  let fixture: ComponentFixture<StatContainersTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatContainersTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatContainersTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
