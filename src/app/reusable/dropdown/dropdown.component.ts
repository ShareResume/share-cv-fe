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
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from '../icon/icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Status } from '../models/dropdown.model';

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
  public multiple = input<boolean>(true);

  private readonly destroyRef = inject(DestroyRef);

  public isOpen = false;
  public form?: FormGroup;

  public statusControl = new FormControl<SelectValue>(null);

  private onChange: (value: SelectValue) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(value: SelectValue): void {
    this.statusControl.setValue(value);
  }

  public registerOnChange(fn: (value: SelectValue) => void): void {
    this.onChange = fn;
    this.statusControl.valueChanges.subscribe(fn);
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

  public ngOnInit(): void {
    this.form = new FormGroup({
      status: this.statusControl,
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (value.status !== undefined) {
          this.onChange(value.status);
          this.onTouched();
        }
      });
      
    // Initialize the form control with empty array if multiple is true
    if (this.multiple()) {
      this.statusControl.setValue([]);
    }
  }
}
