import { ServerErrors } from '../types/serverTypes';
import { getLocalizedErrorMessage } from './errorsParsing';

export const errorsToStrings = (error: unknown): string[] => {
  if (isServerError(error)) {
    error.errors.forEach((err) => {
      console.error(`Error [${err.extensions.code}]: ${err.message} ${err?.fieldName || 'common'}`);
      if (err.fieldName) {
        console.error(`Field: ${err.fieldName}`);
      }
    });
    return error.errors.map((error) => getLocalizedErrorMessage(error));
  }

  console.error('Unhandled error:', error);
  return [`Unknown error: ${error}`];
};

export const isServerError = (error: unknown): error is ServerErrors => {
  return (
    typeof error === 'object' && error !== null && 'errors' in error && Array.isArray((error as ServerErrors).errors)
  );
};
