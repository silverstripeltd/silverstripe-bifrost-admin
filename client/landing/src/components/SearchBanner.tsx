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
