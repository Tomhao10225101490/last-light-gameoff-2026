// Retained-map regression fixtures, including compatibility with existing saves.
// These are not expanded-map reachability or full-playthrough tests.
import {Simulation as RuntimeSimulation} from '../dist/simulation.js';
import {freshSave} from '../dist/save.js';
export {FIXED_DT} from '../dist/simulation.js';
export class Simulation extends RuntimeSimulation{
 constructor(progress=freshSave()){super({...progress,worldRevision:1});}
}
