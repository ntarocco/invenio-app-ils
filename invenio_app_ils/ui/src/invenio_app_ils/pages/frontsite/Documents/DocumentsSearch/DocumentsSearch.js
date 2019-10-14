import React, { Component } from 'react';
import {
  Button,
  Container,
  Grid,
  Icon,
  Header,
  Responsive,
} from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsLoader,
  Error,
  InvenioSearchApi,
} from 'react-searchkit';
import { getSearchConfig } from '../../../../common/config';
import {
  Error as IlsError,
  SearchBar as DocumentsSearchBar,
} from '../../../../common/components';
import { document as documentApi } from '../../../../common/api';
import { SearchControls } from '../../../../common/components';
import {
  SearchAggregationsCards,
  SearchFooter,
  SearchEmptyResults,
} from '../../../../common/components/SearchControls/components';
import { DocumentsSearchMobile } from './DocumentsSearchMobile';
import { SearchMessage } from './components';
import { DocumentSearchResultsGrid } from './components/DocumentSearchResultsGrid';
import { DocumentSearchResultsList } from './components/DocumentSearchResultsList/';

export class DocumentsSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: documentApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('documents');
  state = { activeIndex: 0, isLayoutGrid: true };

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <DocumentsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for records...'}
      />
    );
  };

  renderResultsLayoutOptions = () => {
    const toggleLayout = () => {
      this.setState({ isLayoutGrid: !this.state.isLayoutGrid });
    };
    return (
      <Button.Group basic icon className={'search-layout-toggle'}>
        <Button disabled={this.state.isLayoutGrid} onClick={toggleLayout}>
          <Icon name="grid layout" />
        </Button>
        <Button disabled={!this.state.isLayoutGrid} onClick={toggleLayout}>
          <Icon name="list layout" />
        </Button>
      </Button.Group>
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderCount = totalResults => {
    return <div>{totalResults} results</div>;
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi}>
        <Container fluid className="document-details-search-container">
          <Container>
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
        </Container>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Container fluid className="search-body">
            <Grid
              columns={2}
              stackable
              relaxed
              className="grid-documents-search"
            >
              <ResultsLoader>
                <Grid.Column width={3} className="search-aggregations">
                  <Header content={'Filter by'} />
                  <SearchAggregationsCards />
                </Grid.Column>
                <Grid.Column width={13} className="search-results">
                  <SearchEmptyResults />

                  <Error renderElement={this.renderError} />

                  <SearchControls
                    layoutToggle={this.renderResultsLayoutOptions}
                  />
                  {this.state.isLayoutGrid ? (
                    <DocumentSearchResultsGrid />
                  ) : (
                    <DocumentSearchResultsList />
                  )}
                  <Container fluid className={'search-results-footer'}>
                    <SearchFooter />
                    <Container className={'search-results-message'}>
                      <SearchMessage />
                    </Container>
                  </Container>
                </Grid.Column>
              </ResultsLoader>
            </Grid>
          </Container>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <DocumentsSearchMobile />
        </Responsive>
      </ReactSearchKit>
    );
  }
}