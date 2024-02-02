import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTechnologyTplComponent } from './home-technology-tpl.component';

describe('HomeTechnologyTplComponent', () => {
  let component: HomeTechnologyTplComponent;
  let fixture: ComponentFixture<HomeTechnologyTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTechnologyTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTechnologyTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
