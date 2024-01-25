import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import { socailMediaModel } from '../../model/app.intertaces';
@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.scss'
})
export class AddFormComponent {
  newData: socailMediaModel = {
    link: "",
    description: "",
    name: ""
  };
  constructor(private appService: AppService) { }
  submitForm() {
    const validate = this.validateObject(this.newData);
    //tüm form alanları zorunlu
    if (!validate) {
      console.log("errr")
      return
    }
    else if (validate) {
      this.appService.formSubmit.emit(this.newData);
      //obje clear
      this.newData = {
        link: "",
        description: "",
        name: ""
      };
    }

  }

  validateObject(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] === '')) {
        // Anahtarın değeri null, undefined veya boş ise
        this.appService.showMessage('Zorunlu Alanları Doldurunuz', 'error')

        return false;
      }
    }
    return true;
  }
}
