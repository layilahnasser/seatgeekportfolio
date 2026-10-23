# Layilah Campbell: UX research and design portfolio (ticket-marketplace edition)

The front page follows a ticket marketplace's home page: a dark hero ("Front-row seats to Layilah's projects."), a search-or-ask bar with suggestion chips that show short answers written from the case studies, and a Featured projects carousel with save hearts. The Projects page (`projects.html`) works like an event page: filter chips, listings with key numbers, and a venue-style map with a pin for each project.

Visual style inspired by SeatGeek's app. It uses no SeatGeek logos or assets and is not affiliated with SeatGeek.

A white, calm version of the portfolio: a short intro, a large lead project, a grid of case studies with cover images, and a closing about strip. Case studies keep the same frame-by-frame structure.

A static portfolio site with five case studies, an About page, a Resume page, and a Contact page. It is plain HTML, CSS, and JavaScript, so there is nothing to install and no build step.

## View it on your computer
1. Unzip or clone the folder.
2. Double-click **`index.html`**.

## Publish it with GitHub Pages
1. Push the files to the root of the repository (the `main` branch).
2. In **Settings → Pages**, choose **Deploy from a branch**, select **main** and the **/ (root)** folder, and save.
3. The site appears at `https://layilahnasser.github.io/seatgreekportfolio-/` after a minute or two.

If the live address is different, update the `og:image` links in the six `.html` files so link previews show the share image.

## Where things live
```
index.html, about.html, work.html, resume.html, contact.html   Pages
project.html                                                   One case-study template: project.html?p=<project id>
js/data.js     All of the text content: projects, About, resume
js/pages.js    Builds each page from data.js
js/main.js     Shared pieces: navigation, logo, profile card, image lightbox, footer
css/styles.css All of the styling
assets/img     Screenshots and photos
assets/fonts   Manrope and Newsreader (SIL Open Font License)
assets/resume.pdf  The downloadable resume
```

## Editing content
Edit **`js/data.js`**. Each case study is a block with the same sections (problem, research, ideation, iteration, final design, outcome). Any text that still starts with `TODO:` shows with a dashed outline so it is easy to find.

To add an image, save it in `assets/img/` and reference it from `data.js`. Every image needs a caption or an `alt` description for screen readers.

## Accessibility
Every page is checked with axe-core with no violations. The site works with a keyboard, has a skip link and visible focus, describes every image, respects reduced-motion settings, and works down to 320 px wide.
