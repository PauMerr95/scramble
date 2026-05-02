import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sheep } from './sheep';

describe('Sheep', () => {
  let component: Sheep;
  let fixture: ComponentFixture<Sheep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sheep],
    }).compileComponents();

    fixture = TestBed.createComponent(Sheep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
