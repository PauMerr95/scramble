import { inject, Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { LayoutService } from './layout-service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private _SCRAMBLE_CONFIG: string = "";
  private _API_KEY: string | null = null;
  private _USER_NAME: string = "";

  constructor() {
    this.retrieveUserName();
    this.retrieveConfigPath();
    this.retrieveApiKey();
  }

  readonly lyt = inject(LayoutService);

  // Getters and Setters:
  public getApiKey(): string | null {
    return this._API_KEY;    
  };
  public setApiKey(key: string) {
    this._API_KEY = key;
    invoke('save_api_key', { API_KEY: key }); // TODO: implement on backend
  }
  public getUserName() {
    return this._USER_NAME;    
  };
  public setUserName(name: string) {
    this._USER_NAME = name;
    invoke('save_user_name', { name: name }); // TODO: implement on backend
  }
  public getHomePath() {
    return this._SCRAMBLE_CONFIG;
  }
  public setHomePath(path: string) {
    this._SCRAMBLE_CONFIG = path;
    invoke('save_home_path', { path: path});
  }

  // --- RUST BACKEND FUNCTIONS ---
  async retrieveUserName(){
    const name = await invoke<string>('get_user_name');
    return name;
  }

  async retrieveApiKey(){
    const API_KEY = await invoke<string>('get_api_key');
    return API_KEY;
  }

  async saveUserInfo(){
    await invoke<null>('save_user_info', {configPath: this._SCRAMBLE_CONFIG})
      .catch((err) => {
        this.lyt.notify({
          kind: "Error",
          message: `Encountered error trying to save user data: ${err}`
        });
      });
  }

  async retrieveConfigPath(){
    await invoke<string>('get_home_path')
    .then((path) => {
      this._SCRAMBLE_CONFIG = path;
    })
    .catch((err) => {
      console.log(`Error during retrieval of Scramble Home Path: ${err}`);
    })

  }
}