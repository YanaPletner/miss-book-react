const { useState, useEffect } = React;
const { Link, useParams, useNavigate } = ReactRouterDOM;

import { bugService } from "../services/bug.service.js";
import { showErrorMsg } from "../services/event-bus.service.js";

export function BugDetails() {
  const [bug, setBug] = useState(null);
  const { bugId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    bugService
      .getById(bugId)
      .then((bug) => setBug(bug))
      .catch((err) => {
        showErrorMsg("Cannot load bug");
        navigate("/bug");
      });
  }, []);

  if (!bug) return <h1>loadings....</h1>;
  const { title, severity, description, labels, createdAt } = bug;

  const formattedTime = new Date(createdAt).toLocaleDateString("he");
  return (
    <div>
      <h3>Bug Details 🐛</h3>
      <h4>{title}</h4>
      <p>
        Severity: <span>{severity}</span>
      </p>
      <p>Description: {description}</p>
      <p>Labels: {labels.join(", ")}</p>
      <p>Created At: {formattedTime}</p>
      <Link to="/bug">Back to List</Link>
    </div>
  );
}
