import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInformationComponent } from './project-information.component';

describe('ProjectInformationComponent', () => {
  let component: ProjectInformationComponent;
  let fixture: ComponentFixture<ProjectInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
