import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,
    getLabels,
    getPageCount
}

const PAGE_SIZE = 3
var bugs = utilService.readJsonFile('./data/bug.json')

function query(filterBy) {
    var filteredBugs = bugs
    if (!filterBy) return Promise.resolve(filteredBugs)
    // Filtering by text
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }
    // Filtering by minimum severity
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    // Filtering by labels
    if (filterBy.labels?.length) {
        filteredBugs = filteredBugs.filter(bug => filterBy.labels.every(label => bug.labels.includes(label)))
    }

    // Sorting
    if (filterBy.sortBy) {
        if (filterBy.sortBy === 'title') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title) * filterBy.sortDir)
        } else if (filterBy.sortBy === 'severity') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => (bug1.severity - bug2.severity) * filterBy.sortDir)
        } else if (filterBy.sortBy === 'createdAt') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => (bug1.createdAt - bug2.createdAt) * filterBy.sortDir)
        }
    }

    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}


function getLabels() {
    return query().then(bugs => {
        const bugsLabels = bugs.reduce((acc, bug) => {
            return [...acc, ...bug.labels]
        }, [])
        return [...new Set(bugsLabels)]
    })
}


function getPageCount() {
    return query().then(bugs => {
        return Math.ceil(bugs.length / PAGE_SIZE)
    })
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}
