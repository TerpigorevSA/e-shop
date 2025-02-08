import { canCastToExtendedFetchError, canCastToFetchError } from './errorsCast';
import { errorsToStrings } from './errorsToStrings';

export const unexpectedErrorBounce = (error: unknown) => {
  if (!!error && !Array.isArray(error)) {
    if (canCastToFetchError(error)) {
      throw Error(errorsToStrings(error.data).join(',\n'));
    }
    if (canCastToExtendedFetchError(error)) {
      throw Error(error.error);
    }
    throw Error('Unknown error');
  }
};
