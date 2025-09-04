import * as fs from 'fs';

let projectFiles: string[] = [];
const projectsPath = './static/cv/projects';
if (fs.existsSync(projectsPath)) {
    projectFiles = fs.readdirSync(projectsPath).map((f) => {
        return `/cv/projects/${f}`
    })
}
let orgrolesFiles: string[] = [];
let orgroles: string[] = [];
const orgrolesPath = './static/cv/orgroles';
if (fs.existsSync(orgrolesPath)) {
    orgrolesFiles = fs.readdirSync(orgrolesPath).map((f) => {
        return `/cv/orgroles/${f}`
    })
}



export const dataFiles = [
      '/cv/ontology.ttl',
      '/cv/schemaorg.ttl',
      '/cv/skills.ttl',
      '/cv/product_cycle.ttl',
    ].concat(projectFiles).concat(orgrolesFiles);
