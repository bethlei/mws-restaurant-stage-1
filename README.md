# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 3

In **Stage Three**, you take the connected application you built in **Stage One** and **Stage Two** and add additional functionalities. You add a toggle to enable users to mark a restaurant as a favorite. This toggle is visible in the application. You add a form to enable users to create their reviews. If the app is offline, the form defers updating to the remote database until the connection is back online. Finally, you work to optimize your site to meet even stricter performance benchmarks than Stage Two and test again using [Lighthouse](https://developers.google.com/web/tools/lighthouse/). You need to measure your site performance against the new targets below.

* Progressive Web App score should be at 90 or better.
* Performance score should be at 90 or better.
* Accessibility score should be at 90 or better.

## To get started

* Install and start the Node API server
    - Follow the README on Udacity's [mws-restaurant-stage-3](https://github.com/udacity/mws-restaurant-stage-3) to spin up the API server
* Install and start the app
    - Spin up the app with `python3 -m http.server 8000` for Python 3 or `python -m SimpleHTTPServer 8000` for Python 2
    - Visit the site at `http://localhost:8000`

## Project Overview: Stage 2

In **Stage Two**, you take the responsive, accessible design you built in Stage One and connect it to an external Node server. You begin by using asynchronous JavaScript to request JSON data from the server. You store data received from the server in an offline database using IndexedDB, which create an app shell architecture. Finally, you work to optimize your site to meet performance benchmarks, which you’ll test using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

* Progressive Web App score should be at 90 or better.
* Performance score should be at 70 or better.
* Accessibility score should be at 90 or better.

## To get started

* Install and start the Node API server
    - Follow the README on Udacity's [mws-restaurant-stage-2](https://github.com/udacity/mws-restaurant-stage-2) to spin up the API server
* Install and start the app
    - Spin up the app with `python3 -m http.server 8000` for Python 3 or `python -m SimpleHTTPServer 8000` for Python 2
    - Visit the site at `http://localhost:8000`

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, you incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You also add a service worker to begin the process of creating a seamless offline experience for your users.

### Specification

You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality. 

### What do I do from here?

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. 

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.
3. Explore the provided code, and make start making a plan to implement the required features in three areas: responsive design, accessibility and offline use.
4. Write code to implement the updates to get this site on its way to being a mobile-ready website.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 



