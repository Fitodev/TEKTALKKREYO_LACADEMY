"use client";
import { useState } from "react";
import { CourseCard } from "@/components/course-card";
export function Catalog() {
  const [query, setQuery] = useState("");
  const matches =
    "google workspace entèlijans atifisyèl automatisation biznis ia"
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .includes(
        query
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, ""),
      );
  return (
    <>
      <label htmlFor="search">Chèche yon kou</label>
      <input
        className="search"
        id="search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Non kou oswa sijè…"
      />
      <div aria-live="polite">
        {matches ? <CourseCard /> : <p>Nou pa jwenn kou pou rechèch sa a.</p>}
      </div>
    </>
  );
}
