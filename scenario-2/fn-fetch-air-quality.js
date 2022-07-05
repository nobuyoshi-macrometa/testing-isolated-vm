function getAirQualitySummary() {
  const location = "shanghai";
  const token = "f96e87a838ca30b6f81535a13fc224951260b810";

  let endpoint = `https://api.waqi.info/feed/${location}?token=${token}`;

  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };

  // const response = await fetch(endpoint, init);
  // const content = await response.json();

  const content = myFetch(endpoint, init);

  let html_content = "<h1>Weather 🌦</h1>";
  html_content += `<p>This is a demo using Workers geolocation data. </p>`;
  html_content += `You are located at: ${location}.</p>`;
  html_content += `<p>Based off sensor data from <a href="${content.data.city.url}">${content.data.city.name}</a>:</p>`;
  html_content += `<p>The AQI level is: ${content.data.aqi}.</p>`;
  html_content += `<p>The N02 level is: ${content.data.iaqi.no2.v}.</p>`;
  html_content += `<p>The O3 level is: ${content.data.iaqi.o3.v}.</p>`;
  html_content += `<p>The temperature is: ${content.data.iaqi.t.v}°C.</p>`;

  const html_style = `body{padding:6em; font-family: sans-serif;} h1{color:#f6821f}`;

  let html = `
  <!DOCTYPE html>
  <head>
    <title>Geolocation: Weather</title>
  </head>
  <body>
    <style>${html_style}</style>
    <div id="container">
    ${html_content}
    </div>
  </body>`;

  // log(html);

  return html;
}

getAirQualitySummary();
