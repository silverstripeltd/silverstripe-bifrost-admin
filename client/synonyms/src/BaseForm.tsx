import React from "react";
import { ErrorMessage, Field, Form, Formik, FormikConfig } from "formik";

export const TYPE_DIRECTIONAL = "TYPE_DIRECTIONAL";
export const TYPE_EQUIVALENT = "TYPE_EQUIVALENT";


export interface CreateFormValues {
    type: string;
    root: string;
    synonyms: string;
}

export interface UpdateFormValues extends CreateFormValues {
    id?: string;
}

export type FormValues = UpdateFormValues|CreateFormValues;

interface SynonymFormProps<Values> {
    onSubmit: FormikConfig<Values>["onSubmit"]
    initialValues?: FormValues;
}

export const BaseForm = ({
    onSubmit,
    initialValues = { type: TYPE_EQUIVALENT, root: "", synonyms: "" },
}: SynonymFormProps<FormValues>) => {

    return (
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
                    {({ values, isSubmitting }) => (
                        <Form>
                            <label>
                                Select Type:
                                <Field as="select" name="type">
                                    <option value={TYPE_EQUIVALENT}>
                                        equivalent
                                    </option>
                                    <option value={TYPE_DIRECTIONAL}>
                                        directional
                                    </option>
                                </Field>
                                <ErrorMessage name="type" />
                            </label>
                            {values.type === TYPE_DIRECTIONAL ? (
                                <label>
                                    Root words (one word per line):
                                    <Field as="textarea" name="root"></Field>
                                    <ErrorMessage name="root" />
                                </label>
                            ) : null}
                            <label>
                                Synonyms (one word per line):
                                <Field as="textarea" name="synonyms"></Field>
                                <ErrorMessage name="synonyms" />
                            </label>

                            {'id' in values ? <Field as="hidden" name="id"></Field> : null}

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding.." : "Submit"}
                            </button>
                        </Form>
                    )}
                </Formik>
    );
};
