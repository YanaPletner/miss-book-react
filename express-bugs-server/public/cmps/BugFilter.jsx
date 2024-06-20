const { useState, useEffect } = React;

export function BugFilter({
  filterBy,
  onSetFilterBy,
  labels: availableLabels,
  pageCount,
}) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);
  // const [selectedLabels, setSelectedLabels] = useState([])

  useEffect(() => {
    onSetFilterBy(filterByToEdit);
  }, [filterByToEdit]);

  function handleChange({ target }) {
    const field = target.name;
    let value = target.value;

    switch (target.type) {
      case "number":
      case "range":
        value = +value || "";
        break;

      case "checkbox":
        value = target.checked ? -1 : 1;
        break;

      default:
        break;
    }

    setFilterByToEdit((prevFilter) => ({
      ...prevFilter,
      [field]: value,
      pageIdx: 0,
    }));
  }

  function handleLabelChange({ target }) {
    const { name: label, checked: isChecked } = target;

    setFilterByToEdit((prevFilter) => ({
      ...prevFilter,
      pageIdx: 0,
      labels: isChecked
        ? [...prevFilter.labels, label]
        : prevFilter.labels.filter((lbl) => lbl !== label),
    }));
  }

  function onGetPage(diff) {
    let pageIdx = filterByToEdit.pageIdx + diff;
    if (pageIdx < 0) pageIdx = pageCount - 1;
    if (pageIdx > pageCount - 1) pageIdx = 0;
    setFilterByToEdit((prev) => ({ ...prev, pageIdx }));
  }

  const { txt, severity, sortBy, sortDir, labels } = filterByToEdit;

  // const availableLabels = ['critical', 'need-CR', 'dev-branch']

  return (
    <section className="bug-filter">
      <h2>Filter Our Bugs</h2>
      <div>
        <label htmlFor="txt">Free text:</label>
        <input
          value={txt}
          onChange={handleChange}
          name="txt"
          id="txt"
          type="text"
          placeholder="By Text"
        />

        <label htmlFor="minSeverity">Min severity:</label>
        <input
          value={severity}
          onChange={handleChange}
          type="number"
          name="minSeverity"
          id="minSeverity"
          placeholder="By min Severity"
        />
      </div>

      <div>
        <h3>Labels:</h3>
        {availableLabels.map((label) => (
          <label key={label}>
            <input
              type="checkbox"
              name={label}
              checked={labels.includes(label)}
              onChange={handleLabelChange}
            />
            {label}
          </label>
        ))}
      </div>
      <div>
        <label htmlFor="sortBy">Sort by:</label>
        <select name="sortBy" value={sortBy} onChange={handleChange}>
          <option value="">Select Sorting</option>
          <option value="title">Title</option>
          <option value="severity">Severity</option>
          <option value="createdAt">Created At</option>
        </select>

        <label htmlFor="sortDir">Sort descending:</label>
        <input
          type="checkbox"
          name="sortDir"
          id="sortDir"
          checked={sortDir === -1}
          onChange={handleChange}
        />

        <button onClick={() => onGetPage(-1)}>-</button>
        <span>{filterByToEdit.pageIdx + 1}</span>
        <button onClick={() => onGetPage(1)}>+</button>
      </div>
    </section>
  );
}
