import { TestBed } from '@angular/core/testing';
import { PopupService } from './popup.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PopupComponent } from './popup.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PopupService', () => {
  let service: PopupService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<PopupComponent>>;

  beforeEach(() => {
    dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRefSpyObj.afterClosed.and.returnValue(of('result'));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    TestBed.configureTestingModule({
      imports: [MatDialogModule, NoopAnimationsModule],
      providers: [
        PopupService,
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });
    
    service = TestBed.inject(PopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should open a dialog with the provided data', () => {
      const title = 'Test Title';
      const content = 'Test Content';
      const buttons = [{ label: 'OK', type: 'primary' as const }];
      
      service.open(title, content, buttons).subscribe();
      
      expect(dialogSpy.open).toHaveBeenCalledWith(
        PopupComponent,
        jasmine.objectContaining({
          data: {
            title,
            buttons,
            content
          }
        })
      );
    });

    it('should return the dialog result', () => {
      let result: string | undefined;
      
      service.open('Title', 'Content').subscribe(res => {
        result = res;
      });
      
      expect(result).toBe('result');
    });

    it('should merge custom dialog options', () => {
      const customOptions = {
        width: '800px',
        disableClose: true
      };
      
      service.open('Title', 'Content', [], customOptions).subscribe();
      
      expect(dialogSpy.open).toHaveBeenCalledWith(
        PopupComponent,
        jasmine.objectContaining(customOptions)
      );
    });
  });

  describe('confirm', () => {
    it('should open a dialog with confirm and cancel buttons', () => {
      service.confirm('Confirm Title', 'Confirm Message').subscribe();
      
      expect(dialogSpy.open).toHaveBeenCalledWith(
        PopupComponent,
        jasmine.objectContaining({
          data: {
            title: 'Confirm Title',
            content: 'Confirm Message',
            buttons: [
              { label: 'Cancel', type: 'secondary', action: 'cancel' },
              { label: 'Confirm', type: 'primary', action: 'confirm' }
            ]
          }
        })
      );
    });

    it('should use custom button labels when provided', () => {
      service.confirm('Confirm Title', 'Confirm Message', 'Yes', 'No').subscribe();
      
      expect(dialogSpy.open).toHaveBeenCalledWith(
        PopupComponent,
        jasmine.objectContaining({
          data: {
            title: 'Confirm Title',
            content: 'Confirm Message',
            buttons: [
              { label: 'No', type: 'secondary', action: 'cancel' },
              { label: 'Yes', type: 'primary', action: 'confirm' }
            ]
          }
        })
      );
    });

    it('should return true when confirmed', () => {
      dialogRefSpyObj.afterClosed.and.returnValue(of('confirm'));
      
      let confirmed: boolean | undefined;
      service.confirm('Title', 'Message').subscribe(result => {
        confirmed = result;
      });
      
      expect(confirmed).toBe(true);
    });

    it('should return false when cancelled', () => {
      dialogRefSpyObj.afterClosed.and.returnValue(of('cancel'));
      
      let confirmed: boolean | undefined;
      service.confirm('Title', 'Message').subscribe(result => {
        confirmed = result;
      });
      
      expect(confirmed).toBe(false);
    });
  });
}); 