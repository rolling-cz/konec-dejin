import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TENSES, COUNTRIES, findValueName, ACTION_TYPES, VISIBILITIES } from '../../../../common/config';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireAction } from '@angular/fire/database';
import { Observable, combineLatest } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Papa } from 'ngx-papaparse';
import { MatDialog } from '@angular/material';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css']
})
export class RoundComponent implements OnInit {

  @Input()
  roundId: string

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private dialog: MatDialog) {
  }

  roundForm: FormGroup;

  state: string;

  tenses = TENSES

  path

  delegatePaths: Observable<string[]>

  delegationPaths: Observable<string[]>

  editingDelegates = false

  editingDelegations = false

  showingProjects = false

  projects: Observable<Project[]>

  displayedColumns: string[] = ['keyword', 'name', 'delegations', 'df', 'mainActions'];

  ngOnInit() {
    this.path = "rounds/" + this.roundId
    this.roundForm = this.fb.group({
      name: [''],
      tense: [''],
      deadline: ['']
    })
    this.delegatePaths = this.db.list("delegateRounds").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "delegateRounds/" + snapshot.key + "/" + this.roundId)
        })
    )
    this.delegationPaths = this.db.list("delegationRounds").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "delegationRounds/" + snapshot.key + "/" + this.roundId)
        })
    )
    this.projects = this.calculateProjects()
  }

  changeHandler(state) {
    this.state = state
  }

  exportActions() {
    combineLatest(
      this.db.list("actions/" + this.roundId).snapshotChanges(),
      this.db.list("delegates").snapshotChanges(),
      this.db.list("delegations").snapshotChanges(),
      (actions, delegates, delegations) => {
        return { actions: actions, delegates: delegates, delegations: delegations }
      }
    ).pipe(
      take(1),
      tap(
        combined => {
          let data = combined.actions.map(snapshot => {
            let values = snapshot.payload.val()
            let actionTypes = ACTION_TYPES
            actionTypes.push({ value: "main", name: "Primární" })
            return [
              findName(combined.delegates, values["delegate"]),
              findName(combined.delegations, values["delegation"]),
              values["title"] || "",
              values["description"] || "",
              findValueName(COUNTRIES, values["targetCountry"]),
              values["df"] || "",
              values["keyword"] || "",
              findValueName(actionTypes, values["type"]),
              findValueName(VISIBILITIES, values["visibility"]),
              values["result"] || "",
              snapshot.key.substr(1) // Excel doesn't like - at the beginning
            ]
          })
          let options = {
            headers: ["Delegát", "Delegace", "Titulek", "Popis akce", "Lokace", "BV", "Klíčové slovo", "Typ akce", "Viditelnost", "Výsledek", "ID akce"]
          };
          new ngxCsv(data, 'Export akcí ' + this.roundForm.controls.name.value, options);
        }
      )
    ).subscribe()
  }

  importActions(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let papa = new Papa()
      papa.parse(fileReader.result as string, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          result.data.forEach(el => {
            this.db.object("actions/" + this.roundId + "/-" + el["ID akce"]).update({
              result: el["Výsledek"]
            })
          });
        }
      });
    }
    fileReader.readAsText(file.value.files[0]);
  }

  deleteRound() {
    this.dialog.open(DeleteConfirmDialogComponent, { data: this.roundForm.controls.name.value }).afterClosed().subscribe(
      result => {
        if (result) {
          this.db.list("delegateRounds").snapshotChanges().pipe(
            take(1),
            tap(
              snapshots => {
                snapshots.forEach(
                  snapshot => {
                    this.db.object("delegateRounds/" + snapshot.key + "/" + this.roundId).remove()
                  }
                )
              }
            )
          ).subscribe()
          this.db.list("delegationRounds").snapshotChanges().pipe(
            take(1),
            tap(
              snapshots => {
                snapshots.forEach(
                  snapshot => {
                    this.db.object("delegationRounds/" + snapshot.key + "/" + this.roundId).remove()
                  }
                )
              }
            )
          ).subscribe()
          this.db.object("actions/" + this.roundId).remove()
          this.db.object(this.path).remove()
        }
      }
    )
  }

  deleteActions() {
    this.dialog.open(DeleteConfirmDialogComponent, { data: "všechny sekundární akce a vyčistit primární akce" }).afterClosed().subscribe(
      result => {
        if (result) {
          this.db.list("actions/" + this.roundId).snapshotChanges().pipe(
            take(1),
            tap(
              snapshots => {
                snapshots.forEach(
                  snapshot => {
                    let action = snapshot.payload.val()
                    if (action["type"] == "main") {
                      this.db.object("actions/" + this.roundId + "/" + snapshot.key).set(
                        {
                          delegate: action["delegate"],
                          delegation: action["delegation"],
                          type: "main",
                          visibility: "private"
                        })
                    } else {
                      this.db.object("actions/" + this.roundId + "/" + snapshot.key).remove()
                    }
                  }
                )
              }
            )
          ).subscribe()
          this.db.list("delegateRounds").snapshotChanges().pipe(
            take(1),
            tap(
              snapshots => {
                snapshots.forEach(
                  snapshot => {
                    this.db.object("delegateRounds/" + snapshot.key + "/" + this.roundId + "/markedAsSent").set(false)
                  }
                )
              }
            )
          ).subscribe()
        }
      }
    )
  }

  private calculateProjects(): Observable<Project[]> {
    return combineLatest<Project[]>(
      this.db.list("projects").valueChanges(),
      this.db.list("actions").snapshotChanges(),
      this.db.object("delegations").valueChanges(),
      (projects, actions, delegations) => {
        let actionsForThisAndPreviousRounds = []
        for (let i = 0; i < actions.length; i++) {
          let snap = actions[i]
          let roundId = snap.key
          let val = snap.payload.val()
          Object.keys(val).forEach((key) => {
            actionsForThisAndPreviousRounds.push(val[key]);
          });
          if (roundId == this.roundId) {
            break;
          }
        }
        let usedKeywords = actionsForThisAndPreviousRounds.map(action => action["keyword"])
        let uniqueKeywords = []
        return projects.filter(project => {
          let ok = usedKeywords.includes(project.keyword) && !uniqueKeywords.includes(project.keyword)
          if (ok) {
            uniqueKeywords.push(project["keyword"])
          }
          return ok
        }).map(project => {
          let relatedActions = actionsForThisAndPreviousRounds.filter(action => action["keyword"] != null && action["keyword"].toLowerCase().trim() == project["keyword"].toLowerCase().trim())
          let delegationNames = relatedActions.map(action => delegations[action["delegation"]]["name"]).join(", ")
          let spentDf = relatedActions.map(action => action["df"] || 0).reduce((sum, current) => sum + current)
          let dfOk = spentDf >= project["df"]
          let spentMainActions = relatedActions.filter(action => action["type"] == "main").length
          let mainActionsOk = spentMainActions >= project["mainActions"]
          return <Project>{ keyword: project["keyword"], name: project["name"], delegations: delegationNames, df: spentDf + "/" + project["df"], mainActions: spentMainActions + "/" + project["mainActions"], dfOk: dfOk, mainActionsOk: mainActionsOk }
        }).sort((project1, project2) => project1.keyword.localeCompare(project2.keyword))
      }
    )
  }

  editDelegates() {
    this.editingDelegates = true
  }

  editDelegations() {
    this.editingDelegations = true
  }

  showProjects() {
    this.showingProjects = true
  }
}

function findName(snapshots: AngularFireAction<DatabaseSnapshot<any>>[], id: string) {
  let snapshot = snapshots.find((row) => row.key == id);
  if (snapshot == null) {
    return "N/A"
  }
  return snapshot.payload.val()["name"]
}

interface Project {
  keyword: string;
  name: string;
  delegations: string;
  df: string;
  dfOk: boolean;
  mainActions: string;
  mainActionsOk: boolean;
}