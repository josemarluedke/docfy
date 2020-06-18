---
order: 3
category: components
title: <DocfyPreviousAndNextPage>
---

# {{"<DocfyPreviousAndNextPage>"}}

This component yields the previous and next page (`PageMetadata`) if it exists.
The component accepts a single argument called `scope`. It is used to narrow the
pages that it can link as previous and next.

Scoping the pages is useful if you are building different sections of your docs site;
for example, one section is "Documentation", and another is "Tutorials". This feature
would prevent linking to a page in tutorials from a documentation page.

# API

| Argument       | Description                    | Type                    | Default Value |
|----------------|--------------------------------|-------------------------|---------------|
| `@scope`       | Filter links by a scope name   | `string` \| `undefined` |               |
