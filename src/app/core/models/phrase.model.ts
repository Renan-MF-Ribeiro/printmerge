import { PhraseCategory } from '../enums/phrase-category.enum';

export interface Phrase {
  text: string;
  category: PhraseCategory;
}
