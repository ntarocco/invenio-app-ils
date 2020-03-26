import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Sticky,
  Divider,
  Label,
  Menu,
  Grid,
  Ref,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { CopyButton, CreatedBy, Loader, Error } from '@components';
import { BorrowingRequestInformation } from './BorrowingRequestInformation';
import { DetailsHeader, EditButton } from '@pages/backoffice/components';
import { toShortDate } from '@api/date';
import { ILLRoutes, BackOfficeRoutes } from '@routes/urls';
import { ILLBorrowingRequestIcon } from '@pages/backoffice/components/icons';

class BorrowingRequestHeader extends React.Component {
  renderStatus(status) {
    switch (status) {
      case 'CANCELLED':
        return <Label color="grey">Cancelled</Label>;
      case 'PENDING':
        return <Label color="yellow">Pending</Label>;
      case 'REQUESTED':
        return <Label color="yellow">Requested</Label>;
      case 'ON_LOAN':
        return <Label color="green">On loan</Label>;
      case 'RETURNED':
        return <Label color="grey">Returned</Label>;
      default:
        throw new Error(`Unknown status: ${status}`);
    }
  }

  render() {
    const { data } = this.props;
    const library = data.metadata.library;
    const libraryLink = (
      <Link to={ILLRoutes.libraryDetailsFor(library.pid)}>{library.name}</Link>
    );
    const pid = data.metadata.pid;
    const recordInfo = (
      <>
        <label>Borrowing request</label> #{pid} <CopyButton text={pid} />
        {data.metadata.created_by && (
          <>
            <br />
            <label className="muted">Created by</label>{' '}
            <CreatedBy metadata={data.metadata} />
          </>
        )}
        <br />
        <label>Request date</label> {toShortDate(data.metadata.request_date)}
      </>
    );
    return (
      <DetailsHeader
        title={
          <>
            Borrowing request #{data.metadata.pid}{' '}
            {this.renderStatus(data.metadata.status)}
          </>
        }
        subTitle={<>From library: {libraryLink}</>}
        pid={data.metadata.pid}
        icon={<ILLBorrowingRequestIcon />}
        recordType="BorrowingRequest"
        recordInfo={recordInfo}
      />
    );
  }
}

class ActionMenu extends React.Component {
  constructor(props) {
    super(props);
    this.orderTopRef = props.anchors.orderTopRef;
    this.paymentInfoRef = props.anchors.paymentInfoRef;
    this.orderLinesRef = props.anchors.orderLinesRef;
    this.state = { activeItem: '' };
  }

  scrollTo(ref, menuItemName) {
    ref.current.scrollIntoView(false, { behaviour: 'smooth' });
    this.setState({ activeItem: menuItemName });
  }
  render() {
    const brwReq = this.props.data.metadata;
    const { activeItem } = this.state;

    return (
      <div className={'bo-action-menu'}>
        <EditButton fluid to={ILLRoutes.borrowingRequestEditFor(brwReq.pid)} />

        <Divider horizontal>Navigation</Divider>

        <Menu pointing secondary vertical fluid className="left">
          <Menu.Item
            name="brwReqInfo"
            active={activeItem === 'brwReqInfo'}
            onClick={(e, { name }) => this.scrollTo(this.brwReqTopRef, name)}
          >
            Borrowing request information
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default class BorrowingRequestDetails extends Component {
  constructor(props) {
    super(props);

    this.headerRef = React.createRef();
    this.menuRef = React.createRef();
    this.brwReqTopRef = React.createRef();
    this.anchors = {
      brwReqTopRef: this.brwReqTopRef,
    };
  }

  componentDidMount() {
    this.props.fetchBorrowingRequestDetails(
      this.props.match.params.borrowingRequestPid
    );
  }

  render() {
    const { isLoading, error, data } = this.props;
    return (
      <div ref={this.headerRef}>
        <Container>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <BorrowingRequestHeader data={data} />
                </Container>
                <Divider />
              </Sticky>

              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <Container fluid className="spaced">
                        <div ref={this.brwReqTopRef}>
                          {/* <OrderStatistics order={data.metadata} /> */}
                        </div>
                      </Container>
                      <Container fluid className="spaced">
                        {/* <BorrowingRequestInformation brwReq={data.metadata} /> */}
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={150}>
                        <ActionMenu data={data} anchors={this.anchors} />
                      </Sticky>
                    </Grid.Column>
                  </Grid>
                </Ref>
              </Container>
            </Error>
          </Loader>
        </Container>
      </div>
    );
  }
}

BorrowingRequestDetails.propTypes = {
  data: PropTypes.object.isRequired,
  fetchBorrowingRequestDetails: PropTypes.func.isRequired,
};
