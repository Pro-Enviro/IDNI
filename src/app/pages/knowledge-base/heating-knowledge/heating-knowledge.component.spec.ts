import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatingKnowledgeComponent } from './heating-knowledge.component';

describe('HeatingKnowledgeComponent', () => {
  let component: HeatingKnowledgeComponent;
  let fixture: ComponentFixture<HeatingKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatingKnowledgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeatingKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
