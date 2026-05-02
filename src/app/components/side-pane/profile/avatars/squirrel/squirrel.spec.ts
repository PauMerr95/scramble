import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Squirrel } from './squirrel';

describe('Squirrel', () => {
  let component: Squirrel;
  let fixture: ComponentFixture<Squirrel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Squirrel],
    }).compileComponents();

    fixture = TestBed.createComponent(Squirrel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
