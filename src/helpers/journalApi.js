/* eslint-disable no-underscore-dangle */
import request from 'superagent';

const baseApi = 'http://localhost:8000/api/journals';

export function createEntry(entry, title) {
  return request
    .post(`${baseApi}/new`)
    .send({ entry, title })
    .then(res => res.body)
    .catch(error => error);
}

export function editEntry(id, title) {
  return request
    .put(`${baseApi}/${id}`)
    .send({ title })
    .then((res) => {
      console.log('RES', res);
      if (res.body.status === 'fail' || res.body.status === 'error') {
        throw res.body.data.message;
      }
      return res.body.data.entry;
    });
}

export function fetchEntries() {
  return request
    .get(baseApi)
    .then(res => res.body)
    .catch(error => error);
}
