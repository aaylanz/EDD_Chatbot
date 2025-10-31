export function parseAgentName(
  inboxAssignee: { firstName: string } | null,
): string | null {
  if (inboxAssignee === null) {
    return null;
  }

  return `${inboxAssignee.firstName}`;
}
