import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Duck } from './duck';

describe('Duck', () => {
  let component: Duck;
  let fixture: ComponentFixture<Duck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Duck],
    }).compileComponents();

    fixture = TestBed.createComponent(Duck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
