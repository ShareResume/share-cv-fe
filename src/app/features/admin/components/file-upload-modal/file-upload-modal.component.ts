import { Component, inject, signal, DestroyRef } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../../../../reusable/button/button.component';
import { IconComponent } from '../../../../reusable/icon/icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ToasterService } from '../../../../core/services/toaster.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrl: './file-upload-modal.component.scss',
  standalone: true,
  imports: [
    ButtonComponent,
    IconComponent,
    TranslateModule
]
})
export class FileUploadModalComponent {
  private dialogRef = inject(MatDialogRef<FileUploadModalComponent>);
  private destroyRef = inject(DestroyRef);
  private toasterService = inject(ToasterService);

  selectedFile = signal<File | null>(null);
  isDragOver = signal<boolean>(false);
  isUploading = signal<boolean>(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  private validateAndSetFile(file: File): void {
    if (file.type !== 'application/pdf') {
      this.toasterService.showError('Please select a PDF file only');
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      this.toasterService.showError('File size must be less than 10MB');
      return;
    }

    this.selectedFile.set(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  onUpload(): void {
    const file = this.selectedFile();
    if (!file) {
      return;
    }
    
    this.dialogRef.close(file);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 