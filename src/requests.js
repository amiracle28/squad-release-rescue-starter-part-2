export function buildDashboard(records) {
  const seenIds = new Set();
  const requests = records
    .filter((record) => {
      if (seenIds.has(record.id)) return false;
      seenIds.add(record.id);
      return true;
    })
    .map((record) => ({ ...record }));

  return {
    requests,
    summary: {
      total: requests.length,
      open: requests.filter((request) => request.status === "Open").length,
      inProgress: requests.filter((request) => request.status === "In progress").length,
      done: requests.filter((request) => request.status === "Done").length
    }
  };
}
