import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTplComponent } from './image-tpl.component';

describe('ImageTplComponent', () => {
  let component: ImageTplComponent;
  let fixture: ComponentFixture<ImageTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
