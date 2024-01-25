import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './navbar/header/header.component';
import { MenulistComponent } from './components/menulist/menulist.component';
import { SocialMediaListComponent } from './components/social-media-list/social-media-list.component';
import { HttpClientModule } from '@angular/common/http';
import { DataGridComponent } from './components/data-grid/data-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    MenulistComponent,
    SocialMediaListComponent,
    DataGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
