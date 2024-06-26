const { useState, useEffect } = React;
const { useParams, useNavigate, Link } = ReactRouterDOM;

import { userService } from "../services/user.service.js";
import { bugService } from "../services/bug.service.js";
// import { BugPreview } from "../cmps/BugPreview.jsx";
import { BugList } from "../cmps/BugList.jsx";
// import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";

export function UserDetails(onRemoveBug, onEditBug) {
  const [user, setUser] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [userBugs, setUserBugs] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadUserBugs();
  }, [params.userId]);

  function loadUser() {
    userService
      .get(params.userId)
      .then((user) => setUser(user))
      .catch((err) => {
        console.log("err:", err);
        navigate("/");
      });
  }

  function loadUserBugs() {
    userService
      .getUserBugs(params.userId)
      .then((bugs) => setUserBugs(bugs))
      .catch((err) => {
        console.log("err:", err);
        // navigate("/");
      });
  }

  function onBack() {
    navigate("/");
  }

  if (!user) return <div>Loading...</div>;
  return (
    <section className="user-details">
      <h1>User {user.fullname}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <BugList bugs={userBugs} />
      <br></br>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem
        accusantium, itaque ut voluptates quo? Vitae animi maiores nisi,
        assumenda molestias odit provident quaerat accusamus, reprehenderit
        impedit, possimus est ad?
      </p>
      <button onClick={onBack}>Back</button>
    </section>
  );
}
