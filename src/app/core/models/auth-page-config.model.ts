import { ValidatorFn } from "@angular/forms";

export interface AuthPageConfig {
    title: string;
    welcomePhrase: string;
    subtitlePhrase?: string;
    fields?: AuthFieldConfig[];
    confirmButtonText?: string;
    isGoogleAuth?: boolean;
    bottomPhrase?: string;
    bottomPhraseButton?: string;
}

export interface AuthFieldConfig {
    type: string;
    name: string;
    placeholder: string;
    additionalText?: string;
    validators?: ValidatorFn[];
    errorMessages: Record<string, string>;
}
