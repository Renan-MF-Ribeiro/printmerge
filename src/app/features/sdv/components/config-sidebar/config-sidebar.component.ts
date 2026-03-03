import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SdvState } from '../../state/sdv.state';
import { AgendaEngine } from '../../../../core/engines/agenda-engine.service';
import { CorelValidatorService } from '../../../../core/services/corel-validator.service';
import { PhraseProviderService } from '../../../../core/services/phrase-provider.service';
import { SettingsPersistenceService } from '../../../../core/services/settings-persistence.service';
import { AgendaType } from '../../../../core/enums/agenda-type.enum';
import { DayFormat } from '../../../../core/enums/day-format.enum';
import { ExportFormat } from '../../../../core/enums/export-format.enum';
import { Separator } from '../../../../core/enums/separator.enum';
import { TemplateType } from '../../../../core/enums/template-type.enum';
import { PhraseCategory } from '../../../../core/enums/phrase-category.enum';
import { yearValidator } from '../../../../shared/validators/year.validator';

@Component({
  selector: 'app-config-sidebar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './config-sidebar.component.html',
  styleUrls: ['./config-sidebar.component.scss'],
})
export class ConfigSidebarComponent implements OnInit {
  protected state = inject(SdvState);
  private fb = inject(FormBuilder);
  private agendaEngine = inject(AgendaEngine);
  private corelValidator = inject(CorelValidatorService);
  private phraseProvider = inject(PhraseProviderService);
  private persistence = inject(SettingsPersistenceService);

  form!: FormGroup;
  phraseTexts: Record<PhraseCategory, string> = {
    [PhraseCategory.MOTIVACIONAL]: '',
    [PhraseCategory.BIBLICO]: '',
    [PhraseCategory.EMPRESARIAL]: '',
    [PhraseCategory.ESCOLAR]: '',
  };

  readonly phraseCategories: { category: PhraseCategory; label: string; icon: string }[] = [
    { category: PhraseCategory.MOTIVACIONAL, label: 'Motivacional', icon: '💪' },
    { category: PhraseCategory.BIBLICO, label: 'Bíblico', icon: '✝️' },
    { category: PhraseCategory.EMPRESARIAL, label: 'Empresarial', icon: '💼' },
    { category: PhraseCategory.ESCOLAR, label: 'Escolar', icon: '📚' },
  ];

  readonly agendaTypes = Object.values(AgendaType);
  readonly dayFormats = Object.values(DayFormat);
  readonly exportFormats = Object.values(ExportFormat);
  readonly separators = [
    { label: 'Ponto e vírgula (;)', value: Separator.SEMICOLON },
    { label: 'Barra (|)', value: Separator.PIPE },
    { label: 'Vírgula (,)', value: Separator.COMMA },
    { label: 'Tab', value: Separator.TAB },
  ];
  readonly templates = Object.values(TemplateType);
  readonly weekDayOptions = [
    { label: 'Dom', value: 0 },
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 2 },
    { label: 'Qua', value: 3 },
    { label: 'Qui', value: 4 },
    { label: 'Sex', value: 5 },
    { label: 'Sáb', value: 6 },
  ];
  readonly monthOptions = [
    { label: 'Jan', value: 1 },
    { label: 'Fev', value: 2 },
    { label: 'Mar', value: 3 },
    { label: 'Abr', value: 4 },
    { label: 'Mai', value: 5 },
    { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 },
    { label: 'Ago', value: 8 },
    { label: 'Set', value: 9 },
    { label: 'Out', value: 10 },
    { label: 'Nov', value: 11 },
    { label: 'Dez', value: 12 },
  ];

  ngOnInit(): void {
    const saved = this.persistence.restore();
    const cfg = saved ?? this.state.config();

    this.form = this.fb.group({
      type: [cfg.type, Validators.required],
      year: [cfg.year, [Validators.required, yearValidator]],
      weekDays: [cfg.weekDays],
      months: [cfg.months],
      dayFormat: [cfg.dayFormat],
      exportFormat: [cfg.exportFormat],
      separator: [cfg.separator],
      template: [cfg.template],
      fileName: [cfg.fileName, Validators.required],
    });

    if (saved) {
      this.state.updateConfig(saved);
    }

    for (const cat of Object.values(PhraseCategory)) {
      this.phraseTexts[cat] = this.phraseProvider.getPhrasesAsTextByCategory(cat);
    }
  }

  savePhrases(): void {
    for (const cat of Object.values(PhraseCategory)) {
      this.phraseProvider.setPhrasesForCategory(cat, this.phraseTexts[cat]);
    }
  }

  importCsvFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) ?? '';
      this.phraseProvider.importFromCsv(content);
      for (const cat of Object.values(PhraseCategory)) {
        this.phraseTexts[cat] = this.phraseProvider.getPhrasesAsTextByCategory(cat);
      }
      input.value = '';
    };
    reader.readAsText(file, 'utf-8');
  }

  toggleWeekDay(day: number): void {
    const current: number[] = this.form.get('weekDays')!.value;
    const updated = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    this.form.get('weekDays')!.setValue(updated);
  }

  toggleMonth(month: number): void {
    const current: number[] = this.form.get('months')!.value;
    const updated = current.includes(month)
      ? current.filter((m) => m !== month)
      : [...current, month];
    this.form.get('months')!.setValue(updated);
  }

  generate(): void {
    if (this.form.invalid) return;
    const config = this.form.value;
    this.state.updateConfig(config);
    this.state.setGenerating(true);
    this.persistence.save(config);

    setTimeout(() => {
      const daysInYear = new Date(config.year, 1, 29).getDate() === 29 ? 366 : 365;
      const phrases = this.phraseProvider.getDistributed(daysInYear);
      const rows = this.agendaEngine.generate(config, phrases);
      const validation = this.corelValidator.validate(rows);
      this.state.setRows(rows);
      this.state.setValidation(validation);
      this.state.setGenerating(false);
      this.state.setView('preview');
    }, 10);
  }
}
