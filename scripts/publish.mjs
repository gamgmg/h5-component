#!/usr/bin/env zx

import fs from 'fs'
import path from 'path'

const pkgPath = path.join(process.cwd(), 'package.json')

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

pkg.name = '@gurming/h5-component'

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

await $`version-publish`

delete pkg.name

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

