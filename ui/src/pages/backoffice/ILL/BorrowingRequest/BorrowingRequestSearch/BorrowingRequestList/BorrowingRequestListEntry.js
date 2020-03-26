import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Item, List } from 'semantic-ui-react';
import { ILLRoutes, BackOfficeRoutes } from '@routes/urls';
import { toShortDateTime } from '@api/date';
import { formatPrice } from '@api/utils';
import { getDisplayVal } from '@config/invenioConfig';
import { ILLBorrowingRequestIcon } from '@pages/backoffice/components/icons';

export default class BorrowingRequestListEntry extends Component {
  renderLeftColumn = borrowingRequest => {
    return (
      <>
        <Item.Description>
          <Item.Meta>
            Request date:{' '}
            {toShortDateTime(borrowingRequest.metadata.request_date)}
          </Item.Meta>
        </Item.Description>
        <Item.Description>
          <label>status </label>
          {getDisplayVal(
            'illBorrowingRequests.statuses',
            borrowingRequest.metadata.status
          )}
        </Item.Description>
        <Item.Description>
          <label>library</label>
          <Link
            to={ILLRoutes.libraryDetailsFor(
              borrowingRequest.metadata.library_pid
            )}
          >
            {borrowingRequest.metadata.library.name}
          </Link>
        </Item.Description>
      </>
    );
  };

  renderOrderLine = (borrowingRequestLine, index) => {
    const documentPid = borrowingRequestLine.document_pid;
    const patronPid = borrowingRequestLine.patron_pid;
    const medium = borrowingRequestLine.medium;
    const documentLink = (
      <Link to={BackOfficeRoutes.documentDetailsFor(documentPid)}>
        <code>{documentPid}</code>
      </Link>
    );
    const totalPrice = formatPrice(borrowingRequestLine.total_price);
    return (
      <List.Item
        as="li"
        key={documentPid}
        value={`${borrowingRequestLine.copies_borrowingRequested}x`}
      >
        Document {documentLink} - {medium}
        {patronPid && (
          <>
            {' '}
            - Patron{' '}
            <Link to={BackOfficeRoutes.patronDetailsFor(patronPid)}>
              <code>{patronPid}</code>
            </Link>
          </>
        )}{' '}
        - <em>{totalPrice}</em>
      </List.Item>
    );
  };

  renderMiddleColumn = borrowingRequest => {
    if (this.props.renderMiddleColumn) {
      return this.props.renderMiddleColumn(borrowingRequest);
    }

    const documentPid = borrowingRequest.document_pid;
    const documentCmp = (
      <>
        Document{' '}
        <Link to={BackOfficeRoutes.documentDetailsFor(documentPid)}>
          <code>{documentPid}</code>
        </Link>
      </>
    );
    const patronPid = borrowingRequest.patron_pid;
    const patronCmp = (
      <>
        Patron{' '}
        <Link to={BackOfficeRoutes.patronDetailsFor(patronPid)}>
          <code>
            {borrowingRequest.patron.name} ({patronPid})
          </code>
        </Link>
      </>
    );

    return (
      <>
        <Item.Description>
          <Item.Meta>{documentCmp}</Item.Meta>
        </Item.Description>
        <Item.Description>
          <Item.Meta>{patronCmp}</Item.Meta>
        </Item.Description>
      </>
    );
  };

  renderRightColumn = borrowingRequest => {
    if (this.props.renderRightColumn) {
      return this.props.renderRightColumn(borrowingRequest);
    }
    const {
      received_date,
      expected_delivery_date,
      payment,
    } = borrowingRequest.metadata;
    return (
      <List verticalAlign="middle" className={'document-circulation'}>
        <List.Item>
          <List.Content floated="right">
            <strong>{payment.mode}</strong>
          </List.Content>
          <List.Content>payment mode</List.Content>
        </List.Item>
        {received_date && (
          <List.Item>
            <List.Content floated="right">
              <strong>{toShortDateTime(received_date)}</strong>
            </List.Content>
            <List.Content>received</List.Content>
          </List.Item>
        )}
        {expected_delivery_date && (
          <List.Item>
            <List.Content floated="right">
              <strong>{toShortDateTime(expected_delivery_date)}</strong>
            </List.Content>
            <List.Content>expected</List.Content>
          </List.Item>
        )}
      </List>
    );
  };

  render() {
    const { borrowingRequest } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={ILLRoutes.borrowingRequestDetailsFor(
              borrowingRequest.metadata.pid
            )}
            data-test={`navigate-${borrowingRequest.metadata.pid}`}
          >
            <ILLBorrowingRequestIcon />
            Borrowing Request: {borrowingRequest.metadata.pid}
          </Item.Header>
          <Grid highlight={3}>
            <Grid.Column computer={5} largeScreen={5}>
              {this.renderLeftColumn(borrowingRequest)}
            </Grid.Column>
            <Grid.Column computer={6} largeScreen={6}>
              {this.renderMiddleColumn(borrowingRequest)}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column computer={3} largeScreen={3}>
              {this.renderRightColumn(borrowingRequest)}
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className={'pid-field'}>#{borrowingRequest.metadata.pid}</div>
      </Item>
    );
  }
}

BorrowingRequestListEntry.propTypes = {
  borrowingRequest: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};
