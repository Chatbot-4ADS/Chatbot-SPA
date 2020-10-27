import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export class IRegistrationModel {
  name: string;
  email: string;
}

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  model: IRegistrationModel = new IRegistrationModel();

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
