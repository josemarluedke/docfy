---
order: 4
category: components
title: <DocfyDemo>
---

# {{"<DocfyDemo>"}}


This component is used internally to render demos. It's not meant to be used directly,
although that's possible. The scope of what you want to understand is the CSS
classes such that you can style the parts of the demo component yourself.

Make sure to look at [writing demos](../writing-demos.md), so you can understand how demos look.

Below is an example of how styling could look like. It uses
[TailwindCSS](https://tailwindcss.com/) and [PostCSS Nested](https://github.com/postcss/postcss-nested).


```css
.docfy-demo__example {
  @apply p-4 border rounded-t;
}

.docfy-demo__description {
  @apply p-4 border-l border-r;

  &__header {
    @apply flex justify-between;

    &__title {
      @apply mb-4 font-medium leading-tight text-gray-900;
    }

    &__edit-url {
      @apply text-sm;
    }
  }

  &__content {
    @apply markdown;
  }
}
.docfy-demo__snippets {
  &__tabs {
    @apply px-2 border-l border-r;

    &__button {
      @apply p-2 mr-2 border-b-4;

      &--active,
      &:hover {
        @apply border-blue-500;
      }
    }
  }
}

.docfy-demo__snippet {
  pre {
    @apply p-4;
    @apply flex text-gray-200 bg-gray-800;
    @apply text-sm leading-normal;
    @apply font-mono;
    @apply rounded-b;
    scrollbar-width: none;
  }
}
```
