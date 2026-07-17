import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { UserDataService } from './services/user-data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const userData = inject(UserDataService);
      return userData.init();
      //TODO: for later: return Promise.all([userData.init(), sequenceData.init() ...etc.]);
    })
  ]
};
