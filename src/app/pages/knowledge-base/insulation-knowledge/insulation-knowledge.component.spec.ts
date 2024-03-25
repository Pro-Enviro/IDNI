import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsulationKnowledgeComponent } from './insulation-knowledge.component';

describe('InsulationKnowledgeComponent', () => {
  let component: InsulationKnowledgeComponent;
  let fixture: ComponentFixture<InsulationKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsulationKnowledgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsulationKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
