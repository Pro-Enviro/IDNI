import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteTransportComponent } from './waste-transport.component';

describe('WasteTransportComponent', () => {
  let component: WasteTransportComponent;
  let fixture: ComponentFixture<WasteTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasteTransportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WasteTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
