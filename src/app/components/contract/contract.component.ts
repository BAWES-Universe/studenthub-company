import { Component, Input, OnInit } from '@angular/core';
import { Contract } from 'src/app/models/contract';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {

  @Input() contract: Contract;

  constructor(
    public translateService: TranslateLabelService,
  ) { }

  ngOnInit() {}

}
