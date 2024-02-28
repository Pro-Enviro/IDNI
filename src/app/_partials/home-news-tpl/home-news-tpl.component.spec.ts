import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNewsTplComponent } from './home-news-tpl.component';

describe('HomeNewsTplComponent', () => {
  let component: HomeNewsTplComponent;
  let fixture: ComponentFixture<HomeNewsTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeNewsTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeNewsTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
