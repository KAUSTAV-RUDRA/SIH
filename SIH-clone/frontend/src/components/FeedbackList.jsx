function FeedbackList({ feedbacks }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Feedback Sessions</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback yet. Be the first!</p>
      ) : (
        <ul className="space-y-2">
          {feedbacks.map((f) => (
            <li key={f.id} className="border p-2 rounded">
              <strong>{f.name}:</strong> {f.message}
              <div className="text-sm text-gray-500">{f.created_at}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedbackList;
