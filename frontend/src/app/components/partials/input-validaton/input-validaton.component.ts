import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const VALIDATORS_MESSAGES: any = {
  required: 'Should Not Be Empty',
  email: 'Email Is Not Valid',
  minlength: 'Field is Too short',
  notMatch: 'Password does not match'
}
@Component({
  selector: 'input-validation',
  templateUrl: './input-validaton.component.html',
  styleUrls: ['./input-validaton.component.css']
})
export class InputValidatonComponent implements OnInit, OnChanges {

  @Input() control!: AbstractControl;
  @Input() showErrorsWhen: boolean = true;

  errorMessages: string[] = [];

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidation();
  }

  ngOnInit(): void {
    this.control.statusChanges.subscribe(() => {
      this.checkValidation();
    });
    this.control.valueChanges.subscribe(() => {
      this.checkValidation();
    });

  }

  checkValidation() {
    const errors = this.control.errors;
    if (!errors) {
      this.errorMessages = []
      return;
    }
    else {
      const errorKeys = Object.keys(errors);
      this.errorMessages = errorKeys.map(key => VALIDATORS_MESSAGES[key]);
    }
  }

}
