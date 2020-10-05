import { environment as env } from '../src/environments/environment';
import { get as httpGet } from 'http';
import { writeFile } from 'fs';
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

update('/dev/data-types', 'src/app/api/interface/data-types.ts');
update('/dev/endpoints', 'src/app/api/interface/endpoints.ts');
update('/dev/response', 'src/app/api/interface/response.ts');
