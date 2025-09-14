import { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import FeedbackList from "./FeedbackList";

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);

  const addFeedback = (newFeedback) => {
    setFeedbacks([newFeedback, ...feedbacks]); // latest on top
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Feedback Session</h1>
      <FeedbackForm onFeedbackAdded={addFeedback} />
      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}

export default FeedbackPage;
