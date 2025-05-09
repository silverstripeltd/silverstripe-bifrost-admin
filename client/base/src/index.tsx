import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, Piral, createStandardApi } from 'piral';
import { layout, errors } from './layout';
import {createCMSApi} from './api/cms';

// TODO pass configuration in rather than hard coding references here
const apiBase = 'admin/silverstripesearch/api/v1';
const feedUrl = `${apiBase}/pilets`;

const instance = createInstance({
  state: {
    components: layout,
    errorComponents: errors,
  },
  plugins: [...createStandardApi(), createCMSApi({apiBase})],
  requestPilets() {
    return fetch(feedUrl)
      .then((res) => res.json())
      .then((res) => res.items);
  },
});

const root = createRoot(document.querySelector('.SilvestripeSearchAdmin'));

root.render(<Piral instance={instance} />);
