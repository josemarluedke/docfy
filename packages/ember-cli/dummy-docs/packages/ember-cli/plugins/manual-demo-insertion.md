---
category: ember
subcategory: plugins
manualDemoInsertion: true
---

# Manual Demo Insertion

Docfy will automatically insert demos for a page into the page at build time. However, this convenience comes at the cost of choosing where the demos should be rendered.

If you want control over where demos are rendered in a page, add `manualDemoInsertion: true` to your page's frontmatter. Then you can use `[[demo:name]]` or `[[demos-all]]` to mark where a specific demo or all demos should be rendered.

These markers must be on their own line!

## It works like this

Here is the tomster demo

[[demo:tomster]]

And here is the zoey demo

[[demo:zoey]]

## Or you can add all demos

[[demos-all]]

## Conclusion

With Docfy you get demos added to your pages for free, but with a little more work you can also get a bit more control.
