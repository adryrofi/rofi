"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "rofi-start-form";

type SavedForm = {
  occasion: string;
  relationship: string;
  age: string;
  personality: string;
  budget: string;
  gender: string;
};

export default function Start() {
  const [occasion, setOccasion] = useState("");
  const [relationship, setRelationship] = useState("");
  const [relationshipLocked, setRelationshipLocked] = useState(false);
  const [ageLocked, setAgeLocked] = useState(false);
  const [genderLocked, setGenderLocked] = useState(false);
  const [personalityLocked, setPersonalityLocked] = useState(false);
  const [ageDisplayLocked, setAgeDisplayLocked] = useState(false);

  const [age, setAge] = useState("");
  const [personality, setPersonality] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");

  function applyOccasionRules(
    value: string,
    currentGender: string,
    currentPersonality: string,
    currentRelationship: string,
    currentAge: string,
  ) {
    if (value === "Regalo aziendale") {
      return {
        relationship: "Dipendente/i",
        relationshipLocked: true,
        age: "25+",
        ageLocked: true,
        ageDisplayLocked: true,
        gender: "Unisex",
        genderLocked: true,
        personality: "Neutra",
        personalityLocked: true,
      };
    }

    if (value === "Anniversario") {
      return {
        relationship: currentRelationship,
        relationshipLocked: false,
        age: "",
        ageLocked: true,
        ageDisplayLocked: false,
        gender: currentGender === "Unisex" ? "" : currentGender,
        genderLocked: false,
        personality: currentPersonality === "Neutra" ? "" : currentPersonality,
        personalityLocked: false,
      };
    }

    return {
      relationship: currentRelationship,
      relationshipLocked: false,
      age: currentAge === "25+" ? "" : currentAge,
      ageLocked: false,
      ageDisplayLocked: false,
      gender: currentGender === "Unisex" ? "" : currentGender,
      genderLocked: false,
      personality: currentPersonality === "Neutra" ? "" : currentPersonality,
      personalityLocked: false,
    };
  }

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved: SavedForm = JSON.parse(raw);

      const rules = applyOccasionRules(
        saved.occasion || "",
        saved.gender || "",
        saved.personality || "",
        saved.relationship || "",
        saved.age || "",
      );

      setOccasion(saved.occasion || "");
      setRelationship(rules.relationship);
      setRelationshipLocked(rules.relationshipLocked);
      setAge(rules.age);
      setAgeLocked(rules.ageLocked);
      setAgeDisplayLocked(rules.ageDisplayLocked);
      setGender(rules.gender);
      setGenderLocked(rules.genderLocked);
      setPersonality(rules.personality);
      setPersonalityLocked(rules.personalityLocked);
      setBudget(saved.budget || "");
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const data: SavedForm = {
      occasion,
      relationship,
      age,
      personality,
      budget,
      gender,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [occasion, relationship, age, personality, budget, gender]);

  const isFormValid =
    occasion && relationship && age && personality && budget && gender;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "40px",
          borderRadius: "12px",
          width: "500px",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Trova il regalo perfetto</h1>

        <div style={{ marginBottom: "15px" }}>
          <label>Occasione</label>
          <br />
          <select
            value={occasion}
            onChange={(e) => {
              const value = e.target.value;
              setOccasion(value);

              const rules = applyOccasionRules(
                value,
                gender,
                personality,
                relationship,
                age,
              );

              setRelationship(rules.relationship);
              setRelationshipLocked(rules.relationshipLocked);
              setAge(rules.age);
              setAgeLocked(rules.ageLocked);
              setAgeDisplayLocked(rules.ageDisplayLocked);
              setGender(rules.gender);
              setGenderLocked(rules.genderLocked);
              setPersonality(rules.personality);
              setPersonalityLocked(rules.personalityLocked);
            }}
            style={{
              width: "100%",
              padding: "8px",
              color: "#0f172a",
              backgroundColor: "white",
            }}
          >
            <option value="" disabled hidden>
              Seleziona occasione
            </option>
            <option>Compleanno</option>
            <option>Natale</option>
            <option>Anniversario</option>
            <option>Regalo aziendale</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Per chi è</label>
          <br />
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            disabled={relationshipLocked}
            style={{
              width: "100%",
              padding: "8px",
              color: "#0f172a",
              backgroundColor: relationshipLocked ? "#e5e7eb" : "white",
              opacity: relationshipLocked ? 0.8 : 1,
              cursor: relationshipLocked ? "not-allowed" : "pointer",
            }}
          >
            <option value="" disabled hidden>
              Per chi è?
            </option>
            <option>Partner</option>
            <option>Familiare</option>
            <option>Amico</option>
            <option>Dipendente/i</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Età</label>
          <br />
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={ageDisplayLocked}
            style={{
              width: "100%",
              padding: "8px",
              color: "#0f172a",
              backgroundColor: ageDisplayLocked ? "#e5e7eb" : "white",
              opacity: ageDisplayLocked ? 0.8 : 1,
              cursor: ageDisplayLocked ? "not-allowed" : "pointer",
            }}
          >
            <option value="" disabled hidden>
              Seleziona età
            </option>

            {occasion === "Regalo aziendale" && <option>25+</option>}

            {occasion !== "Regalo aziendale" && occasion !== "Anniversario" && (
              <>
                <option>0-6</option>
                <option>7-12</option>
              </>
            )}

            {occasion !== "Regalo aziendale" && <option>13-18</option>}

            <option>19-25</option>
            <option>26-35</option>
            <option>36-50</option>
            <option>50+</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Budget</label>
          <br />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              color: "#0f172a",
              backgroundColor: "white",
            }}
          >
            <option value="" disabled hidden>
              Seleziona budget
            </option>
            <option value="1-20">1-20€</option>
            <option value="20-30">20-30€</option>
            <option value="30-50">30-50€</option>
            <option value="50-100">50-100€</option>
            <option value="100+">Più di 100€</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Sesso</label>
          <br />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={genderLocked}
            style={{
              width: "100%",
              padding: "8px",
              color: "#0f172a",
              backgroundColor: genderLocked ? "#e5e7eb" : "white",
              opacity: genderLocked ? 0.8 : 1,
              cursor: genderLocked ? "not-allowed" : "pointer",
            }}
          >
            <option value="" disabled hidden>
              Seleziona sesso
            </option>
            <option value="Maschile">Maschile</option>
            <option value="Femminile">Femminile</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Personalità</label>
          <br />
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            disabled={personalityLocked}
            style={{
              width: "100%",
              padding: "8px",
              color: "#0f172a",
              backgroundColor: personalityLocked ? "#e5e7eb" : "white",
              opacity: personalityLocked ? 0.8 : 1,
              cursor: personalityLocked ? "not-allowed" : "pointer",
            }}
          >
            <option value="" disabled hidden>
              Seleziona personalità
            </option>

            {occasion === "Regalo aziendale" && (
              <option value="Neutra">Neutra</option>
            )}

            <option value="Creativa">Creativa</option>
            <option value="Emotiva">Emotiva</option>
            <option value="Pratica">Pratica</option>
          </select>
        </div>

        <a
          href={
            isFormValid
              ? `/risultati?occasion=${encodeURIComponent(
                  occasion,
                )}&relationship=${encodeURIComponent(
                  relationship,
                )}&age=${encodeURIComponent(age)}&personality=${encodeURIComponent(
                  personality,
                )}&budget=${encodeURIComponent(
                  budget,
                )}&gender=${encodeURIComponent(gender)}`
              : "#"
          }
          style={{
            display: "block",
            textAlign: "center",
            width: "100%",
            padding: "12px",
            background: "white",
            color: "#0f172a",
            borderRadius: "8px",
            fontWeight: "bold",
            textDecoration: "none",
            opacity: isFormValid ? 1 : 0.5,
            pointerEvents: isFormValid ? "auto" : "none",
          }}
        >
          Trova il regalo
        </a>
      </div>
    </main>
  );
}
