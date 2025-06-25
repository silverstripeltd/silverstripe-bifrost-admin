import React, { useState } from "react";
import {
    ErrorMessage,
    Field,
    Form,
    Formik,
    FormikConfig,
    FormikErrors,
    FieldArray,
} from "formik";
import styles from "./form.module.css";
import btnStyles from "./buttons.module.css";

export const TYPE_DIRECTIONAL = "TYPE_DIRECTIONAL";
export const TYPE_EQUIVALENT = "TYPE_EQUIVALENT";

export interface CreateFormValues {
    type: string;
    synonyms: string[];
}

export interface UpdateFormValues extends CreateFormValues {
    id?: string;
}

export type FormValues = UpdateFormValues | CreateFormValues;

interface SynonymFormProps<Values> {
    onSubmit: FormikConfig<Values>["onSubmit"];
    initialValues?: FormValues;
    removeSynonym?: (id: string) => Promise<any>;
}

const validate = (values: FormValues): FormikErrors<FormValues> => {
    let errors = {};
    const synonymValues = values?.synonyms?.filter((value) => value) ?? [];
    if (synonymValues.length < 2) {
        errors["synonyms"] = "At least one synonym pair required";
    }

    return errors;
};

// render function for FieldArray
const getRows =
    (values: FormValues) =>
    ({ remove, push }) => {
        const rowInputs = values.synonyms.map((row, index) => {
            return (
                <div key={index} className={styles.synonymRow}>
                    <Field
                        className={`${styles.synonymInput} ${
                            index ? "" : styles.firstSynonymInput
                        }`}
                        type="text"
                        name={`synonyms[${index}]`}
                        aria-label={`Synonym ${index + 1}`}
                        placeholder="Enter a synonym"
                    ></Field>
                    {index ? (
                        <button
                            className={`${btnStyles.iconButton} ${btnStyles.deleteIcon}`}
                            type="button"
                            aria-label="remove synonym"
                            onClick={() => remove(index)}
                        >
                            <i className="font-icon-trash-bin"></i>
                        </button>
                    ) : null}
                </div>
            );
        });

        return (
            <>
                {rowInputs}
                <button
                    type="button"
                    className="btn btn-outline-secondary vertical-align-items"
                    onClick={() => push("")}
                >
                    <i
                        style={{
                            lineHeight: "10px",
                            marginRight: "0.5rem",
                            fontSize: "1.2rem",
                        }}
                        className="font-icon-plus"
                    />{" "}
                    Add value
                </button>
            </>
        );
    };

export const BaseForm = ({
    onSubmit,
    initialValues = { type: TYPE_EQUIVALENT, synonyms: ["", ""] },
    removeSynonym,
}: SynonymFormProps<FormValues>) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const submitter: FormikConfig<FormValues>["onSubmit"] = (
        values: FormValues,
        ...other
    ) => {
        // filter empty synonyms before submit
        const synonyms = values?.synonyms?.filter((value) => value) ?? [];
        values.synonyms = synonyms;
        return onSubmit(values, ...other);
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submitter}
            validate={validate}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({ values, isSubmitting, errors }) => (
                <Form>
                    <div className={styles.formBody}>
                        <Field
                            type="hidden"
                            name="type"
                            value={TYPE_EQUIVALENT}
                        />
                        <ErrorMessage name="type" />
                        <fieldset className={styles.fieldset}>
                            <legend className="sr-only">Synonyms:</legend>
                            <FieldArray name="synonyms">
                                {getRows(values)}
                            </FieldArray>

                            {errors.synonyms && (
                                <div className="alert alert-danger">
                                    {errors.synonyms}
                                </div>
                            )}
                        </fieldset>
                        {"id" in values ? (
                            <Field
                                type="hidden"
                                name="id"
                                value={values.id}
                            ></Field>
                        ) : null}
                    </div>
                    <div className={styles.formFooter}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Adding.." : "Save"}
                        </button>
                        {"id" in values && removeSynonym ? (
                            <button
                                type="button"
                                className="btn btn-danger"
                                disabled={isDeleting}
                                onClick={() => {
                                    setIsDeleting(true);
                                    removeSynonym(values.id)
                                        .then(() => {
                                            setIsDeleting(false);
                                        });
                                }}
                            >
                                {isDeleting ? "Deleting.." : "Delete"}
                            </button>
                        ) : null}
                    </div>
                </Form>
            )}
        </Formik>
    );
};
