#!/usr/bin/env zx

await $`rimraf play/src/assets/es`
await $`rimraf play/src/assets/lib`
await $`rimraf play/src/assets/styles`

await $`cp -r es play/src/assets/es`
await $`cp -r lib play/src/assets/lib`
await $`cp -r styles play/src/assets/styles`
