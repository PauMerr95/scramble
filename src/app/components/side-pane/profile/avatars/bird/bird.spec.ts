import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bird } from './bird';

describe('Bird', () => {
  let component: Bird;
  let fixture: ComponentFixture<Bird>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bird],
    }).compileComponents();

    fixture = TestBed.createComponent(Bird);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
