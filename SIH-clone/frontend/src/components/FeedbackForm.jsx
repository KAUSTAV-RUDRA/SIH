import { useState } from "react";

function FeedbackForm({ onFeedbackAdded }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;

    const newFeedback = {
      id: Date.now(),
      name: name || "Anonymous",
      message,
      created_at: new Date().toLocaleString(),
    };

    onFeedbackAdded(newFeedback);
    setName("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      <h2 className="text-xl mb-2">Leave Feedback</h2>
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Your Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}

export default FeedbackForm;
