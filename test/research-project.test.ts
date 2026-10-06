import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-research-project-sample.xml",
);

function loadFixture() {
  return parseCurriculum(readFileSync(fixturePath, "latin1"));
}

describe("professional activity research projects", () => {
  it("reads project participation under ATUACAO-PROFISSIONAL", () => {
    const curriculum = loadFixture();
    expect(curriculum.professionalActivities).toHaveLength(1);

    const activity = curriculum.professionalActivities[0];
    expect(activity.institution).toBe("Universidade Sintética");
    expect(activity.links[0]?.startYear).toBe("2020");
    expect(activity.projectParticipations).toHaveLength(1);

    const participation = activity.projectParticipations[0];
    expect(participation.periodFlag).toBe("ATUAL");
    expect(participation.projects).toHaveLength(1);

    const project = participation.projects[0];
    expect(project.name).toBe("Plataforma de dados abertos");
    expect(project.situation).toBe("EM_ANDAMENTO");
    expect(project.nature).toBe("PESQUISA");
    expect(project.teamMembers[0]?.name).toBe("Integrante Um");
    expect(project.teamMembers[0]?.responsible).toBe("SIM");
  });

  it("round-trips project and team member fields", () => {
    const first = loadFixture();
    const second = parseCurriculum(serializeCurriculum(first));

    const projectBefore = first.professionalActivities[0]?.projectParticipations[0]?.projects[0];
    const projectAfter = second.professionalActivities[0]?.projectParticipations[0]?.projects[0];

    expect(projectAfter?.name).toBe(projectBefore?.name);
    expect(projectAfter?.startYear).toBe(projectBefore?.startYear);
    expect(projectAfter?.endYear).toBe(projectBefore?.endYear);
    expect(projectAfter?.teamMembers[0]?.name).toBe(projectBefore?.teamMembers[0]?.name);
    expect(projectAfter?.teamMembers[0]?.citationName).toBe(
      projectBefore?.teamMembers[0]?.citationName,
    );
  });
});
