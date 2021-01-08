import { environment as env } from '../src/environments/environment';
import { get as httpGet } from 'http';
import { existsSync, mkdirSync,writeFile } from 'fs';
import * as chalk from 'chalk';

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

const update = (path: string, fileName: string): void => {
    get(path).then(fileData => {
        if (fileData.includes(`<pre>Cannot GET ${path}</pre>`)) {
            console.log(chalk.redBright(`Could not get data from ${path}.`));
            return;
        }

        writeFile(fileName, fileData, err => {
            if (err) {
                console.log(err);
            } else {
                console.log(chalk.greenBright(`Successfully updated ${fileName}`));
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
    ensureDirectoryExists('./src/app/api/interface');
    ensureDirectoryExists('./src/app/api/interface/responses');
}

ensureDirectoriesExist();
update('/dev/data-types', 'src/app/api/interface/data-types.ts');
update('/dev/response', 'src/app/api/interface/response.ts');
update('/dev/responses/api-responses', 'src/app/api/interface/responses/api-responses.ts');
update('/dev/responses/auth-endpoints', 'src/app/api/interface/responses/auth-responses.ts');
update('/dev/responses/error-responses', 'src/app/api/interface/responses/error-responses.ts');
