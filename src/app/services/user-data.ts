import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private _SCRAMBLE_HOME: string = "";
  private _API_KEY: string | null = null;
  private _USER_NAME: string = "";

  constructor() {
    this.retrieveUserName();
    this.retrieveHomePath();
    this.retrieveApiKey();
  }

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
    return this._SCRAMBLE_HOME;
  }
  public setHomePath(path: string) {
    this._SCRAMBLE_HOME = path;
    invoke('save_home_path', { path: path});
  }

  // Backend functions:
  async retrieveUserName(){
    const name = await invoke<string>('get_user_name');
    return name;
  }
  async retrieveApiKey(){
    const API_KEY = await invoke<string>('get_api_key');
    return API_KEY;
  }
  async retrieveHomePath(){
    await invoke<string>('get_home_path')
    .then((path) => {
      this._SCRAMBLE_HOME = path;
    })
    .catch((err) => {
      console.log(`Error during retrieval of Scramble Home Path: ${err}`);
    })

  }
}