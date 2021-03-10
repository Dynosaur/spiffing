import { existsSync, mkdirSync,writeFile } from 'fs';
import chalk                               from 'chalk';
import { get as httpGet }                  from 'http';
import { resolve }                         from 'path';
import { environment as env } from '../src/environments/environment';

const apiUrl = env.apiHost;

const get = (path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const req = httpGet(`${apiUrl}${path}`, res => {
            let data = '';
            res.on('data', chunk => data += chunk.toString());
            res.on('error', error => reject(error));
            res.on('end', () => resolve(data));
        });
        req.on('error', err => reject(err));
    });
};

const update = (apiPath: string, localFileName: string): void => {
    get(apiPath).then(fileData => {
        if (fileData.includes(`<pre>Cannot GET ${apiPath}</pre>`)) {
            console.log(chalk.redBright(`Could not get data from ${apiPath}.`));
            return;
        }

        writeFile(localFileName, fileData, err => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Successfully updated ${resolve(process.cwd(), localFileName)}`);
            }
        });
    }).catch((err: any) => {
        if (err.code) {
            if (err.code === 'ECONNREFUSED') {
                console.log(chalk.redBright(`Could not connect to ${apiUrl}`));
            }
        } else {
            console.log(err);
        }
    });
};

function ensureDirectoriesExist(): void {
    function ensureDirectoryExists(path: string): void {
        if (!existsSync(path)) {
            mkdirSync(path);
        }
    }
    ensureDirectoryExists('../src/app/api/interface');
    ensureDirectoryExists('../src/app/api/interface/responses');
}

ensureDirectoriesExist();
update('/api/dev/data-types', '../src/app/api/interface/data-types.ts');
update('/api/dev/response', '../src/app/api/interface/response.ts');
update('/api/dev/responses/api-responses', '../src/app/api/interface/responses/api-responses.ts');
update('/api/dev/responses/auth-endpoints', '../src/app/api/interface/responses/auth-responses.ts');
update('/api/dev/responses/error-responses', '../src/app/api/interface/responses/error-responses.ts');
