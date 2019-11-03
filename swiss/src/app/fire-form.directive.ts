import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { tap, take, debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

@Directive({
  selector: '[appFireForm]'
})
export class FireFormDirective implements OnInit, OnDestroy {

  @Input() path: string;
  @Input() formGroup: FormGroup;

  private _state: 'loading' | 'synced' | 'modified' | 'error';

  @Output() stateChange = new EventEmitter<string>();
  @Output() formError = new EventEmitter<string>();

  // Firebase object
  private docRef: AngularFireObject<unknown>;

  // Subscriptions
  private formSub: Subscription;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.preloadData();
    this.autoSave();
  }

  // Loads initial form data from Firestore
  preloadData() {
    this.state = 'loading';
    this.docRef = this.getDocRef(this.path);
    this.docRef
      .valueChanges()
      .pipe(
        tap(doc => {
          if (doc) {
            this.formGroup.patchValue(doc);
            this.formGroup.markAsPristine();
            this.state = 'synced';
          }
        }),
        take(1)
      )
      .subscribe();
  }


  // Autosaves form changes
  autoSave() {
    this.formSub = this.formGroup.valueChanges
      .pipe(
        tap(change => {
          this.state = 'modified';
        }),
        debounceTime(1000),
        tap(change => {
          if (this.formGroup.valid && this._state === 'modified') {
            this.setDoc();
          }
        })
      )
      .subscribe();
  }

  // Determines if path is a collection or document
  getDocRef(path: string): AngularFireObject<unknown> {
    return this.db.object(path);
  }

  // Writes changes to Firestore
  async setDoc() {
    try {
      await this.docRef.update(this.formGroup.value);
      this.state = 'synced';
    } catch (err) {
      console.log(err)
      this.formError.emit(err.message)
      this.state = 'error';
    }
  }

  // Setter for state changes
  set state(val) {
    this._state = val;
    let names = {
      'loading': "Načítání…",
      'modified': "Ukládání…",
      'synced': "Uloženo",
      'error': "Chyba ukládání!"
    }
    this.stateChange.emit(names[val]);
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}