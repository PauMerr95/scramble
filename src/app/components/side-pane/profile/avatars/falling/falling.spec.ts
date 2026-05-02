import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Falling } from './falling';

describe('Falling', () => {
  let component: Falling;
  let fixture: ComponentFixture<Falling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Falling],
    }).compileComponents();

    fixture = TestBed.createComponent(Falling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
