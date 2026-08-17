/**
 * The tools registry behind `/tools`.
 *
 * `/tools` is architecture for something that does not exist yet, and the brief
 * is explicit that inventing tools to fill it is not acceptable. So the registry
 * starts with `status: "planned"` entries only — the index page renders them as
 * a roadmap, not as products — and shipping a real utility means adding an entry
 * with `status: "live"` plus a route. Nothing else has to change.
 */

export type ToolStatus = "live" | "building" | "planned";

export type Tool = {
  slug: string;
  name: string;
  summary: string;
  /** What problem it solves, in the reader's terms. */
  detail: string;
  status: ToolStatus;
  /** Set only when `status` is `live`. */
  href?: string;
  tags: string[];
};

export const TOOL_STATUS_LABEL: Record<ToolStatus, string> = {
  live: "Live",
  building: "In progress",
  planned: "Planned",
};

export const tools: Tool[] = [
  {
    slug: "stack-picker",
    name: "Stack picker",
    summary:
      "Answer six questions about a project and get a defensible starting stack, with the trade-offs named.",
    detail:
      "Built because 'which stack should I use' has a decent answer once you know the constraints — team size, hosting, whether you need a database, how much you care about cold starts.",
    status: "planned",
    tags: ["decisions", "architecture"],
  },
  {
    slug: "agent-brief",
    name: "Agent brief builder",
    summary:
      "Turn a rough task description into a structured brief a coding agent can act on.",
    detail:
      "The context checklist from the resources section, as a form: goal, acceptance criteria, files to imitate, scope limits and constraints, copyable as markdown.",
    status: "planned",
    tags: ["agents", "prompting"],
  },
  {
    slug: "diff-reviewer",
    name: "Diff review prompts",
    summary:
      "Generate review questions tuned to the specific failure modes of generated code.",
    detail:
      "Paste a diff summary, get the questions worth asking about it — duplication, boundary conditions, error paths — rather than a generic checklist.",
    status: "planned",
    tags: ["code-review", "quality"],
  },
];

export function getLiveTools(): Tool[] {
  return tools.filter((tool) => tool.status === "live");
}

export function getPlannedTools(): Tool[] {
  return tools.filter((tool) => tool.status !== "live");
}
