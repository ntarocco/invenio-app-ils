import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';
import isEmpty from 'lodash/isEmpty';
import { generatePath } from 'react-router-dom';

const documentRequestURL = '/document-requests/';
const apiPaths = {
  accept: `${documentRequestURL}:docReqPid/accept`,
  item: `${documentRequestURL}:docReqPid`,
  list: documentRequestURL,
  reject: `${documentRequestURL}:docReqPid/reject`,
};

const create = async data => {
  const response = await http.post(apiPaths.list, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const get = async docRequestPid => {
  const path = generatePath(apiPaths.item, { docReqPid: docRequestPid });
  const response = await http.get(path);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async docRequestPid => {
  const path = generatePath(apiPaths.item, { docReqPid: docRequestPid });
  const response = await http.delete(path);
  return response;
};

const performAction = async (urlPath, data) => {
  const response = await http.post(urlPath, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const accept = async (docRequestPid, data) => {
  const urlPath = generatePath(apiPaths.accept, { docReqPid: docRequestPid });
  return performAction(urlPath, data);
};

const reject = async (docRequestPid, data) => {
  const urlPath = generatePath(apiPaths.reject, { docReqPid: docRequestPid });
  return performAction(urlPath, data);
};

class QueryBuilder {
  constructor() {
    this.documentQuery = [];
    this.page = '';
    this.patronQuery = [];
    this.size = '';
    this.sortBy = '';
    this.stateQuery = [];
  }

  withState(state) {
    if (!state) {
      throw TypeError('State argument missing');
    }
    this.stateQuery.push(`state:"${prepareSumQuery(state)}"`);
    return this;
  }

  withDocPid(documentPid) {
    if (!documentPid) {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(`document_pid:${prepareSumQuery(documentPid)}`);
    return this;
  }

  withPatronPid(patronPid) {
    if (!patronPid || (typeof patronPid != 'number' && isEmpty(patronPid))) {
      throw TypeError('patronPid argument missing');
    }
    this.patronQuery.push(`patron_pid:${prepareSumQuery(patronPid)}`);
    return this;
  }

  withPage(page = 0) {
    if (page > 0) this.page = `&page=${page}`;
    return this;
  }

  withSize(size) {
    if (size > 0) this.size = `&size=${size}`;
    return this;
  }

  sortByNewest() {
    this.sortBy = `&sort=-mostrecent`;
    return this;
  }

  qs() {
    const searchCriteria = this.documentQuery
      .concat(this.patronQuery, this.stateQuery)
      .join(' AND ');
    return `(${searchCriteria})${this.sortBy}${this.size}${this.page}`;
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = query => {
  return http.get(`${documentRequestURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

const count = query => {
  return http.get(`${documentRequestURL}?q=${query}`).then(response => {
    response.data = response.data.hits.total;
    return response;
  });
};

export const documentRequest = {
  searchBaseURL: `${apiConfig.baseURL}${documentRequestURL}`,
  create: create,
  get: get,
  delete: del,
  list: list,
  accept: accept,
  reject: reject,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
