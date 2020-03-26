import React from 'react';
import { Grid } from 'semantic-ui-react';
import { MetadataTable } from '@pages/backoffice';
import { EmailLink, CopyButton } from '@components';

export class LibraryInformation extends React.Component {
  render() {
    const library = this.props.library;
    const leftTable = [
      { name: 'Name', value: library.name },
      {
        name: 'Email',
        value: (
          <span>
            <EmailLink email={library.email} />{' '}
            <CopyButton text={library.email} />
          </span>
        ),
      },
      { name: 'Phone', value: library.phone },
    ];
    const rightTable = [
      { name: 'Address', value: library.address },
      { name: 'Notes', value: library.notes },
    ];
    return (
      <Grid columns={2} id="library-info">
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
