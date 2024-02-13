import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChatTplComponent } from './live-chat-tpl.component';

describe('LiveChatTplComponent', () => {
  let component: LiveChatTplComponent;
  let fixture: ComponentFixture<LiveChatTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveChatTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiveChatTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
