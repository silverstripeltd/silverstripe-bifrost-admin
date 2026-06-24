import React from "react";
import styles from "./searchbanner.module.css";
import { Logo } from "silverstripe-search-admin";

export default () => {
    return (
        <div className={styles.banner}>
            <Logo className={styles.title} />
            <div>
                <p className={styles.text}>Silverstripe Search is a managed service and actively under development. While we're working on a stand-alone dashboard, your engines can be managed here in the CMS</p>
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
                </a>
                <a
                    className={styles.link}
                    href="/admin/search-service"
                >
                    Search indexing administration
                </a>
                <a
                    className={styles.link}
                    target="_blank"
                    href="https://9595b293cf40d7532796c4ca67a27b81-bifrost.silverstripe.io/resources/guides/index.html"
                >
                    Customer guides
                </a>
                <a
                    className={styles.link}
                    target="_blank"
                    href="https://9595b293cf40d7532796c4ca67a27b81-bifrost.silverstripe.io/api/v1/docs"
                >
                    API specification
                </a>
            </div>
        </div>
    );
};
