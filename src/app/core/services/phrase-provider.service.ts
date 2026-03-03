import { Injectable, signal } from '@angular/core';
import { Phrase } from '../models/phrase.model';
import { PhraseCategory } from '../enums/phrase-category.enum';

const DEFAULT_PHRASES: Phrase[] = [
  {
    text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.',
    category: PhraseCategory.MOTIVACIONAL,
  },
  { text: 'Acredite em você mesmo e tudo será possível.', category: PhraseCategory.MOTIVACIONAL },
  {
    text: 'O único lugar onde o sucesso vem antes do trabalho é no dicionário.',
    category: PhraseCategory.EMPRESARIAL,
  },
  { text: 'Tudo posso naquele que me fortalece.', category: PhraseCategory.BIBLICO },
  {
    text: 'A educação é a arma mais poderosa que você pode usar para mudar o mundo.',
    category: PhraseCategory.ESCOLAR,
  },
  {
    text: 'Não espere por uma crise para descobrir o que é importante em sua vida.',
    category: PhraseCategory.MOTIVACIONAL,
  },
  {
    text: 'O conhecimento é a única coisa que ninguém pode tirar de você.',
    category: PhraseCategory.ESCOLAR,
  },
  { text: 'Seja a mudança que você quer ver no mundo.', category: PhraseCategory.MOTIVACIONAL },
  { text: 'O Senhor é meu pastor e nada me faltará.', category: PhraseCategory.BIBLICO },
  {
    text: 'Inovação é o que distingue um líder de um seguidor.',
    category: PhraseCategory.EMPRESARIAL,
  },
  { text: 'O aprendizado é uma jornada sem fim.', category: PhraseCategory.ESCOLAR },
  {
    text: 'Grandes realizações requerem tempo e dedicação.',
    category: PhraseCategory.MOTIVACIONAL,
  },
];

@Injectable({ providedIn: 'root' })
export class PhraseProviderService {
  private phrases = signal<Phrase[]>(DEFAULT_PHRASES);

  getPhrases(categories?: PhraseCategory[]): string[] {
    const all = this.phrases();
    if (!categories || categories.length === 0) {
      return all.map((p) => p.text);
    }
    return all.filter((p) => categories.includes(p.category)).map((p) => p.text);
  }

  private parseLines(text: string): Phrase[] {
    const validCategories = new Set<string>(Object.values(PhraseCategory));
    return text
      .split('\n')
      .filter((l) => l.trim())
      .map((line) => {
        const parts = line.split(';');
        const rawCategory = parts[1]?.trim() ?? '';
        const category = validCategories.has(rawCategory)
          ? (rawCategory as PhraseCategory)
          : PhraseCategory.MOTIVACIONAL;
        return { text: parts[0]?.trim() || '', category };
      })
      .filter((p) => p.text);
  }

  getPhrasesAsText(): string {
    return this.phrases()
      .map((p) => `${p.text};${p.category}`)
      .join('\n');
  }

  getPhrasesAsTextByCategory(category: PhraseCategory): string {
    return this.phrases()
      .filter((p) => p.category === category)
      .map((p) => p.text)
      .join('\n');
  }

  setPhrasesForCategory(category: PhraseCategory, text: string): void {
    const incoming = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l)
      .map((t) => ({ text: t, category }));
    this.phrases.update((current) => [
      ...current.filter((p) => p.category !== category),
      ...incoming,
    ]);
  }

  setPhrasesFromText(text: string): void {
    this.phrases.set(this.parseLines(text));
  }

  importFromCsv(csvContent: string): void {
    this.phrases.update((current) => [...current, ...this.parseLines(csvContent)]);
  }

  getDistributed(count: number, categories?: PhraseCategory[]): string[] {
    const source = this.getPhrases(categories);
    if (source.length === 0) return [];
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(source[i % source.length]);
    }
    return result;
  }
}
