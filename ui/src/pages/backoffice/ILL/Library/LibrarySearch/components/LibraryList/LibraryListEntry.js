import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Icon, Item, List } from 'semantic-ui-react';
import { ILLRoutes } from '@routes/urls';
import { illBorrowingRequest as brwReqApi } from '@api';
import { ILLLibraryIcon } from '@pages/backoffice/components/icons';

const LibraryListInfo = ({ library }) => (
  <List verticalAlign="middle" className={'document-circulation'}>
    <List.Item>
      <List.Content>
        email <strong>{library.metadata.email}</strong>
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Content>
        phone <strong>{library.metadata.phone}</strong>
      </List.Content>
    </List.Item>
  </List>
);

const LibraryOrderSearch = ({ library }) => {
  const brwReqQuery = brwReqApi
    .query()
    .withLibraryPid(library.metadata.pid)
    .qs();
  return (
    <List.Item>
      <List.Content>
        <Link to={ILLRoutes.borrowingRequestListWithQuery(brwReqQuery)}>
          <Icon name="search" />
          Find borrowing reqeuests
        </Link>
      </List.Content>
    </List.Item>
  );
};

export default class LibraryListEntry extends Component {
  renderMiddleColumn = library => {
    if (this.props.renderMiddleColumn) {
      return this.props.renderMiddleColumn(library);
    }
    return <LibraryListInfo library={library} />;
  };

  renderRightColumn = library => {
    if (this.props.renderRightColumn) {
      return this.props.renderRightColumn(library);
    }
    return <LibraryOrderSearch library={library} />;
  };

  renderAddress = () => {
    const address = this.props.library.metadata.address;
    if (!address) return null;

    return (
      <Item.Description>
        <p>
          {address.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </Item.Description>
    );
  };

  render() {
    const { library } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={ILLRoutes.libraryDetailsFor(library.metadata.pid)}
            data-test={`navigate-${library.metadata.pid}`}
          >
            <ILLLibraryIcon />
            {library.metadata.name}
          </Item.Header>
          <Item.Meta>Address:</Item.Meta>
          <Grid highlight={3}>
            <Grid.Column computer={6} largeScreen={6}>
              {this.renderAddress()}
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              {this.renderMiddleColumn(library)}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column computer={3} largeScreen={3}>
              {this.renderRightColumn(library)}
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className={'pid-field'}>#{library.metadata.pid}</div>
      </Item>
    );
  }
}

LibraryListEntry.propTypes = {
  library: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};
