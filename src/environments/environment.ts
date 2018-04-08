// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCHf-vLOjWVg74QjtIWhxoD3rV_oRAlHqs',
    authDomain: 'angular-tour-of-heroes-86f07.firebaseapp.com',
    databaseURL: 'https://angular-tour-of-heroes-86f07.firebaseio.com',
    projectId: 'angular-tour-of-heroes-86f07',
    storageBucket: 'angular-tour-of-heroes-86f07.appspot.com',
    messagingSenderId: '105824436756'
  }
};
