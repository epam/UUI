"use client";

import type { NextPage } from "next";
import React from "react";
import styles from "../styles/Home.module.scss";
import { Text } from "@epam/promo";
import { Anchor } from "@epam/uui";
import { structure } from "../helpers/structure";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Demo</h1>
                <div className={`${styles.grid} withGap`}>
                    {structure
                        .filter((it) => it.previewImage)
                        .map((item) => {
                            return (
                                <Anchor
                                    key={item.id}
                                    link={item.link}
                                    cx={styles.card}
                                >
                                    <div
                                        className={styles.cardImage}
                                        style={{
                                            backgroundImage: `url(${item.previewImage})`,
                                        }}
                                    >
                                        <img
                                            src={item.previewImage}
                                            className={`${styles.cardImage} ${styles.hidden}`}
                                        />
                                        <Text
                                            fontWeight="400"
                                            lineHeight="30"
                                            fontSize="24"
                                            cx={styles.cardText}
                                        >
                                            {item.name}
                                        </Text>
                                    </div>
                                </Anchor>
                            );
                        })}
                </div>
            </main>
        </div>
    );
};

export default Home;
