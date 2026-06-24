import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StdBtn } from './std-btn';

describe('StdBtn', () => {
  let component: StdBtn;
  let fixture: ComponentFixture<StdBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StdBtn],
    }).compileComponents();

    fixture = TestBed.createComponent(StdBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
