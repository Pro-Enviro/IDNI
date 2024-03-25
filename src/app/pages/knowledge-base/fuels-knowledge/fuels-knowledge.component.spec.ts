import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelsKnowledgeComponent } from './fuels-knowledge.component';

describe('FuelsKnowledgeComponent', () => {
  let component: FuelsKnowledgeComponent;
  let fixture: ComponentFixture<FuelsKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelsKnowledgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelsKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
