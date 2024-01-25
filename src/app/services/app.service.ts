import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { socailMediaModel,menuListModel } from '../model/app.intertaces';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  apiRoot:string="http://localhost:3000"
  constructor(private http:HttpClient) { }
  getSocialList(){
    return this.http.get<socailMediaModel[]>(this.apiRoot + '/socialMedia');
  }
  getMenuList(){
    return this.http.get<menuListModel[]>(this.apiRoot + '/menuList');

  }
}
