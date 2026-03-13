import https from 'https';

https.get('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson', { headers: { 'Accept-Encoding': 'identity' } }, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const geo = JSON.parse(data);
    const my = geo.features.find(f => {
      const p = f.properties;
      return p.ADMIN === 'Malaysia' || p.NAME === 'Malaysia' || p.ISO_A3 === 'MYS' || p.name === 'Malaysia';
    });
    if (!my) {
      // Debug: show all property keys of first feature and any matching names
      const sample = geo.features[0]?.properties;
      console.log('Keys:', Object.keys(sample || {}));
      const matches = geo.features.filter(f => JSON.stringify(f.properties).includes('alaysia'));
      console.log('Matches:', matches.map(f => f.properties));
      return;
    }

    const coords = my.geometry.coordinates;
    console.log('Type:', my.geometry.type, '| Polygons:', coords.length);

    // Bounding box
    const all = coords.flat(2);
    const minLon = Math.min(...all.map(p => p[0]));
    const maxLon = Math.max(...all.map(p => p[0]));
    const minLat = Math.min(...all.map(p => p[1]));
    const maxLat = Math.max(...all.map(p => p[1]));
    const pad = 0.3;
    const l = minLon - pad, r = maxLon + pad, b = minLat - pad, t = maxLat + pad;
    const w = 1000, h = Math.round(w * (t - b) / (r - l));

    function toPath(ring) {
      return ring.map((p, i) => {
        const x = ((p[0] - l) / (r - l) * w).toFixed(1);
        const y = ((t - p[1]) / (t - b) * h).toFixed(1);
        return (i === 0 ? 'M' : 'L') + x + ' ' + y;
      }).join(' ') + 'Z';
    }

    console.log(`viewBox="0 0 ${w} ${h}"`);
    coords.forEach((poly, i) => {
      poly.forEach((ring, j) => {
        console.log(`\n<!-- Polygon ${i} ring ${j} (${ring.length} pts) -->`);
        console.log(`<path d="${toPath(ring)}" fill="#0A0A0F" />`);
      });
    });
  });
});
