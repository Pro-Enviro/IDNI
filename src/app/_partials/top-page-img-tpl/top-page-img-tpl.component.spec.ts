import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPageImgTplComponent } from './top-page-img-tpl.component';

describe('TopPageImgTplComponent', () => {
  let component: TopPageImgTplComponent;
  let fixture: ComponentFixture<TopPageImgTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPageImgTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopPageImgTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
