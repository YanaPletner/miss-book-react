const { Link } = ReactRouterDOM;

import { BugPreview } from "./BugPreview.jsx";

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  return (
    <ul className="bug-list container">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            <button onClick={() => onRemoveBug(bug._id)}>x</button>
            <button onClick={() => onEditBug(bug)}>Edit</button>
            <button>
              <Link to={`/bug/${bug._id}`}>Details</Link>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
