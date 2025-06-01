import {
  Component,
  Input,
  forwardRef,
  OnInit,
  Optional,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ControlContainer,
  FormControl,
} from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [ IconComponent, MatFormFieldModule, MatInput, MatIconButton, TranslateModule ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() public formControlName?: string;
  @Input() public label = '';
  @Input() public placeholder = '';
  @Input() public additionalText = '';
  @Input() public pattern?: RegExp;
  @Input() public type = 'text';
  @Input() public errorMessages: Record<string, string> = {};
  @Input() public options: string[] = [];

  @Output() public valueChange = new EventEmitter<string>();

  private translateService = inject(TranslateService);

  public errorMessage = '';
  public isPasswordVisible = false;
  public disabled = false;
  public isFocused = false;
  public inputId = `input-${Math.random().toString(36).substring(2, 9)}`;

  private _value = '';

  public get value(): string {
    return this._value;
  }

  public set value(val: string) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
    }
  }

  public control?: FormControl;

  public constructor(@Optional() private controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    if (this.formControlName && this.controlContainer?.control) {
      this.control = this.controlContainer.control.get(
        this.formControlName,
      ) as FormControl;

      this.control.statusChanges?.subscribe(() => {
        this.setErrorMessageFromControl();
      });

      this.control.valueChanges?.subscribe(() => {
        this.setErrorMessageFromControl();
      });

      // Listen to parent form changes for password confirmation validation
      if (this.formControlName === 'confirmPassword') {
        this.control.parent?.statusChanges?.subscribe(() => {
          this.setErrorMessageFromControl();
        });
        
        // Also listen to password field changes
        const passwordControl = this.control.parent?.get('password');
        passwordControl?.valueChanges?.subscribe(() => {
          this.setErrorMessageFromControl();
        });
      }

      this.setErrorMessageFromControl();
    }
  }

  public onChange: (value: string) => void = () => {
    // Default implementation for onChange
  };

  public onTouched: () => void = () => {
    // Default implementation for onTouched
  };

  public writeValue(value: string): void {
    this._value = value ?? '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onFocus(): void {
    if (!this.disabled) {
      this.isFocused = true;
    }
  }

  public onBlur(): void {
    this.isFocused = false;
    this.onTouched();

    this.control?.markAsTouched();
    this.setErrorMessageFromControl();
  }

  public onInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;

    this.value = newValue;
    this.control?.updateValueAndValidity({ emitEvent: true });
    this.setErrorMessageFromControl();
    this.valueChange.emit(newValue);
  }

  public get actualType(): string {
    if (this.type === 'password' && this.isPasswordVisible) {
      return 'text';
    }

    return this.type;
  }

  public validate(): void {
    if (this.pattern && !this.pattern.test(this._value)) {
      this.errorMessage = 'Wrong name';
    } else {
      this.errorMessage = '';
    }
  }

  public togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public getPasswordVisibilityLabel(): string {
    return this.isPasswordVisible 
      ? this.translateService.instant('validation.hidePassword')
      : this.translateService.instant('validation.showPassword');
  }

  private setErrorMessageFromControl(): void {
    if (!this.control) {
      this.validate();

      return;
    }

    const showErrors
      = this.control.invalid && (this.control.touched || this.control.dirty);

    if (!showErrors) {
      // Check for form-level passwordMismatch error on confirmPassword field
      if (this.formControlName === 'confirmPassword' && this.control.parent?.hasError('passwordMismatch')) {
        this.errorMessage = this.errorMessages['passwordMismatch'] || 'Passwords do not match.';
        return;
      }
      
      this.errorMessage = '';

      return;
    }

    // Retrieve the current errors and grab the first error key
    const errors = this.control.errors || {};
    const firstErrorKey = Object.keys(errors)[0];

    if (!firstErrorKey) {
      // Check for form-level passwordMismatch error on confirmPassword field
      if (this.formControlName === 'confirmPassword' && this.control.parent?.hasError('passwordMismatch')) {
        this.errorMessage = this.errorMessages['passwordMismatch'] || 'Passwords do not match.';
        return;
      }
      
      this.errorMessage = '';

      return;
    }

    // Use custom message if provided, otherwise fallback
    if (this.errorMessages[firstErrorKey]) {
      this.errorMessage = this.errorMessages[firstErrorKey];
    } else {
      // Default messages for known errors with translation support
      switch (firstErrorKey) {
        case 'required':
          this.errorMessage = this.translateService.instant('validation.required');
          break;
        case 'email':
          this.errorMessage = this.translateService.instant('validation.email');
          break;
        case 'minlength':
          const minLength = errors[firstErrorKey]?.requiredLength;
          this.errorMessage = this.translateService.instant('validation.minLength', { value: minLength });
          break;
        case 'maxlength':
          const maxLength = errors[firstErrorKey]?.requiredLength;
          this.errorMessage = this.translateService.instant('validation.maxLength', { value: maxLength });
          break;
        default:
          this.errorMessage = 'Invalid input.';
      }
    }
  }
}
