import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardsTplComponent } from './event-cards-tpl.component';

describe('EventCardsTplComponent', () => {
  let component: EventCardsTplComponent;
  let fixture: ComponentFixture<EventCardsTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardsTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventCardsTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
