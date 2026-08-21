# radiosnack.ca

## Developing

1. Install dependencies with `npm install`
2. Serve the site with `npx @11ty/eleventy --serve`
3. Open http://localhost:8080/

## Adding a new page to the site

* You can use `en/space.md` and `fr/space.md` as a template (don't forget to add a French translation!)
* Add the page to the nav in [base.njk here](https://github.com/RadioSnackTech/radiosnacktech.github.io/blob/0ead119d06fda0e5426c63c58f6bd84d6370303a/_includes/base.njk#L20-L29) 
* Edit [this section](https://github.com/RadioSnackTech/radiosnacktech.github.io/blob/0ead119d06fda0e5426c63c58f6bd84d6370303a/_data/translations.js#L14-L23)  and [this section](https://github.com/RadioSnackTech/radiosnacktech.github.io/blob/0ead119d06fda0e5426c63c58f6bd84d6370303a/_data/translations.js#L37-L46) of `_data/translations.js` with the English/French titles of the nav entries
