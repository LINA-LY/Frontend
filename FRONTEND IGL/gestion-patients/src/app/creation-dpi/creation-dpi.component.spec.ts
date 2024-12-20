import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationDpiComponent } from './creation-dpi.component';

describe('CreationDpiComponent', () => {
  let component: CreationDpiComponent;
  let fixture: ComponentFixture<CreationDpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationDpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationDpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
