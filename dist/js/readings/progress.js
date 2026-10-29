import {runtime} from '../state/app-state.js';import {save} from '../services/storage.js';
/** Stored inside the existing backup payload; opening is not completion. */
export function readingProgress(id){runtime.state.readings=runtime.state.readings||{};return runtime.state.readings[id]||(runtime.state.readings[id]={visited:true,completed:false,lastTurn:0,mode:'guided',hints:0})}
export function updateReading(id,changes){const p=readingProgress(id);Object.assign(p,changes,{lastAccess:new Date().toISOString()});save();return p}
