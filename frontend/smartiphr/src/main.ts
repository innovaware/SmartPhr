
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

if (environment.production) {
  enableProdMode();
}

// Registra il locale italiano
registerLocaleData(localeIt);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
