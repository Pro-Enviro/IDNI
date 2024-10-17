import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtClusterComponent } from './dt-cluster.component';

describe('DtClusterComponent', () => {
  let component: DtClusterComponent;
  let fixture: ComponentFixture<DtClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DtClusterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DtClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
