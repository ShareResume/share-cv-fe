import { Component, DestroyRef, ElementRef, Input, ViewChild, forwardRef, inject, signal, computed, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocomplete } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {
  ReactiveFormsModule,
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from '../icon/icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../core/models/company.model';
import { distinctUntilChanged, firstValueFrom } from 'rxjs';
import { waitResource } from '@app/core/utils/wait-resource';

@Component({
  selector: 'app-company-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    IconComponent,
  ],
  templateUrl: './company-autocomplete.component.html',
  styleUrls: ['./company-autocomplete.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompanyAutocompleteComponent),
    multi: true,
  },
  CompanyService
],
})
export class CompanyAutocompleteComponent implements ControlValueAccessor {
  @Input() required = false;
  @Input() errorMessage = 'Please select a company';
  @Input() label?: string;
  
  @ViewChild('autocompleteTrigger') autocompleteTrigger!: ElementRef;
  @ViewChild('auto') autocomplete!: MatAutocomplete;
  
  private readonly destroyRef = inject(DestroyRef);
  private readonly companyService = inject(CompanyService);
  
  // Signals for component state
  public isOpen = signal<boolean>(false);
  public searchTerm = signal<string>('');
  public selectedCompany = signal<Company | null>(null);
  public touched = signal<boolean>(false);
  
  // Form controls
  public searchControl = new FormControl<string>('');
  
  // Company search resource with debouncing
  public companiesResource = resource({
    request: () => {
      const term = this.searchTerm();
      return term && term.length > 2 ? term : undefined;
    },
    loader: async ({ request, abortSignal }) => {
      if (!request) return [];
      
      try {
        await waitResource(500, abortSignal);
        
        // Once debounce time has passed, fetch the companies
        return await firstValueFrom(this.companyService.searchCompanies(request));
      } catch (error) {
        // If the operation was aborted (due to a new request), don't log an error
        if (error instanceof Error && error.message === 'Operation aborted') {
          return [];
        }
        
        console.error('Error fetching companies:', error);
        return [];
      }
    }
  });
  
  public hasError = computed(() => 
    this.required && this.touched() && !this.selectedCompany()
  );
  
  private onChange: (value: Company | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Set up the value changes from the searchControl without debounce
    // since debouncing is now handled in the resource
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value !== null) {
          this.searchTerm.set(value);
        }
      });
  }

  public writeValue(value: Company | null): void {
    this.selectedCompany.set(value);
    if (value) {
      this.searchControl.setValue(value.name, { emitEvent: false });
    } else {
      this.searchControl.setValue('', { emitEvent: false });
    }
  }

  public registerOnChange(fn: (value: Company | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  public hasValue(): boolean {
    return !!this.selectedCompany();
  }

  public clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    
    this.selectedCompany.set(null);
    this.searchControl.setValue('');
    
    this.onChange(null);
    this.markAsTouched();
  }

  public onSearchInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    
    // If the search term doesn't match the selected company name, clear selection
    if (this.selectedCompany() && this.selectedCompany()!.name !== value) {
      this.selectedCompany.set(null);
      this.onChange(null);
    }
  }

  public selectCompany(company: Company): void {
    this.selectedCompany.set(company);
    this.searchControl.setValue(company.name);
    this.onChange(company);
    this.markAsTouched();
  }
  
  public markAsTouched(): void {
    this.touched.set(true);
    this.onTouched();
  }

  public onPanelOpened(): void {
    this.isOpen.set(true);
  }
  
  public onPanelClosed(): void {
    this.isOpen.set(false);
    this.markAsTouched();
  }
  
  public refreshCompanies(): void {
    this.companiesResource.reload();
  }
} 