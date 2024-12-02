import dotenv from 'dotenv';
import fs from 'fs/promises';
import { envSchema } from '../src/env-validator';
import { zodKeys } from './utils';
import { z } from 'zod';
import path from 'path';
import url from 'url';

const thisFilePath = url.fileURLToPath(import.meta.url);
const testFolder = path.dirname(thisFilePath);
const coreRoot = path.resolve(testFolder, '..');
const exampleEnvFile = path.resolve(coreRoot, '.env.example');
const parsedSchemaPromise: Promise<dotenv.DotenvParseOutput> = fs.readFile(exampleEnvFile, 'utf-8').then(dotenv.parse);

describe('Example ENV has all keys', async () => {
    const exampleEnvKeys = new Set(Object.keys(await parsedSchemaPromise));
    const envSchemaKeys = new Set(zodKeys(envSchema));
    envSchemaKeys.delete('WHOP_API_KEY');
    envSchemaKeys.delete('WHOP_WEBHOOK_SECRET');

    for (const key of envSchemaKeys) {
        test(`${key}`, ()=>{
            expect(exampleEnvKeys).includes(key, 'Missing key in example ENV');
        });
    }
});

describe('Example ENV has no extra keys', async () => {
    const exampleEnvKeys = new Set(Object.keys(await parsedSchemaPromise));
    const envSchemaKeys = new Set(zodKeys(envSchema));
    envSchemaKeys.delete('WHOP_API_KEY');
    envSchemaKeys.delete('WHOP_WEBHOOK_SECRET');

    for (const key of exampleEnvKeys) {
        test(`${key}`, ()=>{
            expect(envSchemaKeys).includes(key, 'Extra key in example ENV');
        });
    }
})


it('Example ENV is schema-compliant', async () => {
    const parsedSchema = await parsedSchemaPromise;
    expect(envSchema.safeParse(parsedSchema).error?.errors, 'example ENV was not schema-compliant').toBeUndefined();
});
