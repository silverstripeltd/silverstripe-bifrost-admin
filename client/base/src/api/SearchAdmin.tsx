import * as React from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { useGlobalState } from 'piral-core';
import { PiralSearchAdminContainer, PiralSearchAdminTile } from './components';
import { TileRegistration } from './types';

export interface SearchAdminProps extends RouteComponentProps {
  filter?(tile: TileRegistration): boolean;
}

/**
 * The dashboard component. Integrate this as a page or in a component
 * where dashboard information (tiles) should be shown.
 */
export const SearchAdmin: React.FC<SearchAdminProps> = (props) => {
  const tiles = useGlobalState((s) => s.registry.tiles);
  const { filter = () => true } = props;
  const children = Object.keys(tiles)
    .filter((tile) => filter(tiles[tile]))
    .map((tile) => {
      const { component: Component, preferences } = tiles[tile];
      const { initialColumns = 1, initialRows = 1, resizable = false } = preferences;
      return (
        <PiralSearchAdminTile
          key={tile}
          columns={initialColumns}
          rows={initialRows}
          resizable={resizable}
          meta={preferences}
        >
          <Component columns={initialColumns} rows={initialRows} />
        </PiralSearchAdminTile>
      );
    });

  return <PiralSearchAdminContainer {...props} children={children} />;
};
SearchAdmin.displayName = 'SearchAdmin';
