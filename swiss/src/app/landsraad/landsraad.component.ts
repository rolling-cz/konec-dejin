import { Component, OnInit } from '@angular/core';
import { AngularFireAction, AngularFireDatabase, DatabaseSnapshot } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
import { ngxCsv } from 'ngx-csv';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { flatMap, map, take, tap } from 'rxjs/operators';
import { ValueName } from '../../../../common/config';

@Component({
  selector: 'app-landsraad',
  templateUrl: './landsraad.component.html',
  styleUrls: ['./landsraad.component.css']
})
export class LandsraadComponent implements OnInit {

  delegates: Observable<ValueName[]>
  votingRightPaths: Observable<string[]>
  questionPaths: Observable<string[]>
  questions: Observable<ValueName[]>
  currentQuestion: Observable<string>
  alreadyVotedCount: Observable<number>
  maxVotedCount: Observable<number>

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.delegates = this.db.list("delegates").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => {
            return { value: snapshot.key, name: snapshot.payload.val()["name"] }
          }).concat({ value: "", name: "- Nikdo -" })
        })
    )
    this.votingRightPaths = this.db.list("landsraad/votingRights", ref => ref.orderByChild("name")).snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "landsraad/votingRights/" + snapshot.key)
        })
    )
    this.questionPaths = this.db.list("landsraad/questions").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "landsraad/questions/" + snapshot.key)
        })
    )
    this.questions = this.db.list("landsraad/questions").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => {
            return { value: snapshot.key, name: snapshot.payload.val()["name"] }
          }).concat({ value: "", name: "- Žádná -" })
        })
    )
    this.currentQuestion = this.db.object("landsraad/currentQuestion").valueChanges() as Observable<string>
    this.alreadyVotedCount = (this.db.object("landsraad/currentQuestion").valueChanges() as Observable<string>).pipe(flatMap((currentQuestionId, _) => {
      return this.db.list("landsraad/votes/" + currentQuestionId).snapshotChanges().pipe(
        map(snaps => snaps.length)
      )
    }))
    this.maxVotedCount = this.votingRightPaths.pipe(map(items => items.length))
  }

  addVotingRight(form: NgForm) {
    if (form.valid) {
      this.db.list("landsraad/votingRights").push({
        name: form.value["name"],
        votes: form.value["votes"],
        controlledBy: form.value["controlledBy"]
      })
    }
  }

  addQuestion(form: NgForm) {
    if (form.valid) {
      let ref = this.db.list("landsraad/questions").push({
        name: form.value["name"]
      });
      (form.value["answers"] as string).split(",").forEach(
        answer => {
          this.db.list("landsraad/answers/" + ref.key).push({
            name: answer.trim()
          });
        }
      )
    }
  }

  currentQuestionChanged(event) {
    this.db.object("landsraad/currentQuestion").set(event.value)
  }

  exportVotes(questionId: string) {
    combineLatest(
      this.db.list("landsraad/votes/" + questionId).snapshotChanges(),
      this.db.list("landsraad/answers/"+questionId).snapshotChanges(),
      this.db.list("landsraad/votingRights").snapshotChanges(),
      (votes, answers, votingRights) => {
        return { votes: votes, answers: answers, votingRights: votingRights }
      }
    ).pipe(
      take(1),
      tap(
        combined => {
          let data = combined.answers.map(answerSnap => {
            let answerName = answerSnap.payload.val()["name"]
            let answerId = answerSnap.key
            let row = [answerName]
            combined.votingRights.forEach(votingRightSnap => {
              let votingRightId = votingRightSnap.key
              row.push(findVote(combined.votes, votingRightId, answerId))
            })
            return row
          })
          let headers = ["Odpověď"]
          combined.votingRights.forEach(votingRightSnap => {
            headers.push(votingRightSnap.payload.val()["name"])
          })
          let options = {
            headers: headers
          };
          new ngxCsv(data, 'Export hlasů', options);
        }
      )
    ).subscribe()
  }
}

function findVote(snapshots: AngularFireAction<DatabaseSnapshot<any>>[], votingRightId: string, answerId: string) {
  let snapshot = snapshots.find((row) => row.key == votingRightId);
  if (snapshot == null) {
    return ""
  }
  let votes = snapshot.payload.val()[answerId]
  if (votes == null) {
    return ""
  }
  return votes
}