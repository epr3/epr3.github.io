const EMAIL_DESTINATION_PARTS = [
  "mai",
  "lto",
  ":",
  "eduard.florin",
  ".predescu",
  "@gmail",
  ".com",
];

export const EMAIL_CONTACT_EVENT = "Clicked send email";

function buildEmailAddress(): string {
  return EMAIL_DESTINATION_PARTS.slice(3).join("");
}

export function buildEmailDestination(): string {
  return `${EMAIL_DESTINATION_PARTS.slice(0, 3).join("")}${buildEmailAddress()}`;
}

export function staticOutputIsObfuscated(output: string): boolean {
  return (
    !output.includes(buildEmailAddress()) &&
    !output.includes(EMAIL_DESTINATION_PARTS.slice(0, 3).join(""))
  );
}

function openEmailClient(): void {
  const link = document.createElement("a");
  link.href = buildEmailDestination();
  link.click();
}

export function initContactActions(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-email-contact]")
    .forEach((button) => button.addEventListener("click", openEmailClient));
}
