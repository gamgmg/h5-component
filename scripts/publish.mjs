#!/usr/bin/env zx

import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import semver from 'semver'

const pkgPath = path.join(process.cwd(), 'package.json')

function getPkg(){
  return JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
}

function setPkg(pkg){
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

function versionList(version) {
  const major = semver.inc(version, "major");
  const minor = semver.inc(version, "minor");
  const patch = semver.inc(version, "patch");
  const prerelease = semver.inc(version, "prerelease", "beta");

  return [
    { title: major, value: major },
    { title: minor, value: minor },
    { title: patch, value: patch },
    { title: prerelease, value: prerelease },
  ];
}

async function push(name){
  try {
    const res = await $`git push -u origin ${name}`
    console.log('push success', res);
  } catch (error) {
    console.log('push error', error);
    console.log('repush......')
    await push(name)
  }
}

async function init(){
  let pkg = getPkg()
  
  const res = await prompts([
    {
      message: "请选择版本号",
      name: "version",
      type: "select",
      choices: versionList(pkg.version),
    },
    {
      message: "是否要添加tag？",
      name: "tag",
      type: "confirm",
    },
  ])

  const { version, tag } = res;
  console.log(`
    版本号：${version}
    是否要添加tag: ${tag}
  `);

  const isConfirm = await prompts([
    {
      message: "请确认以上信息是否正确",
      name: "value",
      type: "confirm",
    },
  ]);

  if (!isConfirm.value) process.exit(1);

  pkg.version = version;

  pkg.name = '@gurming/h5-component'

  setPkg(pkg)

  const branchStr = (await $`git branch`).stdout
  const currentBranch = branchStr.slice(2, branchStr.match("\n").index);
  
  await $`pnpm build`
  
  await $`npm publish`
  
  pkg = getPkg()
  
  delete pkg.name
  
  setPkg(pkg)

  await $`git add .`

  await $`git commit -m 'chore(release): ${version}'`

  console.log(`git push => ${currentBranch}`)
  await push(currentBranch)

  const masterBranch = 'master'
  if(currentBranch !== masterBranch){
    await $`git checkout ${masterBranch}`
    await $`git merge ${currentBranch}`
    console.log(`git push => ${currentBranch}`)
    await push(masterBranch)
  }

  if (tag) {
    console.log(`git tag => ${tag}`)
    await push(tag)
  }
}

init()



