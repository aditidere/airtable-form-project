import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FormResponsePage() {
  const { id } = useParams(); // formId from URL
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch(() => alert("Error loading form"));
  }, [id]);

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:5000/api/responses?formId=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Error submitting form");
    }
  };

  if (!form) return <p>Loading...</p>;

  if (submitted)
    return <h2>Thank you! Your response has been submitted.</h2>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{form.name}</h1>

      {form.questions.map((q) => (
        <div key={q.questionKey} style={{ marginBottom: "1rem" }}>
          <label>{q.label}</label>
          <br />

          {q.type === "shortText" && (
            <input
              type="text"
              onChange={(e) =>
                setAnswers({ ...answers, [q.questionKey]: e.target.value })
              }
            />
          )}

          {q.type === "multiSelect" && (
            <select
              multiple
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [q.questionKey]: Array.from(
                    e.target.selectedOptions,
                    (o) => o.value
                  ),
                })
              }
            >
              {q.options.map((op, i) => (
                <option key={i} value={op}>
                  {op}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
