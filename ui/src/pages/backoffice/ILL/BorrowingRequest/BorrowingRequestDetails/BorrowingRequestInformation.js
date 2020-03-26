import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { toShortDate } from '@api/date';
import { MetadataTable } from '@pages/backoffice/components';
import { PropTypes } from 'prop-types';
import { BackOfficeRoutes } from '@routes/urls';
import { DocumentIcon } from '@pages/backoffice/components';
import { PatronIcon } from '@pages/backoffice/components/icons';

export class BorrowingRequestInformation extends React.Component {
  dateOrDefault = value => {
    return value ? toShortDate(value) : '-';
  };

  render() {
    const brwReq = this.props.brwReq;
    const leftTable = [
      { name: 'Status', value: brwReq.status },
      {
        name: 'Document',
        value: (
          <Link to={BackOfficeRoutes.documentDetailsFor(brwReq.document_pid)}>
            <DocumentIcon /> {brwReq.document.title} TODO COMPONENT TO DISPLAY
            THE EDITION AND PUB YEAR
          </Link>
        ),
      },
      {
        name: 'Patron',
        value: (
          <Link to={BackOfficeRoutes.patronDetailsFor(brwReq.patron_pid)}>
            <PatronIcon /> {brwReq.patron.name}
          </Link>
        ),
      },
      { name: 'Requested on', value: this.dateOrDefault(brwReq.request_date) },
      {
        name: 'Received on',
        value: this.dateOrDefault(brwReq.received_date),
      },
      {
        name: 'Expected delivery',
        value: this.dateOrDefault(brwReq.expected_delivery_date),
      },
    ];
    const rightTable = [
      { name: 'Library', value: brwReq.vendor.name },
      { name: 'Notes', value: brwReq.notes },
    ];
    brwReq.status === 'CANCELLED' &&
      rightTable.append({ name: 'Cancel reason', value: brwReq.cancel_reason });
    return (
      <Grid columns={2} id="brwReq-info">
        <Grid.Row>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={leftTable} />
          </Grid.Column>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={rightTable} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

BorrowingRequestInformation.propTypes = {
  brwReq: PropTypes.object.isRequired,
};
