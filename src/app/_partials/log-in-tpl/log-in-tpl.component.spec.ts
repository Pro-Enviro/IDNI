import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInTplComponent } from './log-in-tpl.component';

describe('LogInTplComponent', () => {
  let component: LogInTplComponent;
  let fixture: ComponentFixture<LogInTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogInTplComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogInTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
