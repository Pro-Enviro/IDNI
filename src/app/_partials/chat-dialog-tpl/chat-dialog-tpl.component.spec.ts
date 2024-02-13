import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDialogTplComponent } from './chat-dialog-tpl.component';

describe('ChatDialogTplComponent', () => {
  let component: ChatDialogTplComponent;
  let fixture: ComponentFixture<ChatDialogTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDialogTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatDialogTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
