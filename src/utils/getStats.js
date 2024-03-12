const getStats = async () => {
  try {
    const response = await fetch(
      `/api/getstat`,
      { cache: 'no-cache' }
    );
    const jsonData = await response.json();
    return jsonData;
  } catch {
    return null;
  }
};

export default getStats;
