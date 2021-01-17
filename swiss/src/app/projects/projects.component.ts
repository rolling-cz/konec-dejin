import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ValueName, PROJECT_TYPES } from '../../../../common/config';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  delegates: Observable<ValueName[]>
  projectPaths: Observable<string[]>
  delegateId: string

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.delegates = this.db.list("delegates").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => {
            return { value: snapshot.key, name: snapshot.payload.val()["name"] }
          })
        })
    )
  }

  delegateChanged(form: NgForm) {
    this.delegateId = form.value["delegate"]
    this.projectPaths = this.db.list("projects", ref => ref.orderByChild("delegate").equalTo(this.delegateId)).snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "projects/" + snapshot.key)
        })
    )
  }

  addProject(form: NgForm) {
    if (form.valid) {
      this.db.list("projects").push({
        name: form.value["name"],
        keyword: form.value["keyword"],
        enabled: true,
        df: form.value["df"],
        mainActions: 1,
        type: "delegate",
        delegate: form.value["delegate"],
        condition: form.value["condition"],
        benefit: form.value["benefit"],
        instructions: form.value["instructions"]
      })
    }
  }

  importProjects(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let papa = new Papa()
      papa.parse(fileReader.result as string, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          result.data.forEach(el => {
            let enabledString = el["Dostupná"].toLowerCase() 
            let enabled = enabledString == "true" || enabledString == "1"
            this.db.list("projects").push({
              name: el["Název"],
              keyword: el["Klíčové slovo"],
              enabled: enabled,
              df: el["Cena BV"],
              mainActions: 1,
              type: "delegate",
              delegate: this.delegateId,
              condition: el["Podmínka"],
              benefit: el["Benefit"],
              instructions: el["Instrukce"]
            })
          });
        }
      });
    }
    fileReader.readAsText(file.value.files[0]);
  }
}