import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import {HeroService} from './service/hero.service';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './service/message.service';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { WeaponsComponent } from './weapons/weapons.component';
import { WeaponService } from './service/weapon.service';
import { WeaponDetailComponent } from './weapon-detail/weapon-detail.component';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import {
  MatProgressBarModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatSortModule,
  MatSelectModule,
  MatChipsModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    DashboardComponent,
    MessagesComponent,
    HeroSearchComponent,
    WeaponsComponent,
    WeaponDetailComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,

    AngularFireModule.initializeApp(environment.firebase, 'angular-tour-of-heroes'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    /*HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )*/
  ],
  providers: [ HeroService, MessageService, WeaponService ]
})
export class AppModule {
  /**
   * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
   * This is good to prevent injecting the service as constructor parameter.
   */
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
