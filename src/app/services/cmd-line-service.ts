import { Injectable, signal, ElementRef } from '@angular/core';
import { CmdInputType, CmdOutputType, Command } from '../types/cmd_types';
import { SequenceViewerService } from './sequence-viewer-service';
import { LayoutService } from './layout-service';

@Injectable({
  providedIn: 'root',
})
export class CmdLineService {
  constructor(
    private layoutService: LayoutService,
    private seqviewService: SequenceViewerService) {}

  
  readonly cmdInput = signal<string>('');
  readonly cmdInputType = signal<CmdInputType | null>(null);

  readonly cmdOutput = signal<string>("Scramble booted up successfully");
  readonly cmdOutputType = signal<CmdOutputType>("Neutral");

  handleInput(mode: CmdInputType) {
    if (!mode) return;
    this.cmdInputType.set(mode);
    if (mode === "Leader") {
      this.leaderTimeout = setTimeout(() => this.abort(), 5000);
    }
  }

  checkSearch(): CmdOutputType {
    const query = this.cmdInput();
    const isfound = this.seqviewService.search(query);
    this.cmdInput.set('');
    this.cmdInputType.set(null);

    if (!isfound) {
      this.cmdOutputType.set("Failure");
      this.cmdOutput.set(`'${query}' could not be found in the active sequence`);
      return "Failure";
    }
    this.cmdOutputType.set("Success");
    this.cmdOutput.set(`Found ${this.seqviewService.hlAreas().length} instances of '${query}'`)
    return "Success"
  }

  checkCommand(): CmdOutputType{
    const cmd = this.executeCmds[this.cmdInput()];
    if(cmd){
      cmd();
      this.cmdInput.set('');
      this.cmdInputType.set(null);
      return "Success";
    } else {
      this.cmdOutputType.set("Failure");
      this.cmdOutput.set(`Could not find any commands called ${this.cmdInput()}`)
      this.cmdInput.set('');
      this.cmdInputType.set(null);
      return "Failure";
    }
  }

  checkLeader(): CmdOutputType {
    const cmd = this.leaderCmds[this.cmdInput()];
    if(cmd){
      clearTimeout(this.leaderTimeout);
      cmd();
      this.cmdInput.set('');
      this.cmdInputType.set(null);
      return "Success";
    }
    return "Failure";
  }
  
  abort(){
    if (this.leaderTimeout) clearTimeout(this.leaderTimeout);
    this.cmdInput.set('');
    this.cmdInputType.set(null);
    this.layoutService.focusOn("MainPane");
  }

  private leaderTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  private readonly leaderCmds: Record<string, Command> = {
    p: () => this.layoutService.toggleSidePane("Profile"),
    f: () => this.layoutService.toggleSidePane("Files"),
    q: () => this.layoutService.toggleSidePane("Query")
  };
  private readonly executeCmds: Record<string, Command> = {
    getJoke: () => {
      this.cmdOutput.set("I can't C# without my glasses.");
      this.cmdOutputType.set("Success");
      this.layoutService.focusOn("MainPane");
    }
  };
}
