const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    remove,
    save,
    getDefaultFilter,
    downloadPdf,
    getLabels,
    getPageCount
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + `/${bugId}`)
        .then(res => res.data)
        .catch(err => {
            console.log('err', err)
            throw err
        })
}

function remove(bugId) {
    return axios.delete(BASE_URL + `/${bugId}`)
        .then(res => res.data)
}

function save(bug) {

    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug)
        .then(res => res.data)


    // if (bug._id) {
    //     return axios.put(BASE_URL, bug)
    //         .then(res => res.data)
    // } else {
    //     return axios.post(BASE_URL, bug)
    //         .then(res => res.data)
    // }
}

function getLabels() {
    return axios.get(BASE_URL + '/labels').then(res => res.data)
}

function getPageCount() {
    return axios.get(BASE_URL + '/pageCount').then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, pageIdx: 0, sortBy: '', sortDir: 1, labels: [] }
}

function downloadPdf() {
    return axios.get(BASE_URL + '/download')
        .then(res => res.data)
}

