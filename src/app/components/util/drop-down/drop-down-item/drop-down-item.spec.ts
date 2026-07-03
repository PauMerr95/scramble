import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownItem } from './drop-down-item';

describe('DropDownItem', () => {
  let component: DropDownItem;
  let fixture: ComponentFixture<DropDownItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownItem],
    }).compileComponents();

    fixture = TestBed.createComponent(DropDownItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
