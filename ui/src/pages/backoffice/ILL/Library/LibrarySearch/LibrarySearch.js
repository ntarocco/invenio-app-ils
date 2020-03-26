import React, { Component } from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';
import {
  Error,
  ResultsList,
  ReactSearchKit,
  ResultsLoader,
  SearchBar,
  InvenioSearchApi,
} from 'react-searchkit';
import {
  Error as IlsError,
  SearchBar as LibrarySearchBar,
  SearchControls,
} from '@components';
import { illLibrary as libraryApi } from '@api';
import { getSearchConfig } from '@config';
import { ILLRoutes } from '@routes/urls';
import { ExportReactSearchKitResults, NewButton } from '../../../components';
import {
  SearchFooter,
  SearchEmptyResults,
} from '@components/SearchControls/components/';
import history from '@history';
import { LibraryList } from './components/LibraryList';

export class LibrarySearch extends Component {
  searchApi = new InvenioSearchApi({
    url: libraryApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('libraries');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <LibrarySearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for libaries'}
      />
    );
  };

  renderEmptyResultsExtra = () => {
    return <NewButton text={'Add library'} to={ILLRoutes.libraryCreate} />;
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderLibraryList = results => {
    return <LibraryList hits={results} />;
  };

  render() {
    return (
      <>
        <Header as="h2">Libraries</Header>
        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="spaced">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Container fluid className="bo-search-body">
            <Grid>
              <Grid.Row columns={2}>
                <ResultsLoader>
                  <Grid.Column width={16}>
                    <Grid columns={2}>
                      <Grid.Column width={8}>
                        <NewButton
                          text={'Add library'}
                          to={ILLRoutes.libraryCreate}
                        />
                      </Grid.Column>
                      <Grid.Column width={8} textAlign={'right'}>
                        <ExportReactSearchKitResults
                          exportBaseUrl={libraryApi.searchBaseURL}
                        />
                      </Grid.Column>
                    </Grid>
                    <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                    <Error renderElement={this.renderError} />
                    <SearchControls modelName={'illLibraries'} />
                    <ResultsList renderElement={this.renderLibraryList} />
                    <SearchFooter />
                  </Grid.Column>
                </ResultsLoader>
              </Grid.Row>
            </Grid>
          </Container>
        </ReactSearchKit>
      </>
    );
  }
}
