import React from "react";
import styles from "./searchbanner.module.css";
import { Logo } from "silverstripe-search-admin";

export default () => {
    return (
        <div className={styles.banner}>
            <Logo className={styles.title} />
            <div>
                <p className={styles.text}>
                    The
                    <a
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://dashboard.silverstripe.cloud/search"
                    >
                        <strong>Silverstripe Search Dashboard</strong>

                    </a>{" "}
                    is the new home for Silverstripe Search administration.
                    Features include relevancy tuning, result curation, synonym
                    management and query analytics.
                </p>
            </div>
        </div>
    );
};
