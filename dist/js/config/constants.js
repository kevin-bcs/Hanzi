/** Hanzi Daily module: config/constants.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";

export const $ = (id) => document.getElementById(id);

export const KEY = "hanzi-daily-v1";
