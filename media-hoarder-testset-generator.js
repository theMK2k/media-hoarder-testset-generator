/**
 * media-hoarder-testset-generator
 * 
 * Using the following top 5.000 lists to generate 10.000 0-byte "fake" .mkv files
 * https://www.imdb.com/list/ls063676189
 * https://www.imdb.com/list/ls063676660
 * 
 * use /?page=1 to /?page=50 to access all titles within a list
 * use the displayed title and year as well as the IMDB tconst as filename
 * 
 * entry identified by
 * 
 * <h3 class="lister-item-header">
        <span class="lister-item-index unbold text-primary">4.901.</span>
    
    <a href="/title/tt3477064/?ref_=ttls_li_tt"
>Recep Ivedik 4</a>
    <span class="lister-item-year text-muted unbold">(2014)</span>
 */

const util = require("util");

const sanitize = require("sanitize-filename");
const logger = require("loglevel");

logger.setLevel(0);

const helpers = require('./helpers');

(async () => {
  const listURLs = [
    'https://www.imdb.com/list/ls063676189',
    'https://www.imdb.com/list/ls063676660'
  ];

  for (let i = 0; i < listURLs.length; i++) {
    for (let j = 1; j <= 50; j++) {
      await generateFromURL(listURLs[i], j);
    }
  }
})();

async function generateFromURL(baseURL, page) {
  const url = `${baseURL}/?page=${page}`;

  logger.log('fetching', url);

  const options = {
    uri: url,
    method: 'GET',
    headers: {
      "Accept-Language": "en"
    }
  }

  const response = await helpers.requestAsync(options);

  if (!response) {
    logger.error('no content!');
    return;
  }

  const content = response.body;

  const rxEntries = /<h3 class=\"lister-item-header\"\>[\s\S]*?<a href=\"\/title\/(tt\d*?)\/[\s\S]*?>(.*?)<[\s\S]*?<span class="lister-item-year text-muted unbold">\((\d*?)\)/g;

  let match = null;

  while ((match = rxEntries.exec(content))) {
    const entry = {
      tconst: match[1],
      name: match[2],
      year: match[3]
    };

    helpers.ensureDirectorySync('./generated');

    const filename = sanitize(`${entry.name} (${entry.year}) [${entry.tconst}].mkv`);

    logger.log(`  ${filename}`);

    await helpers.writeFileAsync(`./generated/${filename}`, '');
  }
}