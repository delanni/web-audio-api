import styles from "../styles/Home.module.css";
import React from "react";

interface LinkCardProps {
  href: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function LinkCard({ href, title, description, children }: LinkCardProps) {
  return (
      <a href={href} className={styles.card}>
        <h2>{title}</h2>
        <p>{description}</p>
      </a>
  );
}
