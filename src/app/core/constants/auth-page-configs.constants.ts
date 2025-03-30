import { Validators } from '@angular/forms';
import { AuthPageConfig } from '../models/auth-page-config.model';
import { passwordComplexityValidator } from '../utils/password-complexity.validator';

export const loginConfig: AuthPageConfig = {
    title: 'Login',
    welcomePhrase: 'Showcase your professional journey with ShareCV',
    fields: [
        {
            type: 'email',
            name: 'email',
            placeholder: 'Email',
            validators: [Validators.required, Validators.email],
            errorMessages: {
                required: 'Email is required.',
                email: 'Invalid email format.',
            },
        },
        {
            type: 'password',
            name: 'password',
            additionalText: 'Forgot password?',
            placeholder: 'Password',
            validators: [Validators.required],
            errorMessages: {
                required: 'Password is required.',
            },
        },
    ],
    confirmButtonText: 'Log In',
    //isGoogleAuth: true,
    bottomPhrase: "Don't have an account? <a href='/register'>Register</a>",
};

export const registerConfig: AuthPageConfig = {
    title: 'Sign up',
    welcomePhrase: 'Start your professional journey with ShareCV today',
    fields: [
        {
            type: 'username',
            name: 'username',
            placeholder: 'Email',
            validators: [Validators.required, Validators.email],
            errorMessages: {
                required: 'Email is required.',
                email: 'Invalid email format.',
            },
        },
        {
            type: 'password',
            name: 'password',
            placeholder: 'Password',
            validators: [Validators.required, passwordComplexityValidator],
            errorMessages: {
                required: 'Password is required.',
                noLowercase: 'Password must contain at least one lowercase letter.',
                noUppercase: 'Password must contain at least one uppercase letter.',
                noSpecial:   'Password must contain at least one special character.',
            },
        },
        {
            type: 'password',
            name: 'confirmPassword',
            placeholder: 'Repeat Password',
            validators: [Validators.required],
            errorMessages: {
                required: 'Repeat Password is required.',
            },
        },
    ],
    confirmButtonText: 'Sign up',
    //isGoogleAuth: true,
    bottomPhrase: "Already have an account? <a href='/login'>Log in</a>",
};

export const forgotPasswordConfig: AuthPageConfig = {
    title: 'Forgot Password?',
    welcomePhrase: 'No worries. We’ll help you with that.',
    subtitlePhrase: 'We’ll send you an email with verification code.',
    fields: [
        {
            type: 'email',
            name: 'email',
            placeholder: 'Email',
            validators: [Validators.required, Validators.email],
            errorMessages: {
                required: 'Email is required.',
                email: 'Invalid email format.',
            },
        },
    ],
    confirmButtonText: 'Send a code',
    bottomPhraseButton: 'Back to log in',
};

export const passwordResetConfig: AuthPageConfig = {
    title: 'Password reset',
    welcomePhrase: 'No worries. We’ll help you with that.',
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
    bottomPhrase: "Didn’t receive the verification code? <a>Resend it</a>",
    bottomPhraseButton: 'Back to log in',
};

export const successfulPasswordResetConfig: AuthPageConfig = {
    title: 'Successful',
    welcomePhrase: 'No worries. We’ll help you with that.',
    subtitlePhrase: 'Your password has been reset.',
    bottomPhraseButton: 'Back to log in',
};
