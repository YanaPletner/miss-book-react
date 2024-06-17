import { utilService } from './util.service.js'

const BASE_URL = '/api/bug'

export const bugService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    onDownloadPdf,
}

function query(filterBy = {}) {
    const { txt, minSeverity } = filterBy
    return axios.get(`${BASE_URL}?minSeverity=${minSeverity}&txt=${txt}`)
        .then(res => res.data)
    //         .then(bugs => {
    //             if (filterBy.txt) {
    //                 const regExp = new RegExp(filterBy.txt, 'i')
    //                 bugs = bugs.filter(bug => regExp.test(bug.vendor))
    //             }
    //             if (filterBy.minSeverity) {
    //                 bugs = bugs.filter(bug => bug.speed >= filterBy.minSpeed)
    //             }
    //             return bugs
    //         })
}

function get(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + '/' + bugId + '/remove')
        .then(res => res.data)
}

function save(bug) {
    const { _id, title, description, severity, createdAt } = bug
    if (bug._id) {
        const queryStr = `/save?_id=${_id}&title=${title}&description=${description}&severity=${severity}&createdAt=${createdAt}`
        return axios.get(BASE_URL + queryStr)
            .then(res => res.data)
    } else {
        const queryStr = `/save?title=${title}&description=${description}&severity=${severity}&createdAt=${createdAt}`
        return axios.get(BASE_URL + queryStr)
            .then(res => res.data)
    }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '' }
}


function onDownloadPdf() {
    console.log('inDownload')
    return axios.get(`${BASE_URL}/download`).then(res => res.data)
}
