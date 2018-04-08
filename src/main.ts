import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {AppBrowserModule} from './app/app.browser.module';

if (environment.production) {
  enableProdMode();
}
/*platformBrowserDynamic().bootstrapModule(AppModule)
  .then((ref: NgModuleRef<AppModule>) => {
    // setup required for my portal environment
    const platform: PlatformRef = ref.injector.get(PlatformRef);
    wrapper.setApplicationComponentNode(ref, platform);
  })
  .catch(err => console.log(err));*/
platformBrowserDynamic().bootstrapModule(AppBrowserModule)
  .catch(err => console.log(err));
