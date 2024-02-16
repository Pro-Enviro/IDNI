import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEnvirotrackComponent } from './import-envirotrack.component';

describe('ImportEnvirotrackComponent', () => {
  let component: ImportEnvirotrackComponent;
  let fixture: ComponentFixture<ImportEnvirotrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportEnvirotrackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportEnvirotrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
