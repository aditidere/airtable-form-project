import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormBuilderPage() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [airtableBaseId, setAirtableBaseId] = useState("");
  const [airtableTableId, setAirtableTableId] = useState("");

  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        label: "",
        type: "shortText",
        required: false,
        options: [],
        questionKey: "q_" + Math.random().toString(36).substring(2, 10),
        airtableFieldId: "fld" + Math.random().toString(36).substring(2, 8)
      }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (index) => {
    const updated = [...questions];
    updated[index].options.push("");
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const createForm = async () => {
    // Clean payload: remove empty options for text fields
    const cleanedQuestions = questions.map((q) => ({
      ...q,
      options:
        q.type === "singleSelect" || q.type === "multiSelect"
          ? q.options.filter((o) => o.trim() !== "")
          : []
    }));

    const payload = {
      name,
      airtableBaseId,
      airtableTableId,
      questions: cleanedQuestions,
    };

    const res = await fetch(
      `http://localhost:5000/api/forms?userId=${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Form created successfully!");
      navigate("/");
    } else {
      alert("Error: " + (data.message || "Request failed"));
      console.log(data);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create a Form</h2>
<h3>Form Name:</h3>
<input
  placeholder="Enter form name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  style={{ display: "block", marginBottom: "20px" }}
/>

      <input
        placeholder="Airtable Base ID"
        value={airtableBaseId}
        onChange={(e) => setAirtableBaseId(e.target.value)}
      />

      <input
        placeholder="Airtable Table ID"
        value={airtableTableId}
        onChange={(e) => setAirtableTableId(e.target.value)}
      />

      <h3>Questions</h3>

      {questions.map((q, i) => (
        <div key={q.questionKey} style={{ marginBottom: "1.5rem", border: "1px solid #ddd", padding: "10px", borderRadius: "10px" }}>
          
          <input
            placeholder="Label"
            value={q.label}
            onChange={(e) => updateQuestion(i, "label", e.target.value)}
          />

          <select
            value={q.type}
            onChange={(e) => updateQuestion(i, "type", e.target.value)}
          >
            <option value="shortText">Short Text</option>
            <option value="longText">Long Text</option>
            <option value="singleSelect">Single Select</option>
            <option value="multiSelect">Multi Select</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={q.required}
              onChange={(e) => updateQuestion(i, "required", e.target.checked)}
            />
            Required
          </label>

          {(q.type === "singleSelect" || q.type === "multiSelect") && (
            <div style={{ marginTop: "10px" }}>
              <b>Options:</b>
              {q.options.map((opt, idx) => (
                <input
                  key={idx}
                  placeholder="Option"
                  value={opt}
                  onChange={(e) => updateOption(i, idx, e.target.value)}
                  style={{ display: "block", marginTop: "5px" }}
                />
              ))}

              <button onClick={() => addOption(i)}>+ Add Option</button>
            </div>
          )}
        </div>
      ))}

      <button onClick={addQuestion}>+ Add Question</button>

      <br /><br />

      <button onClick={createForm}>Create Form</button>
    </div>
  );
}
