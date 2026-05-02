import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Earth } from './earth';

describe('Earth', () => {
  let component: Earth;
  let fixture: ComponentFixture<Earth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Earth],
    }).compileComponents();

    fixture = TestBed.createComponent(Earth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
