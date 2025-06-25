import * as actions from './actions';
import { buildName, withApi, PiralPlugin, withRootExtension, withAll } from 'piral-core';
import { SearchAdmin } from './SearchAdmin';
import { InitialTile, PiletSearchAdminApi, TilePreferences } from './types';
import { getPreferences, getTiles, withRoutes, withTiles } from './helpers';

/**
 * Available configuration options for the search admin plugin.
 */
export interface SearchAdminConfig {
  /**
   * Sets the routes where a search admin should be displayed.
   * @default ['/']
   */
  routes?: Array<string>;
  /**
   * Sets the tiles to be given by the app shell.
   * @default []
   */
  tiles?: Array<InitialTile>;
  /**
   * Sets the default preferences to be used.
   * @default {}
   */
  defaultPreferences?: TilePreferences;
}

/**
 * Creates the Pilet API extension for activating search admin support.
 */
export function createSearchAdminApi(config: SearchAdminConfig = {}): PiralPlugin<PiletSearchAdminApi> {
  const { tiles = [], defaultPreferences = {}, routes = ['/'] } = config;

  return (context) => {
    context.defineActions(actions);

    context.dispatch(
      withAll(
        withTiles(getTiles(tiles, defaultPreferences)),
        withRootExtension('piral-search-admin', SearchAdmin),
        withRoutes(routes),
      ),
    );

    return (api, target) => {
      const pilet = target.name;
      let next = 0;

      return {
        registerTile(name, arg, preferences?) {
          if (typeof name !== 'string') {
            preferences = arg;
            arg = name;
            name = next++;
          }

          const id = buildName(pilet, name);
          context.registerTile(id, {
            pilet,
            component: withApi(context, arg, api, 'tile'),
            preferences: getPreferences(defaultPreferences, preferences),
          });
          return () => api.unregisterTile(name);
        },
        unregisterTile(name) {
          const id = buildName(pilet, name);
          context.unregisterTile(id);
        },
      };
    };
  };
}
