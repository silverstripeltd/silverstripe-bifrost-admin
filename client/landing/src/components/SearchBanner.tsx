import React from "react";
import styles from "./searchbanner.module.css";
import { Logo } from "silverstripe-search-admin";

export default () => {
    return (
        <div className={styles.banner}>
            <Logo className={styles.title} />
            <div>
                <p className={styles.text}>
                    <a
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://dashboard.silverstripe.cloud/search"
                    >
                        Silverstripe Search dashboard
                        <svg
                            className={styles.externalIcon}
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <strong>The Silverstripe Search Dashboard</strong>
                    </a>{" "}
                    is the new home for Silverstripe Search administration.
                    Features include relevancy tuning, result curation, synonym
                    management and query analytics.
                </p>
            </div>
        </div>
    );
};
