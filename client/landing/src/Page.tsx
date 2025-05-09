import * as React from 'react';
import { PiletCustomApi } from 'silverstripe-search-admin';
import type { MatchType, LocationType } from '.';
import { Link } from 'react-router-dom';

interface PageProps {
    api: PiletCustomApi,
    match: MatchType,
    location: LocationType
}
export default ({ match, location }: PageProps) => {

  return (
    <>
      <h1>Manage {match.params.engineName}</h1>
      <ul>
        <li><Link to={`${location.pathname}/synonyms`}>Synonyms</Link></li>
      </ul>
    </>
  );
};
