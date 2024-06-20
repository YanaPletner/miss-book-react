import { BugFilter } from "../cmps/BugFilter.jsx";
import { BugList } from "../cmps/BugList.jsx";
import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { utilService } from "../services/util.service.js";

const { useState, useEffect, useRef } = React;

export function BugIndex() {
  const [bugs, setBugs] = useState([]);
  const [labels, setLabels] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter());
  const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500));

  useEffect(() => {
    loadLabels();
    loadPageCount();
  }, []);

  useEffect(() => {
    loadBugs();
  }, [filterBy]);

  function loadBugs() {
    bugService
      .query(filterBy)
      .then((bugs) => setBugs(bugs))
      .catch((err) => {
        console.log("err:", err);
        showErrorMsg("Cannot load bugs");
      });
  }

  function loadLabels() {
    bugService
      .getLabels()
      .then((labels) => setLabels(labels))
      .catch((err) => {
        console.log("err:", err);
        showErrorMsg("Cannot get labels");
      });
  }

  function loadPageCount() {
    bugService
      .getPageCount()
      .then((pageCount) => setPageCount(+pageCount))
      .catch((err) => {
        console.log("err:", err);
        showErrorMsg("Cannot get page count");
      });
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log("Deleted Successfully!");
        setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
        loadPageCount();
        showSuccessMsg("Bug removed");
      })
      .catch((err) => {
        console.log("Error from onRemoveBug ->", err);
        showErrorMsg("Cannot remove bug");
      });
  }

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }));
  }

  function onAddBug() {
    const title = prompt("Bug title?");
    const description = prompt("Bug description?");
    const severity = +prompt("Bug severity?");
    const labelsInput = prompt("Bug labels (comma-separated)?");
    const labels = labelsInput
      ? labelsInput.split(",").map((lbl) => lbl.trim())
      : [];

    const bug = {
      title,
      description,
      severity,
      labels,
    };

    bugService
      .save(bug)
      .then((savedBug) => {
        // console.log('Added Bug', savedBug)
        setBugs((prevBugs) => [...prevBugs, savedBug]);
        showSuccessMsg("Bug added");
        loadPageCount();
      })
      .catch((err) => {
        console.log("Error from onAddBug ->", err);
        showErrorMsg("Cannot add bug");
      });
  }

  function onEditBug(bug) {
    const severity = +prompt("New severity?");
    const bugToSave = { ...bug, severity };
    bugService
      .save(bugToSave)
      .then((savedBug) => {
        // console.log('Updated Bug:', savedBug)
        setBugs((prevBugs) =>
          prevBugs.map((currBug) =>
            currBug._id === savedBug._id ? savedBug : currBug
          )
        );
        showSuccessMsg("Bug updated");
      })
      .catch((err) => {
        console.log("Error from onEditBug ->", err);
        showErrorMsg("Cannot update bug");
      });
  }

  function onDownloadPdf() {
    bugService
      .downloadPdf()
      .then(() => {
        console.log("PDF DOWNLOAD");
        showSuccessMsg("Download pdf successfully");
      })
      .catch((err) => {
        console.log("err:", err);
        showErrorMsg("Cannot download pdf");
      });
  }

  // if (!bugs || !bugs.length) return <h1>no bugs today</h1>
  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <button onClick={onDownloadPdf}>Download PDF</button>
        <BugFilter
          pageCount={pageCount}
          labels={labels}
          filterBy={filterBy}
          onSetFilterBy={debouncedSetFilterBy.current}
        />
        <button onClick={onAddBug}>Add Bug ⛐</button>
        {bugs && bugs.length ? (
          <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug}
          />
        ) : (
          <h1>no bugs today</h1>
        )}
      </main>
    </main>
  );
}
