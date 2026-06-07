# turnodo.com

Personal portfolio site for [Murali Krishna Chanda](https://turnodo.com) — static HTML/CSS/JS hosted on GitHub Pages with a custom domain.

## Local preview

Open `index.html` in a browser, or serve the folder locally:

```bash
npx serve .
```

## Deploy

Push to the `main` branch on [github.com/muralichanda/turnodo](https://github.com/muralichanda/turnodo). GitHub Pages serves the site; `CNAME` points the custom domain to `turnodo.com`.

## Updating content

- **Page copy:** edit `index.html`
- **Terminal responses & contact URLs:** edit `js/site-content.js`
- **Styles:** edit `css/style.css`
- **Behavior:** edit `js/script.js`
- **Resume download:** add your PDF as `assets/resume.pdf`

## Contact form

The contact form opens the visitor's email client with a pre-filled message to `muralichanda@gmail.com`. For server-side delivery, replace the handler in `js/script.js` with a service such as Formspree or Web3Forms.
