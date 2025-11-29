import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FormViewerPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Fetch form details
  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`http://localhost:5000/api/forms/${formId}`);
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("Error loading form:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [formId]);

  // Handle input change
  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Submit response
  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId");

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
        setSubmitted(true);
      } else {
        alert(data.message || "Error submitting form");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!form) return <p>Form not found.</p>;

  if (submitted)
    return (
      <div style={{ padding: "2rem" }}>
        <h2>🎉 Form submitted successfully!</h2>
      </div>
    );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{form.name || "Fill the Form"}</h2>

      {form.questions.map((q) => (
        <div key={q.questionKey} style={{ marginBottom: "1rem" }}>
          <label>
            <strong>{q.label}</strong>
          </label>

          {/* Short Text */}
          {q.type === "shortText" && (
            <input
              type="text"
              onChange={(e) => updateAnswer(q.questionKey, e.target.value)}
              style={{ display: "block", marginTop: "6px" }}
            />
          )}

          {/* Long Text */}
          {q.type === "longText" && (
            <textarea
              onChange={(e) => updateAnswer(q.questionKey, e.target.value)}
              style={{ display: "block", marginTop: "6px", width: "250px" }}
            />
          )}

          {/* Single Select */}
          {q.type === "singleSelect" && (
            <select
              onChange={(e) => updateAnswer(q.questionKey, e.target.value)}
              style={{ display: "block", marginTop: "6px" }}
            >
              <option value="">Select</option>
              {q.options?.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          )}

          {/* Multi Select */}
          {q.type === "multiSelect" && (
            <div>
              {q.options?.map((op) => (
                <label key={op} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const list = answers[q.questionKey] || [];
                      if (e.target.checked) {
                        updateAnswer(q.questionKey, [...list, op]);
                      } else {
                        updateAnswer(
                          q.questionKey,
                          list.filter((i) => i !== op)
                        );
                      }
                    }}
                  />
                  {op}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
        Submit Form
      </button>
    </div>
  );
}
