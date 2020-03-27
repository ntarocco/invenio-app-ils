import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Item } from 'semantic-ui-react';
import BorrowingRequestListEntry from './BorrowingRequestListEntry';

export default class BorrowingRequestList extends Component {
  renderListEntry = borrowingRequest => {
    if (this.props.renderListEntryElement) {
      return this.props.renderListEntryElement(borrowingRequest);
    }
    return (
      <BorrowingRequestListEntry
        key={borrowingRequest.metadata.pid}
        borrowingRequest={borrowingRequest}
      />
    );
  };

  render() {
    const { hits } = this.props;

    if (!hits.length)
      return (
        <Message data-test="no-results">
          There are no borrowing requests.
        </Message>
      );

    return (
      <Item.Group divided className="bo-document-search">
        {hits.map(hit => {
          return this.renderListEntry(hit);
        })}
      </Item.Group>
    );
  }
}

BorrowingRequestList.propTypes = {
  hits: PropTypes.array.isRequired,
  renderListEntryElement: PropTypes.func,
};
