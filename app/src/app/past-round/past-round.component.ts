import { Component, OnInit, Input } from '@angular/core';
import { Action, SelectRow } from '../model';
import { COUNTRIES, ACTION_TYPES, VISIBILITIES } from "../config"

@Component({
  selector: 'app-past-round',
  templateUrl: './past-round.component.html',
  styleUrls: ['./past-round.component.css']
})
export class PastRoundComponent implements OnInit {

  constructor() { }

  @Input()
  roundId: string

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

  ngOnInit() {
  }

  formatDoneActionDescription(action: Action) {
    let description = action.description
    if (!isBlank(action.keyword)) {
      description += " (" + action.keyword + ")"
    }
    return description
  }

  formatDoneActionDetails(action: Action) {
    let details = findRowName(COUNTRIES, action.targetDelegation) + ", "
    if (action.df > 0) {
      details += action.df + " DF, "
    }
    if (action.type != "main") {
      details += findRowName(ACTION_TYPES, action.type) + ", "
    }
    details += findRowName(VISIBILITIES, action.visibility) + ", "
    details += action.delegate
    return details
  }

}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function findRowName(rows: SelectRow[], value: string) {
  return rows.find((row) => row.value == value).name
}
