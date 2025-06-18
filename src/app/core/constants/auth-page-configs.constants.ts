import { Validators } from '@angular/forms';
import { AuthPageConfig } from '../models/auth-page-config.model';
import { passwordComplexityValidator } from '../utils/password-complexity.validator';

export const loginConfig: AuthPageConfig = {
    title: 'auth.login',
    welcomePhrase: 'Showcase your professional journey with ShareCV',
    fields: [
        {
            type: 'email',
            name: 'email',
            placeholder: 'auth.email',
            validators: [Validators.required, Validators.email],
            errorMessages: {
                required: 'validation.required',
                email: 'validation.email',
            },
        },
        {
            type: 'password',
            name: 'password',
            additionalText: 'auth.forgotPassword',
            placeholder: 'auth.password',
            validators: [Validators.required],
            errorMessages: {
                required: 'validation.required',
            },
        },
    ],
    confirmButtonText: 'auth.login',
    //isGoogleAuth: true,
    bottomPhrase: 'auth.dontHaveAccountWithLink',
};

export const registerConfig: AuthPageConfig = {
    title: 'auth.register',
    welcomePhrase: 'auth.joinCommunity',
    fields: [
        {
            type: 'email',
            name: 'email',
            placeholder: 'auth.email',
            validators: [Validators.required, Validators.email],
            errorMessages: {
                required: 'validation.required',
                email: 'validation.email',
            },
        },
        {
            type: 'password',
            name: 'password',
            placeholder: 'auth.password',
            validators: [Validators.required, passwordComplexityValidator],
            errorMessages: {
                required: 'validation.required',
                noLowercase: 'validation.noLowercase',
                noUppercase: 'validation.noUppercase',
                noSpecial: 'validation.noSpecial',
            },
        },
        {
            type: 'password',
            name: 'confirmPassword',
            placeholder: 'auth.confirmPassword',
            validators: [Validators.required],
            errorMessages: {
                required: 'validation.required',
                passwordMismatch: 'validation.passwordMismatch',
            },
        },
    ],
    confirmButtonText: 'auth.register',
    //isGoogleAuth: true,
    bottomPhrase: 'auth.alreadyHaveAccountWithLink',
};

export const forgotPasswordConfig: AuthPageConfig = {
    title: 'auth.resetPassword',
    welcomePhrase: "No worries. We'll help you with that.",
    subtitlePhrase: 'auth.resetPasswordInstructions',
    fields: [
        {
            type: 'email',
            name: 'email',
            placeholder: 'auth.email',
            validators: [Validators.required, Validators.email],
            errorMessages: {
                required: 'validation.required',
                email: 'validation.email',
            },
        },
    ],
    confirmButtonText: 'auth.sendResetLink',
    bottomPhraseButton: 'auth.backToLogin',
};

export const passwordResetConfig: AuthPageConfig = {
    title: 'Password reset',
    welcomePhrase: "No worries. We'll help you with that.",
    subtitlePhrase: 'We sent a code to <a> emailexample@gmail.com. </a>',
    fields: [
        {
            type: 'text',
            name: 'code',
            placeholder: '6-digit code',
            validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
            errorMessages: {
                required: 'Code is required.',
                pattern: 'Code must be a 6-digit number.',
            },
        },
    ],
    confirmButtonText: 'Continue',
    bottomPhrase: "Didn't receive the verification code? <a>Resend it</a>",
    bottomPhraseButton: 'Back to log in',
};

export const successfulPasswordResetConfig: AuthPageConfig = {
    title: 'Successful',
    welcomePhrase: "No worries. We'll help you with that.",
    subtitlePhrase: 'Your password has been reset.',
    bottomPhraseButton: 'Back to log in',
};
