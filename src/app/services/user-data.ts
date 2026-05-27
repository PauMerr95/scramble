import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root',
})
export class UserData {
  private _API_KEY: string | null = null;
  private _USER_NAME: string = "";

  constructor() {
    this.retrieveUserName();
    this.retrieveApiKey();

  }

  // Getters and Setters:
  public getApiKey(): string | null {
    return this._API_KEY;    
  };
  public setApiKey(key: string) {
    this._API_KEY = key;
    invoke('saveApiKey', { API_KEY: key }); // TODO: implement on backend
  }
  public getUserName() {
    return this._USER_NAME;    
  };
  public setUserName(name: string) {
    this._USER_NAME = name;
    invoke('saveUserData', { name: name }); // TODO: implement on backend
  }

  // Backend functions:
  retrieveUserName(){
    invoke<ArrayBuffer>('getUserName', {}) // TODO: implement on backend
      .then((name) => {
        this._USER_NAME = new TextDecoder('utf-8').decode(name);
      })
      .catch((err) => {
        this._USER_NAME = "TEST USER"
        console.log(`Non-critical exception caught: ${err}`);
      })
  }
  retrieveApiKey(){
    invoke<ArrayBuffer>('getApiKey', {}) // TODO: implement on backend
      .then((key) => {
        this._API_KEY = new TextDecoder('utf-8').decode(key);
      })
      .catch((err) => {
        console.log(`Non-critical exception caught: ${err}`);
      })
  }
}
