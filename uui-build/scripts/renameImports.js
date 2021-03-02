const replaceInFiles = require('replace-in-files');

const options = {
  files: ['./**/*.ts','./**/*.tsx','./**/*.less'],
  optionsForFiles: { // default
    "ignore": [
      "**/node_modules/**"
    ]
  }
};

let modules = [
    'edu-bo-components',
    'edu-core',
    'edu-core-routing',
    'edu-ui-base',
    'edu-utils',
    'uui',
    'uui-build',
    'uui-timeline',
];

let modulesReplacements = {};
modules.forEach(m => modulesReplacements[m] = '@epam/' + m);
modulesReplacements['loveship'] = '@epam/loveship';
modulesReplacements['epam-assets'] = '@epam/assets';
modulesReplacements['extra'] = '@epam/uui-extra';
modulesReplacements['@epam/uui/components'] = '@epam/uui-components';
modulesReplacements['uui/components'] = '@epam/uui-components';

let contextReplacements = {};
contextReplacements['errorCtx'] = 'uuiErrors';
contextReplacements['apiCtx'] = 'uuiAPI';
contextReplacements['modal'] = 'uuiModals';
contextReplacements['notifications'] = 'uuiNotifications';
contextReplacements['userSettings'] = 'uuiUserSettings';
contextReplacements['dndContext'] = 'uuiDnD';
contextReplacements['appCtx'] = 'uuiApp';
contextReplacements['routerCtx'] = 'uuiRouter';
contextReplacements['layout'] = 'uuiLayout';
contextReplacements['lock'] = 'uuiLocks';


async function replace(from, to) {
  options.from = from;
  options.to = to;

  const {
    changedFiles,
    countOfMatchesByPaths,
    replaceInFilesOptions
  } = await replaceInFiles(options);
  console.log('Modified files:', changedFiles);
  console.log('Count of matches by paths:', countOfMatchesByPaths);
  console.log('was called with:', replaceInFilesOptions);
  console.log('')
}

async function main() {
  for(var from of Object.keys(modulesReplacements)) {
    console.log(`Replacing module reference ${from} => ${modulesReplacements[from]}`);
    await replace(
        new RegExp(`import([^]*?)from\\s*['"](?:${from}|ui/${from})(\\/.*?)?['"]`, 'gm'),
        (c, imports, path) => `import${imports}from '${modulesReplacements[from]}${path||""}'`
    )
  }

  for(var from of Object.keys(contextReplacements)) {
    console.log(`Replacing context name ${from} => ${contextReplacements[from]}`);
    await replace(
        new RegExp(`(.*)svc.(?:${from})(.*)`, 'gm'),
        (c, strStart, strEnd) => `${strStart}svc.${contextReplacements[from]}${strEnd}`
    )
  }

  await replace(
    new RegExp(`@import '~epam-assets`, 'g'),
    `@import (reference) '~@epam/assets`
  )
}

main();