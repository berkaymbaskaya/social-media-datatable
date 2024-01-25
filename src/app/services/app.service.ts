import { Injectable ,EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { socailMediaModel,menuListModel ,dialogType} from '../model/app.intertaces';
import notify from 'devextreme/ui/notify';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  apiRoot:string="http://localhost:3000";
  dataFetched:EventEmitter<socailMediaModel[]>=new EventEmitter();
  formSubmit:EventEmitter<socailMediaModel>=new EventEmitter();
  constructor(private http:HttpClient) { }
  getSocialList(){
    return this.http.get<socailMediaModel[]>(this.apiRoot + '/socialMedia');
  }
  getMenuList(){
    return this.http.get<menuListModel[]>(this.apiRoot + '/menuList');
  };
  showMessage(message:string,type:dialogType) {
    notify(
        {
            message: message, 
            width: 230,
            position: {
                at: "bottom",
                my: "bottom",
                of: "#container"
            }
        }, 
        type, 
        2000
    );
}
}
