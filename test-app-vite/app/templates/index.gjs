import { pageTitle } from 'ember-page-title';
import { DocfyLink } from '@docfy/ember';
import FeatureCard from '../components/feature-card';

<template>
  {{pageTitle "Home"}}

  <div
    class="px-4 py-12 overflow-hidden bg-gray-900 md:text-center md:pt-32 md:pb-40 angled"
  >
    <div class="relative max-w-256 md:mx-auto">
      <div
        class="absolute w-56 h-56 -bottom-32 -right-24 md:h-full bg-dot-lg md:-top-8 md:-left-8"
      ></div>
      <div class="absolute -top-16 right-6 md:-right-2 md:-top-16">
        <div class="w-20 h-20 bg-dot-brighter-lg"></div>
        <div
          class="absolute w-20 h-20 bg-dot-brighter-lg"
          style="top: 3.4rem; left: 3.4rem;"
        >
        </div>
      </div>

      <h2 class="mb-10 text-4xl md:mb-16 md:mx-auto md:text-5xl max-w-256">
        <span class="text-white">
          Build fully personalized documentation
          <br class="hidden lg:block" />
          sites;
        </span>
        <span class="text-green-500">
          write content and demos in Markdown.
        </span>
      </h2>
      <p class="text-gray-400 max-w-200 md:mx-auto">
        Docfy is a modular JavaScript tool to help build documentation sites.
        Its core has all the essential features to help you create a
        full-featured docs app while writing all your content in Markdown.
      </p>

      <DocfyLink
        @to="/docs"
        class="inline-flex items-center px-6 py-3 mt-10 font-semibold text-black bg-green-500 rounded hover:bg-green-400"
      >
        Read the Docs

        <svg
          class="w-4 ml-2"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.25647 0.256191C7.42056 0.0921521 7.64308 0 7.8751 0C8.10713 0 8.32965 0.0921521 8.49374 0.256191L13.7438 5.50626C13.9078 5.67035 14 5.89287 14 6.12489C14 6.35692 13.9078 6.57944 13.7438 6.74353L8.49374 11.9936C8.32871 12.153 8.10768 12.2412 7.87825 12.2392C7.64883 12.2372 7.42937 12.1452 7.26713 11.9829C7.1049 11.8207 7.01287 11.6012 7.01088 11.3718C7.00889 11.1424 7.09708 10.9214 7.25647 10.7563L11.0129 6.99991H0.875012C0.642944 6.99991 0.420381 6.90772 0.256285 6.74362C0.0921884 6.57952 0 6.35696 0 6.12489C0 5.89283 0.0921884 5.67026 0.256285 5.50617C0.420381 5.34207 0.642944 5.24988 0.875012 5.24988H11.0129L7.25647 1.49346C7.09243 1.32937 7.00028 1.10685 7.00028 0.874825C7.00028 0.642803 7.09243 0.42028 7.25647 0.256191Z"
            fill="black"
          />
        </svg>
      </DocfyLink>
    </div>
  </div>

  <div
    class="px-4 py-16 overflow-hidden bg-gray-700 md:pb-24 md:pt-48 md:-mt-32"
  >
    <div class="relative z-0 mx-auto max-w-screen-lg">
      <div class="relative z-10 bg-gray-700">
        <h3 class="pb-6 text-3xl font-semibold text-gray-200 md:text-center">
          Use any framework or library
        </h3>
        <p
          class="pb-16 text-xl font-semibold leading-snug text-gray-400 md:text-center max-w-200 md:mx-auto"
        >
          The core package is framework agnostic so that we can have
          integrations with projects like Ember, React, Vue, Glimmer, Express
          and others.
        </p>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16"
        >
          <FeatureCard @title="Markdown processing">
            We will process all your markdown content using
            <a
              class="underline"
              href="https://remark.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >remark</a>. You can extend and modify the output by using their
            vast selection of plugins.
          </FeatureCard>
          <FeatureCard @title="Multi-location source files">
            Write your documentation next to your packages in a monorepo project
            by specifying multiple source locations of markdown files.
          </FeatureCard>
          <FeatureCard @title="Demos">
            We combine "demo" markdown files into a data structure representing
            a page; You can turn these demos into executable code.
            <DocfyLink
              @to="/docs/writing-markdown"
              @anchor="demos"
              class="underline"
            >
              Learn more here.
            </DocfyLink>
          </FeatureCard>
          <FeatureCard @title="Plugin system">
            You can extend and change what Docfy can do by writing plugins or
            using plugins from the community.
          </FeatureCard>
          <FeatureCard @title="Correct links between files">
            Link to other documents by using their file location, we will find
            these links and modify them to use the exact URL of that file.
          </FeatureCard>
          <FeatureCard @title="Table of Content per page">
            We will process and expose all the headings present on a given page.
            This feature is perfect for building an "on this page" section.
          </FeatureCard>
        </div>
      </div>
      <div class="absolute z-0 w-full h-full top-32 bg-dot-lg -right-32"></div>
    </div>
  </div>

  <div class="px-4 py-16 overflow-hidden bg-gray-900 md:py-24">
    <div class="relative mx-auto max-w-screen-lg">
      <div
        class="absolute w-2/3 h-20 mt-2 ml-1 -left-32 -top-24 bg-dot-lg"
      ></div>

      <h3 class="pb-6 text-3xl font-semibold text-gray-200 md:text-center">
        <svg
          class="mx-auto"
          width="238"
          height="114"
          viewBox="0 0 238 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M232.302 62.5289C232.302 62.5289 226.553 66.9692 221.492 66.4733C216.433 65.9774 218.022 54.7142 218.022 54.7142C218.022 54.7142 219.112 44.3829 216.13 43.5137C213.159 42.653 209.491 46.2069 209.491 46.2069C209.491 46.2069 204.929 51.2486 202.747 57.6753L202.145 57.872C202.145 57.872 202.842 46.6002 202.05 44.0324C201.457 42.7499 196 42.8496 195.108 45.1182C194.213 47.3954 189.849 63.2043 189.548 69.8277C189.548 69.8277 181.017 77.0468 173.585 78.2267C166.144 79.418 164.357 74.7696 164.357 74.7696C164.357 74.7696 184.593 69.138 183.896 53.027C183.208 36.9188 167.58 42.881 165.814 44.2005C164.102 45.483 154.969 50.9693 152.305 66.1683C152.216 66.6785 152.056 68.9414 152.056 68.9414C152.056 68.9414 144.219 74.1711 139.855 75.5562C139.855 75.5562 152.056 55.0989 137.182 45.8108C132.999 43.3028 129.354 45.6113 127.183 47.7317C125.853 49.0313 145.214 27.9299 140.747 9.04579C138.625 0.059737 134.114 -0.903562 129.976 0.552787C123.694 3.02089 121.314 6.67459 121.314 6.67459C121.314 6.67459 113.176 18.4394 111.286 35.9327C109.402 53.4203 106.627 74.573 106.627 74.573C106.627 74.573 102.755 78.3293 99.1884 78.5259C95.6126 78.7169 97.2012 67.9467 97.2012 67.9467C97.2012 67.9467 99.9769 51.545 99.7877 48.7748C99.5812 46.0103 99.3862 44.5283 96.1116 43.5422C92.8369 42.5504 89.264 46.7028 89.264 46.7028C89.264 46.7028 79.8473 60.93 79.0559 63.1046L78.5512 63.9995L78.0608 63.401C78.0608 63.401 84.7019 44.0324 78.3591 43.7388C72.0105 43.4396 67.844 50.6558 67.844 50.6558C67.844 50.6558 60.6008 62.717 60.3026 64.0964L59.8123 63.5036C59.8123 63.5036 62.783 49.473 62.1923 46.0074C61.5901 42.5504 58.324 43.2429 58.324 43.2429C58.324 43.2429 54.1576 42.747 53.0651 45.4175C51.9755 48.0879 48.0069 65.7722 47.508 71.4066C47.508 71.4066 37.0962 78.8166 30.2458 78.9135C23.4069 79.0161 24.1037 74.5958 24.1037 74.5958C24.1037 74.5958 49.1998 66.0372 42.3522 49.1396C39.2783 44.7905 35.7112 43.4253 30.653 43.5194C25.589 43.622 19.315 46.6943 15.2489 55.7858C13.3019 60.1178 12.5994 64.2417 12.1951 67.3482C12.1951 67.3482 7.80784 68.246 5.42784 66.2709C3.0421 64.293 1.82056 66.2709 1.82056 66.2709C1.82056 66.2709 -2.26558 71.4636 1.80049 73.0397C5.8723 74.6243 12.2151 75.3596 12.2151 75.3596C13.1793 79.8458 15.7503 83.8312 19.4498 86.5743C26.888 92.2059 41.1622 86.0556 41.1622 86.0556L47.0119 82.7867C47.0119 82.7867 47.2126 88.1361 51.4794 88.9142C55.7433 89.6979 57.5298 88.9028 64.968 70.9164C69.3351 61.7252 69.6333 62.2211 69.6333 62.2211C70.1237 62.1185 66.7573 79.7087 68.0448 84.4511C69.3351 89.202 74.9869 88.7061 74.9869 88.7061C74.9869 88.7061 78.0637 89.2961 80.5441 80.5979C83.0216 71.9025 87.7873 62.3151 87.7873 62.3151C88.3751 62.3151 86.2962 80.2986 89.4648 86.0357C92.6419 91.7699 100.874 87.9594 100.874 87.9594C100.874 87.9594 106.629 85.0724 107.524 84.1803C107.524 84.1803 114.349 89.9744 123.978 88.9227C145.509 84.699 153.168 78.9933 153.168 78.9933C153.168 78.9933 156.868 88.3328 168.326 89.202C181.413 90.1853 188.562 81.9858 188.562 81.9858C188.562 81.9858 188.458 87.3182 193.021 89.202C197.591 91.0773 200.659 80.5181 200.659 80.5181L208.296 59.5506C208.992 59.5506 209.385 73.185 216.93 75.3596C224.465 77.5341 234.286 70.2666 234.286 70.2666C234.286 70.2666 236.666 68.9613 236.271 65.0084C235.869 61.0526 232.302 62.5289 232.302 62.5289ZM33.6265 52.6337C36.299 55.2015 35.3097 60.7334 30.2515 64.1904C25.199 67.656 22.9108 66.9635 22.9108 66.9635C23.2119 55.2015 30.9541 50.0573 33.6265 52.6337ZM132.319 12.0155C134.005 20.9103 117.543 47.3954 117.543 47.3954C117.738 41.4645 123.588 21.4034 123.588 21.4034C123.588 21.4034 130.624 3.12064 132.316 12.0126L132.319 12.0155ZM116.049 79.5149C116.049 79.5149 114.759 75.1658 118.429 63.0134C122.105 50.8553 130.731 55.5977 130.731 55.5977C130.731 55.5977 136.683 60.1434 132.021 72.2987C127.361 84.4539 116.049 79.5149 116.049 79.5149ZM166.241 55.7003C170.304 48.2903 173.482 52.3373 173.482 52.3373C173.482 52.3373 176.951 56.0936 172.986 61.728C169.014 67.3596 163.265 66.9663 163.265 66.9663C163.265 66.9663 162.175 63.1074 166.241 55.7003Z"
            fill="#E04E39"
          />
          <path
            d="M206.839 85.6909V84.2716H207.742C207.869 84.2716 207.992 84.2859 208.124 84.3001C208.256 84.3172 208.382 84.3514 208.488 84.397C208.6 84.4426 208.686 84.5082 208.752 84.5937C208.824 84.6792 208.855 84.796 208.855 84.9414C208.855 85.2691 208.758 85.4829 208.56 85.5684C208.315 85.6598 208.055 85.7014 207.794 85.6909H206.839ZM205.764 83.4394V88.8373H206.839V86.5317H207.51L208.829 88.8402H209.959L208.508 86.4804C208.698 86.4614 208.886 86.4212 209.067 86.3607C209.239 86.3037 209.391 86.2182 209.515 86.1042C209.647 85.993 209.744 85.8477 209.819 85.671C209.901 85.4685 209.94 85.251 209.933 85.0326C209.933 84.4483 209.747 84.0351 209.383 83.7985C209.016 83.5563 208.488 83.4366 207.806 83.4366H205.764V83.4394ZM204.043 86.1441C204.043 85.5912 204.135 85.0867 204.327 84.625C204.517 84.169 204.775 83.77 205.102 83.4366C205.436 83.0918 205.838 82.8188 206.283 82.6345C206.728 82.4502 207.206 82.3585 207.688 82.365C208.169 82.3609 208.645 82.4538 209.089 82.638C209.532 82.8222 209.934 83.0938 210.269 83.4366C210.972 84.1631 211.357 85.1363 211.341 86.1441C211.341 86.697 211.244 87.2014 211.054 87.6688C210.87 88.1147 210.604 88.5226 210.269 88.8715C209.935 89.2166 209.534 89.4903 209.091 89.6755C208.647 89.8608 208.169 89.9538 207.688 89.9488C207.18 89.9488 206.707 89.8548 206.257 89.6638C205.822 89.4809 205.43 89.2112 205.104 88.8715C204.77 88.5238 204.506 88.1155 204.327 87.6688C204.132 87.1841 204.035 86.6661 204.041 86.1441H204.043ZM202.716 86.1441C202.716 86.8851 202.856 87.5491 203.126 88.1391C203.404 88.7376 203.765 89.2449 204.221 89.6667C204.68 90.0856 205.211 90.4077 205.81 90.63C206.412 90.8551 207.037 90.9663 207.688 90.9663C208.348 90.9663 208.975 90.8523 209.575 90.63C210.177 90.4077 210.702 90.0885 211.163 89.6667C211.622 89.2449 211.983 88.7404 212.259 88.1419C212.528 87.5491 212.66 86.8879 212.66 86.1441C212.66 85.4145 212.528 84.7504 212.259 84.1605C212.002 83.5886 211.632 83.074 211.171 82.6471C210.71 82.2201 210.167 81.8897 209.575 81.6753C208.973 81.4473 208.348 81.3333 207.688 81.3333C206.408 81.3289 205.172 81.7959 204.218 82.6443C203.735 83.0903 203.351 83.6324 203.093 84.2353C202.834 84.8383 202.705 85.4886 202.716 86.1441Z"
            fill="#E04E39"
          />
        </svg>
      </h3>
      <p
        class="pb-16 text-xl font-semibold leading-snug text-gray-500 md:text-center max-w-200 md:mx-auto"
      >
        Use the official Docfy integration with Ember to run your docs as an
        Ember app. Perfect for writing docs for design systems, UI libraries,
        and addons.
      </p>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16"
      >
        <FeatureCard @title="Demos" @icon="#E04E39">
          Write demos of your components in a single markdown file. We will
          extract and make them executable.
        </FeatureCard>
        <FeatureCard @title="Preview templates" @icon="#E04E39">
          Write an HBS code block and have it rendered with the source code next
          to it.
        </FeatureCard>
        <FeatureCard @title="Built-in Components" @icon="#E04E39">
          Use the integrated components to get data out of the processed
          markdown files, pages, and much more.
        </FeatureCard>
        <FeatureCard @title="Write HBS in Markdown" @icon="#E04E39">
          Similarly to HTML in Markdown, you can have Handlebars code anywhere
          in the Markdown.
        </FeatureCard>
        <FeatureCard @title="SSR" @icon="#E04E39">
          You can write your app to be Server Side Rendered, Docfy works in
          FastBoot without any issues.
        </FeatureCard>
        <FeatureCard @title="Prember integration" @icon="#E04E39">
          You can pre-render all your documentation pages using prember. Docfy
          will inform prember about all the URLs it has.
        </FeatureCard>
      </div>
    </div>
  </div>

  <div class="px-4 py-16 overflow-hidden bg-blue-900 md:py-24">
    <div class="relative mx-auto max-w-screen-lg">
      <div
        class="absolute w-2/3 h-20 mt-2 ml-1 -left-32 -top-24 bg-dot-lg"
      ></div>

      <h3 class="pb-6 text-3xl font-semibold text-blue-100 md:text-center">
        <span class="text-blue-300">⚡</span>
        Powered by Vite
      </h3>
      <p
        class="pb-16 text-xl font-semibold leading-snug text-blue-300 md:text-center max-w-200 md:mx-auto"
      >
        This documentation site showcases @docfy/ember-vite - enjoy
        lightning-fast development with modern tooling and instant live reload.
      </p>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16"
      >
        <FeatureCard @title="Lightning Fast Live Reload" @icon="#646CFF">
          Changes to your markdown files are instantly reflected in the browser
          with automatic page refresh.
        </FeatureCard>
        <FeatureCard @title="ESM-Native Development" @icon="#646CFF">
          No bundling during development means faster startup times and instant
          file serving.
        </FeatureCard>
        <FeatureCard @title="Modern Build Pipeline" @icon="#646CFF">
          Optimized production builds with tree-shaking, code splitting, and
          advanced compression.
        </FeatureCard>
        <FeatureCard @title="TypeScript Ready" @icon="#646CFF">
          First-class TypeScript support with instant compilation and type
          checking.
        </FeatureCard>
        <FeatureCard @title="Flexible Configuration" @icon="#646CFF">
          Configure Docfy through vite.config.js or dedicated config files with
          full IntelliSense support.
        </FeatureCard>
        <FeatureCard @title="Embroider Compatible" @icon="#646CFF">
          Seamlessly integrates with @embroider/vite for modern Ember
          development workflows.
        </FeatureCard>
      </div>

      <div
        class="absolute w-2/3 h-20 mt-2 -right-32 -bottom-24 bg-dot-lg"
      ></div>
    </div>
  </div>

  <div class="px-4 py-16 overflow-hidden bg-gray-800 md:py-24">
    <div class="relative mx-auto max-w-screen-lg">
      <h3 class="mb-8 font-semibold leading-snug md:mx-auto max-w-256 md:pr-48">
        <span class="block text-3xl text-white md:text-4xl">Ready to dive in?</span>
        <span class="block text-xl text-green-500 md:text-2xl">Start building
          your next docs site with Ember and Docfy.</span>
      </h3>

      <div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <DocfyLink
          @to="/docs/ember"
          class="inline-flex items-center px-6 py-3 font-semibold text-black bg-green-500 rounded hover:bg-green-400"
        >
          Get Started with Ember
        </DocfyLink>

        <DocfyLink
          @to="/docs/ember/ember-vite"
          class="inline-flex items-center px-6 py-3 font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 border-2 border-blue-400"
        >
          <span class="mr-2">⚡</span>
          Try Vite Integration
        </DocfyLink>
      </div>

      <div class="absolute top-0 hidden md:block right-10">
        <div class="w-20 h-20 bg-dot-brighter-lg"></div>
        <div class="w-20 h-20 mt-2 ml-20 bg-dot-brighter-lg">
        </div>
      </div>
      <div
        class="absolute left-0 w-2/3 h-20 mt-2 ml-1 -bottom-24 bg-dot-lg"
      ></div>
    </div>
  </div>
</template>
