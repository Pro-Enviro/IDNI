import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCardsTplComponent } from './news-cards-tpl.component';

describe('NewsCardsTplComponent', () => {
  let component: NewsCardsTplComponent;
  let fixture: ComponentFixture<NewsCardsTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCardsTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsCardsTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
