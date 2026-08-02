export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  const withoutLeadingZero = digits.startsWith("0") ? digits.slice(1) : digits;
  const local = withoutLeadingZero.startsWith("996")
    ? withoutLeadingZero.slice(3)
    : withoutLeadingZero;
  return `+996${local}`;
}

export function isValidPhone(input: string): boolean {
  return /^\+996\d{9}$/.test(normalizePhone(input));
}

export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits.startsWith("996")) {
    digits = `996${digits}`;
  }
  digits = digits.slice(0, 12);
  const local = digits.slice(3);

  let out = "+996";
  if (local.length > 0) out += ` (${local.slice(0, 3)}`;
  if (local.length >= 3) out += ")";
  if (local.length > 3) out += ` ${local.slice(3, 5)}`;
  if (local.length > 5) out += `-${local.slice(5, 7)}`;
  if (local.length > 7) out += `-${local.slice(7, 9)}`;
  return out;
}
