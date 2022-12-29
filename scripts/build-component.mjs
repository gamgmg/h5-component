import { rollup } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import glob from 'glob'

async function build() {
  const inputFiles = await glob.sync('packages/**/*.{js,ts,jsx,tsx,vue}').reduce((res, file) => {
    if (file.includes('.d.ts') || file.includes('__test__') || file.includes('node_modules'))
      return res
    let fileName = file.replace('packages/', '').split('.')[0]
    res[fileName] = file
    return res
  }, {})

  // console.log('inputFiles', inputFiles);

  const inputOptions = {
    input: inputFiles,
    plugins: [
      commonjs(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: true
          }
        },
        abortOnError: false
      }),
      vue()
    ]
  }

  const es = {
    dir: 'es',
    entryFileNames: '[name].js',
    format: 'esm',
    preserveModules: true
  }

  const lib = {
    dir: 'lib',
    entryFileNames: '[name].js',
    format: 'cjs'
  }
  const bundle = await rollup(inputOptions)

  await bundle.write(es)
  await bundle.write(lib)
}

build()
