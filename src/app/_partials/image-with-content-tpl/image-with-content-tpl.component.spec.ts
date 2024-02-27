import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithContentTplComponent } from './image-with-content-tpl.component';

describe('ImageWithContentTplComponent', () => {
  let component: ImageWithContentTplComponent;
  let fixture: ComponentFixture<ImageWithContentTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageWithContentTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageWithContentTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
