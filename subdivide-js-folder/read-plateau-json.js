import fetch from "node-fetch"; // Node 18+ supports fetch natively; for older versions install node-fetch

async function getPrefAndCity() {
  const url = 'https://api.plateauview.mlit.go.jp/datacatalog/plateau-datasets';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const results = [];
    const datasets = Array.isArray(data) ? data : data.datasets || [];

    datasets.forEach(item => {
      // Assuming each item has lod info and pref/city somewhere inside
      // Adjust property paths based on actual JSON structure

      // Check lod:
      // It might be at item.lod, item.properties.lod, or deeper
      const lod = item.lod
      const texture = item.texture

      if (lod === "2" && texture === false) {
        // Extract city and pref names (try several possible keys)
        const pref = item.pref
        const city = item.city
        const ward = item.ward

        if (pref && city) {
          results.push({ pref, city, ward });
        }
      }
    });

    return results;

  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

getPrefAndCity().then(results => {
  console.log('Prefectures and cities:', results);
});
