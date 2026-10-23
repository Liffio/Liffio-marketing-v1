import assert from "node:assert/strict";
import test from "node:test";

import {
  getHelpContactHtml,
  getHelpContactSubject,
  getHelpContactText,
} from "@/lib/email/templates/help-contact";

const sample = {
  name: "Alex Morgan",
  email: "alex@brand.com",
  subject: "Billing question",
  message: "Line one\nLine two",
};

test("the subject names the submitted subject line", () => {
  assert.equal(getHelpContactSubject(sample), "Help request: Billing question");
});

test("the text body carries every field, including a multi-line message", () => {
  const text = getHelpContactText(sample);
  assert.match(text, /Name: Alex Morgan/);
  assert.match(text, /Email: alex@brand.com/);
  assert.match(text, /Subject: Billing question/);
  assert.match(text, /Line one\nLine two/);
});

test("the html body escapes submitted content instead of injecting raw markup", () => {
  const html = getHelpContactHtml({
    ...sample,
    name: '<img src=x onerror=alert(1)>',
    message: "a & b",
  });
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img/);
  assert.match(html, /a &amp; b/);
});
