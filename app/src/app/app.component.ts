import { Component } from '@angular/core';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AngularFireAuth) {
  }

  title = 'Komunikace s vládou';
  // https://afeld.github.io/emoji-css/
  countries: SelectRow[] = [
    { value: 'flag-af', name: 'Afgánistán' },
    { value: 'flag-in', name: 'Indie' },
    { value: 'flag-iq', name: 'Irák' },
    { value: 'flag-ir', name: 'Írán' },
    { value: 'flag-il', name: 'Izrael' },
    { value: 'flag-ps', name: 'Palestina' },
    { value: 'flag-sa', name: 'Saudská Arábie' },
    { value: 'flag-sy', name: 'Sýrie' },
    { value: 'gb', name: 'Velká Británie' }
  ];
  actionTypes: SelectRow[] = [
    { value: 'support', name: "Podpora" },
    { value: 'economic', name: "Ekonomika" },
    { value: 'elections', name: "Volby" },
    { value: 'other', name: "Jiné" }
  ]
  visibilities: SelectRow[] = [
    { value: 'public', name: "Veřejná" },
    { value: 'covert', name: "Tajná vůči delegacím" },
    { value: 'private', name: "Tajná uvnitř delegace" }
  ]
  primaryActions: Action[] = [
    { description: "", df: 0, visibility: 'public', type: 'main', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" },
    { description: "", df: 0, visibility: 'public', type: 'main', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" },
    { description: "", df: 0, visibility: 'public', type: 'main', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" }
  ]
  secondaryActions: Action[] = [
    { description: "", df: 0, visibility: 'public', type: 'support', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" }
  ]
  primaryDoneActions: Action[] = [
    { description: "Sabotáž íránského jaderného programu", df: 12, visibility: 'covert', type: 'main', delegate: "Daniel Appleby", keyword: "OHEŇ V DÍŘE", result: "Naše obrovská a mezinárodně koordinovaná akce nepřinesla žádané ovoce. Povedlo se nám sice vyhodit do vzduchu kompletní zařízení Íránu - ale už vesměs prázdné a navíc za cenu rozsáhlé zpravodajské akce, kterou asi dokáže někdo zpětně dořešit.", targetDelegation: "flag-ir" },
    { description: "Podpora integrace Palestinských uprchlíků v Sýrii", df: 2, visibility: 'public', type: 'main', delegate: "Daniel Appleby", keyword: "", result: "Současná situace v Sýrii je na hraně občanské války, tudíž se není příliš kam integrovat. Ale můžete ovlivnit, na čí stranu se přidají.", targetDelegation: "flag-sy" },
    { description: "Ovlivňování veřejného mínění ohledně budoucí federace Izraele a Palestiny", df: 5, visibility: 'public', type: 'main', delegate: "Daniel Appleby", keyword: "FEDERACE", result: "Propagační kampaně ze strany Britů vyvolávají odpor Izraelců.", targetDelegation: "flag-il" },
    { description: "Afghánistán - elektrifikace měst", df: 5, visibility: 'public', type: 'main', delegate: "Harold Cross", keyword: "", result: "Proběhlo, Afghánistán se připojuje k modernímu světu.", targetDelegation: "flag-af" },
    { description: "Inspekce vodní elektrárny mezi Indií a Pakistánem", df: 2, visibility: 'public', type: 'main', delegate: "Harold Cross", keyword: "CHANEB", result: "Vše je v pořádku, stavba ja na dobré cestě.", targetDelegation: "flag-in" }
  ]
  secondaryDoneActions: Action[] = [
    { description: 'Kampaň v UK: "Proč mít euro je super"', df: 10, visibility: 'public', type: 'support', delegate: "Daniel Appleby", keyword: "EURO", result: "Britové jsou nakloněni přechodu na Euro.", targetDelegation: "gb" },
    { description: "Sleva na dodání stíhaček Eurofigter do SA", df: 0, visibility: 'public', type: 'other', delegate: "Daniel Appleby", keyword: "", result: "OK", targetDelegation: "flag-sa" },
    { description: "Zakázka od firmy BAS v oboru tězké strojírenství", df: 0, visibility: 'public', type: 'economic', delegate: "Harold Cross", keyword: "", result: "Smlouvy byly uzavřeny", targetDelegation: "flag-sa" },
    { description: "Výstavba přístavu v Gaze", df: 5, visibility: 'public', type: 'support', delegate: "Harold Cross", keyword: "PŘÍSTAV", result: "Vybudováno", targetDelegation: "flag-ps" }
  ]
  sent = false
  availableDf = 60
  remainingDf = this.availableDf

  calculateRemainingDf(action: Action, newValue: number) {
    action.df = newValue
    let primarySum = this.primaryActions.reduce((sum, current) => sum + current.df, 0)
    let secondarySum = this.secondaryActions.reduce((sum, current) => sum + current.df, 0)
    this.remainingDf = this.availableDf - primarySum - secondarySum
  }

  addSecondaryAction() {
    this.secondaryActions.push(
      { description: "", df: 0, visibility: 'public', type: 'support', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" }
    )
  }

  send() {
    this.sent = true;
  }

  formatDoneActionDescription(action: Action) {
    let description = action.description
    if (!isBlank(action.keyword)) {
      description += " (" + action.keyword + ")"
    }
    return description
  }

  formatDoneActionDetails(action: Action) {
    let details = findRowName(this.countries, action.targetDelegation) + ", "
    if (action.df > 0) {
      details += action.df + " DF, "
    }
    if (action.type != "main") {
      details += findRowName(this.actionTypes, action.type) + ", "
    }
    details += findRowName(this.visibilities, action.visibility) + ", "
    details += action.delegate
    return details
  }

  logout() {
    this.auth.auth.signOut();
  }
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function findRowName(rows: SelectRow[], value: string) {
  return rows.find((row) => row.value == value).name
}

export interface SelectRow {
  value: string;
  name: string;
}

export interface Action {
  description: string,
  df: number;
  visibility: string;
  type: string;
  delegate: string,
  keyword: string,
  result: string,
  targetDelegation: string,
}