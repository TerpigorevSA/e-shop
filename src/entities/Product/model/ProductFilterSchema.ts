import * as yup from 'yup';
import { CommonFilters, ProductsFilters } from '../../../shared/types/serverTypes';

// export const productFilterSchema: yup.ObjectSchema<Omit<ProductsFilters, keyof CommonFilters>> = yup.object({
//   name: yup.string().optional(),
//   ids: yup
//     .array()
//     .of(yup.string())
//     .optional()
//     .test('non-empty', 'IDs cannot be empty', (value) => !value || value.length > 0),
//   categoryIds: yup
//     .array()
//     .of(yup.string())
//     .optional()
//     .test('non-empty', 'Category IDs cannot be empty', (value) => !value || value.length > 0),
// });

export const createProductFiltersSchema = (
  validCategiryIds: string[],
): yup.ObjectSchema<Omit<ProductsFilters, keyof CommonFilters>> => {
  return yup.object({
    categoryIds: yup.array(yup.string().required().oneOf(validCategiryIds)).optional(),
    name: yup.string().optional(),
    ids: yup.array().optional(),
  });
};
