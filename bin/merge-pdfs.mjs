#!/usr/bin/env node
"use strict";

import { runCli } from "../dist/commands/runner.js";
import { PKG_NAME } from "../dist/constants/index.js";

runCli(PKG_NAME);
