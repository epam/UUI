/**
 * Application-specific form metadata.
 * Augment this interface to add fields to `Metadata` and `IEditable`.
 * Put the augmentation in a `.d.ts` file of the application. The file must be included in the project compilation.
 *
 * Return the fields from `useForm` `getMetadata`, next to the built-in validation options.
 * `lens.toProps()` copies fields of the current node onto component props.
 * Fields of a parent node are not copied. `isReadonly`, `isDisabled`, and `isRequired` still cascade from the parent.
 *
 * Keep here behavior of your own inputs, for example why a field is readonly or disabled.
 * A custom validator receives the field value, not the metadata, so close over the same value.
 * The fields can also carry presentation data, such as a label, when UI is built from metadata.
 *
 * @example
 * declare module '@epam/uui-core' {
 *     interface MetadataExtensions {
 *         editRestriction?: string;
 *     }
 * }
 *
 * const editRestriction = role === 'hr' ? undefined : 'Only HR can edit salary';
 *
 * const getMetadata = (): Metadata<Person> => ({
 *     props: {
 *         salary: {
 *             isReadonly: !!editRestriction,
 *             editRestriction,
 *             validators: [(salary) => {
 *                 return [!editRestriction && salary != null && salary < 0 && 'Salary must be positive'];
 *             }],
 *         },
 *     },
 * });
 *
 * const salaryProps = lens.prop('salary').toProps();
 *
 * <LabeledInput label="Salary" info={ salaryProps.editRestriction }>
 *     <NumericInput { ...salaryProps } />
 * </LabeledInput>
 */
export interface MetadataExtensions {}
