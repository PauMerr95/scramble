import { TestBed } from '@angular/core/testing';

import { LayoutService } from './layout-service';
import { MoveGrid } from '../types/side_types';
import { CursorPos } from '../types/main_types';

describe('LayoutService', () => {
  let service: LayoutService;

  const testGrid: MoveGrid = [
    ["ProfileAvatar", "ProfileName", "ProfileBio", "ProfileKey", "ProfilePath"],
    ["IconQueryGenome", "IconQueryGene", "IconQueryProkaryot", "IconQueryVirus", "IconQueryOrganelle"],
    ["InputQueryOptGenome"],
  ];

  const injection: string[] = ["Injector1", "Injector2", "Injector3", "Injector4"];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
    service.loadGrid(testGrid);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should facilitate MoveGrid injection and ejection', () => {
    const loc: CursorPos = {row: 0, col: 0, offset: 0};
    // === row injection ===
    service.injectIntoGrid(injection, loc, "row");
    expect(service.currentMoveGrid).not.toBe(testGrid);
    expect(service.currentMoveGrid!.length).toBe(testGrid.length);
    expect(service.currentMoveGrid![loc.row].length).toBeGreaterThan(testGrid.length);

    service.ejectFromGrid(injection.length, loc, "row");
    expect(service.currentMoveGrid).toBe(testGrid);
    expect(service.currentMoveGrid![loc.row].length).toBe(testGrid.length);

    // === column injection ===
    service.injectIntoGrid(injection, loc, "col");
    expect(service.currentMoveGrid).not.toBe(testGrid);
    expect(service.currentMoveGrid!.length).toBeGreaterThan(testGrid.length);
    expect(service.currentMoveGrid![loc.row].length).toBe(testGrid.length);
    service.ejectFromGrid(injection.length, loc, "row");
    expect(service.currentMoveGrid).toBe(testGrid);
    expect(service.currentMoveGrid!.length).toBe(testGrid.length);
  })
});
