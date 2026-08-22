import { describe, expect, it } from "vitest";

import {
  EMAIL_CONTACT_EVENT,
  buildEmailDestination,
  staticOutputIsObfuscated,
} from "./contact-action";

describe("contact action", () => {
  it("constructs the configured mail-client destination on activation", () => {
    expect(buildEmailDestination()).toBe(
      "mailto:eduard.florin.predescu@gmail.com"
    );
  });

  it("preserves the existing email-contact analytics event", () => {
    expect(EMAIL_CONTACT_EVENT).toBe("Clicked send email");
  });

  it("rejects static output containing a mailto destination or complete address", () => {
    expect(staticOutputIsObfuscated("<button>Email</button>")).toBe(true);
    expect(
      staticOutputIsObfuscated('href="mailto:eduard.florin.predescu@gmail.com"')
    ).toBe(false);
    expect(staticOutputIsObfuscated("eduard.florin.predescu@gmail.com")).toBe(
      false
    );
  });
});
