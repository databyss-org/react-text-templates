import path from 'path'
import fse from 'fs-extra'

async function copyFile(file) {
  const buildPath = path.resolve(__dirname, '../dist/', path.basename(file))
  await fse.copy(file, buildPath)
  console.log(`Copied ${file} to ${buildPath}`)
}

async function createPackageFile() {
  const packageData = await fse.readFile(
    path.resolve(__dirname, '../package.json'),
    'utf8'
  )
  const {
    scripts,
    devDependencies,
    jest,
    babel,
    ...packageDataOther
  } = JSON.parse(packageData)
  const newPackageData = {
    ...packageDataOther,
    main: './index.js',
    module: './index.es.js',
    private: false,
  }
  const buildPath = path.resolve(__dirname, '../dist/package.json')

  await fse.writeFile(
    buildPath,
    JSON.stringify(newPackageData, null, 2),
    'utf8'
  )
  console.log(`Created package.json in ${buildPath}`)

  return newPackageData
}

async function prepend(file, string) {
  const data = await fse.readFile(file, 'utf8')
  await fse.writeFile(file, string + data, 'utf8')
}

async function addLicense(packageData) {
  const license = `/** @license databyss.org v${packageData.version}
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
`
  await Promise.all(
    ['../dist/index.js', '../dist/index.es.js'].map(file =>
      prepend(path.resolve(__dirname, file), license)
    )
  )
}

async function run() {
  await Promise.all(['./README.md', './LICENSE'].map(file => copyFile(file)))
  const packageData = await createPackageFile()
  await addLicense(packageData)
}

run()
