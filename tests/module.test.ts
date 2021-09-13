import { assertStrictEquals as equals } from "../deps/assert.ts";
import { getSite, testPage } from "./utils.ts";

Deno.test("build a site with js/ts modules", async () => {
  const site = getSite({
    test: true,
    src: "module",
    location: new URL("https://example.com/blog"),
  });

  await site.build();

  testPage(site, "/simple", (page) => {
    equals(page.document?.querySelectorAll("h1").length, 1);
    equals(page.document?.querySelector("h1")?.innerText, page.data.title);
  });

  testPage(site, "/multiple[0]", (page) => {
    equals(page.data.url, "/multiple/1.html");
    equals(page.data.tags?.[0], "multiple");
    equals(page.document?.querySelector("title")?.innerText, "Page 1");
  });

  testPage(site, "/multiple[1]", (page) => {
    equals(page.data.url, "/multiple/2.html");
    equals(page.data.tags?.[0], "multiple");
    equals(page.document?.querySelector("title")?.innerText, "Default title");
  });

  testPage(site, "/multiple[2]", (page) => {
    equals(page.data.url, "/multiple/3.html");
    equals(page.data.tags?.[0], "multiple");
    equals(page.document?.querySelector("title")?.innerText, "Default title");
  });

  testPage(site, "/multiple-async[0]", (page) => {
    equals(page.data.url, "/async/1/");
    equals(page.dest.path, "/async/1/index");
    equals(page.dest.ext, ".html");
    equals(page.data.tags?.[0], "autogenerated");
    equals(page.data.title, "Multiple page 1");
    equals(page.document?.querySelector("title")?.innerText, page.data.title);
  });

  testPage(site, "/multiple-async[1]", (page) => {
    equals(page.data.url, "/async/2/");
    equals(page.dest.path, "/async/2/index");
    equals(page.dest.ext, ".html");
    equals(page.data.tags?.[0], "autogenerated");
    equals(page.data.title, "Multiple page 2");
    equals(page.document?.querySelector("title")?.innerText, page.data.title);
  });
});
