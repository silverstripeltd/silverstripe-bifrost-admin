import * as React from 'react';
import type { MatchType, LocationType } from '.';
import { Link } from 'react-router-dom';

interface PageProps {
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
