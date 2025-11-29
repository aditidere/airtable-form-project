import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FormSubmitPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const userId = localStorage.getItem("userId");

  // Fetch the form details
  useEffect(() => {
    async function loadForm() {
      const res = await fetch(`http://localhost:5000/api/forms/${formId}`);
      const data = await res.json();
      if (res.ok) {
        setForm(data);
      } else {
        alert(data.message || "Failed to load form");
      }
    }
    loadForm();
  }, [formId]);

  const handleSubmit = async () => {
    const res = await fetch(
      `http://localhost:5000/api/responses/${formId}?userId=${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Response submitted successfully!");
    } else {
      alert(data.message || "Submit failed");
    }
  };

  if (!form) return <p>Loading form...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{form.name}</h2>

      {form.questions.map((q) => (
        <div key={q._id} style={{ marginBottom: "1rem" }}>
          <label>
            {q.label}{" "}
            {q.required ? <span style={{ color: "red" }}>*</span> : ""}
          </label>

          {q.type === "shortText" && (
            <input
              type="text"
              onChange={(e) =>
                setAnswers({ ...answers, [q.questionKey]: e.target.value })
              }
            />
          )}

          {q.type === "multiSelect" && (
            <textarea
              placeholder="Enter comma separated values"
              onChange={(e) =>
                setAnswers({ ...answers, [q.questionKey]: e.target.value })
              }
            />
          )}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Response</button>
    </div>
  );
}
