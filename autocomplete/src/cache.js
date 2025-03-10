export class Cache {
  constructor() {
    this.clear();
  }

  generateId(item) {
    return `fruit_${item.toLowerCase().replace(/\s+/g, "_")}`;
  }

  addResults(query, items) {
    const resultIds = items.map((item, index) => {
      const id = this.generateId(item);
      this.resultsById[id] = {
        id,
        text: item,
        type: "fruit",
      };
      return id;
    });
    this.queryCache[query.toLowerCase()] = resultIds;
  }

  getResults(query) {
    const resultIds = this.queryCache[query.toLowerCase()];
    if (!resultIds) return null;
    return resultIds.map((id) => this.resultsById[id].text);
  }

  hasQuery(query) {
    return query.toLowerCase() in this.queryCache;
  }

  clear() {
    this.resultsById = {};
    this.queryCache = {};
  }
}
