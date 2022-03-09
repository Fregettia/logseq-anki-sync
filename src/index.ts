import '@logseq/libs'
import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin'
import * as AnkiConnect from './anki-connect/AnkiConnect';
import { LazyAnkiNoteManager } from './anki-connect/LazyAnkiNoteManager';
import { template_front, template_back, template_files } from './templates/AnkiCardTemplates';
import { Note } from './notes/Note';
import { ClozeNote } from './notes/ClozeNote';
import { MultilineCardNote } from './notes/MultilineCardNote';
import _ from 'lodash';
import { get_better_error_msg, confirm } from './utils';
import { LogseqToAnkiSync } from './syncLogseqToAnki';
import { settingsTemplate } from './constants';

const delay = (t = 100) => new Promise(r => setTimeout(r, t))

// --- Register UI Elements Onload ---
function main(baseInfo: LSPluginBaseInfo) {
  let syncLogseqToAnki = function() { new LogseqToAnkiSync().sync();  };
  logseq.provideModel({
    syncLogseqToAnki: syncLogseqToAnki,
  });
  logseq.App.registerCommandPalette({
    key: `logseq-anki-sync-command-palette`,
    label: `Start Logseq to Anki Sync`
  }, syncLogseqToAnki);
  const ANKI_ICON: string = `<svg xmlns="http://www.w3.org/2000/svg" width="20.2px" height="22px" viewBox="-0 -2 108 108">
  <path stroke="var(--ls-icon-color)" fill="var(--ls-icon-color)" d="M 27.00,3.53 C 18.43,6.28 16.05,10.38 16.00,19.00 16.00,19.00 16.00,80.00 16.00,80.00 16.00,82.44 15.87,85.73 16.74,88.00 20.66,98.22 32.23,97.00 41.00,97.00 41.00,97.00 69.00,97.00 69.00,97.00 76.63,96.99 82.81,95.84 86.35,88.00 88.64,82.94 88.00,72.79 88.00,67.00 88.00,67.00 88.00,24.00 88.00,24.00 87.99,16.51 87.72,10.42 80.98,5.65 76.04,2.15 69.73,3.00 64.00,3.00 64.00,3.00 27.00,3.53 27.00,3.53 Z M 68.89,15.71 C 74.04,15.96 71.96,19.20 74.01,22.68 74.01,22.68 76.72,25.74 76.72,25.74 80.91,30.85 74.53,31.03 71.92,34.29 70.70,35.81 70.05,38.73 67.81,39.09 65.64,39.43 63.83,37.03 61.83,36.00 59.14,34.63 56.30,35.24 55.08,33.40 53.56,31.11 56.11,28.55 56.20,25.00 56.24,23.28 55.32,20.97 56.20,19.35 57.67,16.66 60.89,18.51 64.00,17.71 64.00,17.71 68.89,15.71 68.89,15.71 Z M 43.06,43.86 C 49.81,45.71 48.65,51.49 53.21,53.94 56.13,55.51 59.53,53.51 62.94,54.44 64.83,54.96 66.30,56.05 66.54,58.11 67.10,62.74 60.87,66.31 60.69,71.00 60.57,74.03 64.97,81.26 61.40,83.96 57.63,86.82 51.36,80.81 47.00,82.22 43.96,83.20 40.23,88.11 36.11,87.55 29.79,86.71 33.95,77.99 32.40,74.18 30.78,70.20 24.67,68.95 23.17,64.97 22.34,62.79 23.39,61.30 25.15,60.09 28.29,57.92 32.74,58.49 35.44,55.57 39.11,51.60 36.60,45.74 43.06,43.86 Z"></path>
  </svg>`;
  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-anki-sync',
    template: `
      <a title="Start Logseq to Anki Sync" data-on-click="syncLogseqToAnki"
         class="button">
        <i class="ti">${ANKI_ICON}</i>
      </a>
    `
  });

  ClozeNote.initLogseqOperations();
  MultilineCardNote.initLogseqOperations();

  logseq.useSettingsSchema(settingsTemplate);
}

// Bootstrap
logseq.ready(main).catch(console.error)