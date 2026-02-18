import { describe, it, expect } from 'vitest';
import {
  escapeTypst,
  buildPreamble,
  buildHeader,
  buildDateRange,
  buildProjectDetails,
  buildEducationDetails,
  buildOrganizationRole,
  buildTypstDocument
} from './typstMarkup';
import type {
  IPersonDetails,
  IOrganizationRole,
  IEducationDetails,
  IProjectDetail,
  IPersonLangDetails,
  ISkillsCount,
  ICredentialDetails,
  ISkillsDetails
} from '../models';
import type { NamedNode, Literal } from 'oxigraph';

// Helpers to create mock Literal and NamedNode objects
function mockLiteral(value: string): Literal {
  return { value, termType: 'Literal' } as unknown as Literal;
}

function mockNamedNode(value: string): NamedNode {
  return { value, termType: 'NamedNode' } as unknown as NamedNode;
}

describe('escapeTypst', () => {
  it('escapes hash characters', () => {
    expect(escapeTypst('Hello #world')).toBe('Hello \\#world');
  });

  it('escapes asterisks', () => {
    expect(escapeTypst('bold *text*')).toBe('bold \\*text\\*');
  });

  it('escapes underscores', () => {
    expect(escapeTypst('snake_case')).toBe('snake\\_case');
  });

  it('escapes backticks', () => {
    expect(escapeTypst('code `here`')).toBe('code \\`here\\`');
  });

  it('escapes dollar signs', () => {
    expect(escapeTypst('price $100')).toBe('price \\$100');
  });

  it('escapes angle brackets', () => {
    expect(escapeTypst('<tag>')).toBe('\\<tag\\>');
  });

  it('escapes at signs', () => {
    expect(escapeTypst('user@example')).toBe('user\\@example');
  });

  it('escapes backslashes', () => {
    expect(escapeTypst('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('escapes multiple special characters together', () => {
    expect(escapeTypst('#*_`$<>@\\')).toBe('\\#\\*\\_\\`\\$\\<\\>\\@\\\\');
  });

  it('returns plain text unchanged', () => {
    expect(escapeTypst('Hello world 123')).toBe('Hello world 123');
  });
});

describe('buildPreamble', () => {
  it('outputs Typst set rules for French', () => {
    const result = buildPreamble('fr');
    expect(result).toContain('#set page(paper: "a4", margin: 20mm)');
    expect(result).toContain('#set text(font: "Noto Sans", size: 10pt, lang: "fr")');
    expect(result).toContain('#set par(justify: true)');
    expect(result).toContain('#show heading');
  });

  it('outputs lang parameter for English', () => {
    const result = buildPreamble('en');
    expect(result).toContain('lang: "en"');
  });
});

describe('buildHeader', () => {
  it('renders person name, link, job title, and description', () => {
    const person: IPersonDetails = {
      person: mockNamedNode('http://example.com/#me'),
      name: mockLiteral('John Doe'),
      email: null,
      jobTitle: mockLiteral('Software Engineer'),
      description: mockLiteral('Experienced developer')
    };

    const result = buildHeader(person);
    expect(result).toContain('John Doe');
    expect(result).toContain('22pt');
    expect(result).toContain('nka11.github.io/cv');
    expect(result).toContain('Software Engineer');
    expect(result).toContain('16pt');
    expect(result).toContain('Experienced developer');
    expect(result).toContain('#line(length: 100%');
  });

  it('handles missing description', () => {
    const person: IPersonDetails = {
      person: mockNamedNode('http://example.com/#me'),
      name: mockLiteral('Jane Doe'),
      email: null,
      jobTitle: mockLiteral('Designer'),
      description: null
    };

    const result = buildHeader(person);
    expect(result).toContain('Jane Doe');
    expect(result).toContain('Designer');
    expect(result).not.toContain('11pt');
  });
});

describe('buildDateRange', () => {
  it('returns empty string when no dates', () => {
    expect(buildDateRange(null, null, 'fr')).toBe('');
  });

  it('returns "de ... à ..." in French for full range', () => {
    const result = buildDateRange('2020-01-15', '2023-06-30', 'fr');
    expect(result).toContain('de ');
    expect(result).toContain(' à ');
    expect(result).toContain('2020');
    expect(result).toContain('2023');
  });

  it('returns "from ... to ..." in English for full range', () => {
    const result = buildDateRange('2020-01-15', '2023-06-30', 'en');
    expect(result).toContain('from ');
    expect(result).toContain(' to ');
  });

  it('returns "depuis ..." in French for ongoing', () => {
    const result = buildDateRange('2020-01-15', null, 'fr');
    expect(result).toContain('depuis ');
    expect(result).toContain('2020');
  });

  it('returns "since ..." in English for ongoing', () => {
    const result = buildDateRange('2020-01-15', null, 'en');
    expect(result).toContain('since ');
  });

  it('returns just end date when only end date provided', () => {
    const result = buildDateRange(null, '2023-06-30', 'fr');
    expect(result).toContain('2023');
  });
});

describe('buildProjectDetails', () => {
  const mockListSkills = () => [] as ISkillsDetails[];

  it('renders project with dates when showDates is true', () => {
    const project: IProjectDetail = {
      project: mockNamedNode('http://example.com/project1'),
      url: null,
      projectName: mockLiteral('My Project'),
      roleName: null,
      projectDescription: mockLiteral('A cool project'),
      projectStartDate: mockLiteral('2020-01-01'),
      projectEndDate: mockLiteral('2021-12-31')
    };

    const result = buildProjectDetails(project, 'fr', true, mockListSkills);
    expect(result).toContain('My Project');
    expect(result).toContain('2020');
    expect(result).toContain('2021');
    expect(result).toContain('A cool project');
  });

  it('renders project without dates when showDates is false', () => {
    const project: IProjectDetail = {
      project: mockNamedNode('http://example.com/project1'),
      url: null,
      projectName: mockLiteral('My Project'),
      roleName: null,
      projectDescription: null,
      projectStartDate: null,
      projectEndDate: null
    };

    const result = buildProjectDetails(project, 'fr', false, mockListSkills);
    expect(result).toContain('- My Project');
  });

  it('renders skills when available', () => {
    const project: IProjectDetail = {
      project: mockNamedNode('http://example.com/project1'),
      url: null,
      projectName: mockLiteral('Project'),
      roleName: null,
      projectDescription: null,
      projectStartDate: null,
      projectEndDate: null
    };

    const listSkillsWithData = () => [
      { skill: mockNamedNode('s1'), skillLabel: mockLiteral('TypeScript'), parentSkillName: null },
      { skill: mockNamedNode('s2'), skillLabel: mockLiteral('Svelte'), parentSkillName: null }
    ] as ISkillsDetails[];

    const result = buildProjectDetails(project, 'fr', false, listSkillsWithData);
    expect(result).toContain('TypeScript');
    expect(result).toContain('Svelte');
  });
});

describe('buildTypstDocument', () => {
  const mockAdapters = {
    listCredentials: () => [] as ICredentialDetails[],
    listProjects: () => [] as IProjectDetail[],
    listSkills: () => [] as ISkillsDetails[]
  };

  const person: IPersonDetails = {
    person: mockNamedNode('http://example.com/#me'),
    name: mockLiteral('Test User'),
    email: null,
    jobTitle: mockLiteral('Developer'),
    description: mockLiteral('Test description')
  };

  it('contains all sections in French', () => {
    const result = buildTypstDocument(
      person, [], [], [], [], [], mockAdapters, 'fr'
    );

    expect(result).toContain('Expérience professionnelle');
    expect(result).toContain('Formation');
    expect(result).toContain('Projets');
    expect(result).toContain('Langues');
    expect(result).toContain('Compétences');
  });

  it('contains all sections in English', () => {
    const result = buildTypstDocument(
      person, [], [], [], [], [], mockAdapters, 'en'
    );

    expect(result).toContain('Professional Experience');
    expect(result).toContain('Education');
    expect(result).toContain('Projects');
    expect(result).toContain('Languages');
    expect(result).toContain('Skills');
  });

  it('includes person header', () => {
    const result = buildTypstDocument(
      person, [], [], [], [], [], mockAdapters, 'en'
    );

    expect(result).toContain('Test User');
    expect(result).toContain('Developer');
    expect(result).toContain('Test description');
  });

  it('includes preamble with page setup', () => {
    const result = buildTypstDocument(
      person, [], [], [], [], [], mockAdapters, 'fr'
    );

    expect(result).toContain('#set page(paper: "a4"');
    expect(result).toContain('#set text(font: "Noto Sans"');
  });

  it('includes organization roles', () => {
    const role: IOrganizationRole = {
      role: mockNamedNode('http://example.com/role1'),
      roleName: mockLiteral('Tech Lead'),
      employer: mockLiteral('ACME Corp'),
      startDate: mockLiteral('2020-01-01'),
      endDate: mockLiteral('2023-12-31'),
      description: mockLiteral('Led the tech team'),
      place: null,
      identifier: null,
      url: null
    };

    const result = buildTypstDocument(
      person, [role], [], [], [], [], mockAdapters, 'fr'
    );

    expect(result).toContain('Tech Lead');
    expect(result).toContain('ACME Corp');
    expect(result).toContain('Led the tech team');
  });

  it('includes skills list', () => {
    const skills: ISkillsCount[] = [
      { skillName: mockLiteral('JavaScript'), count: mockLiteral('5') },
      { skillName: mockLiteral('Python'), count: mockLiteral('3') }
    ];

    const result = buildTypstDocument(
      person, [], [], [], [], skills, mockAdapters, 'en'
    );

    expect(result).toContain('JavaScript, Python');
  });

  it('includes languages', () => {
    const langList: IPersonLangDetails[] = [
      { person: mockNamedNode('http://example.com/#me'), lang: mockLiteral('French'), level: mockLiteral('Native') },
      { person: mockNamedNode('http://example.com/#me'), lang: mockLiteral('English'), level: mockLiteral('Fluent') }
    ];

    const result = buildTypstDocument(
      person, [], [], [], langList, [], mockAdapters, 'en'
    );

    expect(result).toContain('French');
    expect(result).toContain('Native');
    expect(result).toContain('English');
    expect(result).toContain('Fluent');
  });
});
