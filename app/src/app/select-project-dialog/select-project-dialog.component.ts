import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { flatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ValueName } from '../../../../common/config';

@Component({
  selector: 'app-select-project-dialog',
  templateUrl: './select-project-dialog.component.html',
  styleUrls: ['./select-project-dialog.component.css']
})
export class SelectProjectDialogComponent implements OnInit {

  projects: Observable<ValueName[]>

  constructor(
    public dialogRef: MatDialogRef<SelectProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public roundId: string, private db: AngularFireDatabase, private auth: AngularFireAuth) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    let delegateId = this.auth.auth.currentUser.uid
    this.projects = this.db.object("delegateRounds/" + delegateId + "/" + this.roundId + "/delegation").valueChanges().pipe(
      flatMap((delegationId, _) => {
        return this.db.list("projects").valueChanges().pipe(
          map(
            projects => {
              let delegateProjects = projects.filter(project => project["type"] == "delegate" && project["delegate"] == delegateId)
              let delegationProjects = projects.filter(project => project["type"] == "delegation" && project["delegation"] == delegationId)
              let generalProjects = projects.filter(project => project["type"] == "general")
              let mergedProjects = delegateProjects.concat(delegationProjects).concat(generalProjects)
              return mergedProjects.map(project => {
                return { value: project["keyword"].toUpperCase(), name: project["name"], df: project["df"] }
              })
            }
          )
        )
      }
      ))
  }
}
