---
order: 1
title: Getting Started
---

# Getting Started with Ember

Let's get started by creating a new Ember app and adding Docfy to it. For adding
to existing apps, jump to the step after creating the app.


## Generate the App

There isn't anything special here; just create the ember app and remove the
`<WelcomePage />` from `application.hbs`.

```
ember new docfy-example
cd docfy-example
```

## Add Docfy dependency

```
yarn add -D @docfy/ember
// or
npm install --dev @docfy/ember
```

## Add Docfy Routes

Docfy has a function that adds all the routes to your Ember app. It understands
the output of Docfy Core and process all the page URLs to add their paths to the Ember app.

In your `app/router.js` import `import { addDocfyRoutes } from '@docfy/ember';`
then add `addDocfyRoutes(this)` to the Router Map. The final result looks like the following:

```js
import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { addDocfyRoutes } from '@docfy/ember';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  addDocfyRoutes(this)
});
```

## Add Markdown Files

Let's add some markdown files so that we can see it in our app.

Create a folder named `docs` in the root of your app then place the following content to `index.md`.

```md
# Hello from my docs site using Docfy

**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when
an unknown printer took a galley of type and scrambled it to make a type specimen book
```

Let's add another file called `installation.md`.

```md
# Installation

Follow the steps below to install my app:

1. `yarn install`
2. `yarn start`
3. Done.
```

## Start the Server

You can now start the Ember server and visit the docs page.

```sh
ember serve
```

The server will be running on port `4200`, and the docs path will be `/docs`.
Here is the full URL: [http://localhost:4200/docs](http://localhost:4200/docs).

To visit the second document we created earlier, you can access
[http://localhost:4200/docs/installation](http://localhost:4200/docs/installation).

That's it, you now have a full working app with Docfy generating pages from
markdown files.

## Add a Sidebar

Docfy provides several low-level components that help you build the documentation site.
Docfy does not offer any styles by default; our philosophy is to provide all the
pieces for you to develop your docs site with your styles. This approach is perfect
for building design systems that use the styles from your design in your docs.

We can add a `docs` template that will be used when rendering any documentation
page because of Ember's routing and templating patterns.

In your `app/templates/docs.hbs` add the following:

```hbs
<DocfyOutput @scope="docs" as |node|>
  <ul>
    {{#each node.pages as |page|}}
      <li>
        <DocfyLink @to={{page.url}}>
          {{page.title}}
        </DocfyLink>
      </li>
    {{/each}}
  </ul>
</DocfyOutput>

<div>
  {{outlet}}
</div>
```

This example uses two components, `DocfyOutput` and `DocfyLink`. It is also
the simplest navigation component we can build, ignoring any nested sections
you might define. You can learn more about these components and their capabilities
in their respective documentation page.


## Add Previous and Next Page Links

Documentation sites usually have a previous and next page link. Docfy provides a component that gives you the ability to add this feature.

At the end of the `docs.hbs` file, add the following:

```hbs
<DocfyPreviousAndNextPage as |previous next|>
  <div>
    {{#if previous}}
      Previous:

      <DocfyLink @to={{previous.url}}>
        {{previous.title}}
      </DocfyLink>
    {{/if}}
  </div>
  <div>
    {{#if next}}
      Next:

      <DocfyLink @to={{next.url}}>
        {{next.title}}
      </DocfyLink>
    {{/if}}
  </div>
</DocfyPreviousAndNextPage>
```

## Other Features

Docfy has other abilities that we haven't covered here. For example, we can build
a section that displays "on this page", which lists all the headings in the document.
Another example is adding a link to edit the markdown file on GitHub. Another
useful feature is the ability to demo components out of markdown files. These
features are covered throughout the docs.
