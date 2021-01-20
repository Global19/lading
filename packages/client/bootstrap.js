import querystring from "querystring";

export function bootstrap(server, app) {
  const search = querystring.parse(location.search.slice(1));

  let manifestUrl = `${server}/m/${app}`;
  let override = {};

  if (search.ring) {
    manifestUrl = `${manifestUrl}/${search.ring}`;
  }

  if (search.override) {
    try {
      override = JSON.parse(search.override);
    } catch (e) {
      console.warn("invalid override");
    }
  }

  return fetch(manifestUrl)
    .then((res) => res.json())
    .then((manifest) => {
      if (!manifest.packages) {
        throw new Error(
          `Fetched manifest is not of the correct format. ${manifest}`
        );
      }

      let formattedManifest = {};

      for (const packageInfo of manifest.packages) {
        formattedManifest[packageInfo["package"]] = packageInfo.url;
      }

      if (override) {
        formattedManifest = { ...formattedManifest, ...override };
      }

      window.__LADING_MANIFEST__ = formattedManifest;
    });
}