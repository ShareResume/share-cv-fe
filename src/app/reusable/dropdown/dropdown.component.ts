import { Component, DestroyRef, forwardRef, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {
  ReactiveFormsModule,
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from '../icon/icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Status } from '../models/dropdown.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type SelectValue = string | string[] | null;

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    IconComponent,
    TranslateModule,
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true,
  }],
})
export class DropdownComponent implements ControlValueAccessor, OnInit {
  public options = input<Status[]>([]);
  public multiple = input<boolean>(false);
  public required = input<boolean>(false);
  public errorMessage = input<string>('');
  public label = input<string | undefined>(undefined);
  public placeholder = input<string>('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);

  public isOpen = false;
  public form?: FormGroup;

  public statusControl = new FormControl<SelectValue>(null);

  private onChange: (value: SelectValue) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(value: SelectValue): void {
    this.statusControl.setValue(value, { emitEvent: false });
  }

  public registerOnChange(fn: (value: SelectValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.statusControl.disable();
    } else {
      this.statusControl.enable();
    }
  }

  public hasValue(): boolean {
    const value = this.statusControl.value;
    if (this.multiple()) {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  }

  public clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    
    const newValue = this.multiple() ? [] : null;
    
    this.statusControl.setValue(newValue);
    
    this.onChange(newValue);
    this.onTouched();
    
    if (this.form) {
      this.form.get('status')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  public getPlaceholder(): string {
    return this.placeholder() || this.translateService.instant('common.selectOption');
  }

  public getErrorMessage(): string {
    return this.errorMessage() || this.translateService.instant('validation.selectValidOption');
  }

  public ngOnInit(): void {
    if (this.required()) {
      this.statusControl.addValidators(Validators.required);
    }
    
    this.form = new FormGroup({
      status: this.statusControl,
    });

    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.onChange(value);
        this.onTouched();
      });
      
    if (this.multiple()) {
      this.statusControl.setValue([]);
    }
  }
}
