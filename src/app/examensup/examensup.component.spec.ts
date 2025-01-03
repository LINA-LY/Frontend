import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamensupComponent } from './examensup.component';

describe('ExamensupComponent', () => {
  let component: ExamensupComponent;
  let fixture: ComponentFixture<ExamensupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamensupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamensupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
