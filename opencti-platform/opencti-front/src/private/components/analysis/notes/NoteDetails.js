import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { graphql, createFragmentContainer } from 'react-relay';
import withStyles from '@mui/styles/withStyles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import Chip from '@mui/material/Chip';
import inject18n from '../../../../components/i18n';

const styles = (theme) => ({
  paper: {
    height: '100%',
    minHeight: '100%',
    margin: '10px 0 0 0',
    padding: '15px',
    borderRadius: 6,
  },
  chip: {
    fontSize: 12,
    lineHeight: '12px',
    backgroundColor: theme.palette.background.accent,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
    borderRadius: '0',
    margin: '0 5px 5px 0',
  },
});

class NoteDetailsComponent extends Component {
  render() {
    const { t, classes, note } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Typography variant="h4" gutterBottom={true}>
          {t('Entity details')}
        </Typography>
        <Paper classes={{ root: classes.paper }} variant="outlined">
          <Typography variant="h3" gutterBottom={true}>
            {t('Abstract')}
          </Typography>
          <Markdown
            remarkPlugins={[remarkGfm, remarkParse]}
            parserOptions={{ commonmark: true }}
            className="markdown"
          >
            {note.attribute_abstract}
          </Markdown>
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Content')}
          </Typography>
          <Markdown
            remarkPlugins={[remarkGfm, remarkParse]}
            parserOptions={{ commonmark: true }}
            className="markdown"
          >
            {note.content}
          </Markdown>
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Note types')}
          </Typography>
          {note.note_types?.map((noteType) => (
            <Chip
              key={noteType}
              classes={{ root: classes.chip }}
              label={noteType}
            />
          ))}
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}>
            {t('Likelihood')}
          </Typography>
          {note.likelihood
            && <>{note.likelihood} %</>
          }
        </Paper>
      </div>
    );
  }
}

NoteDetailsComponent.propTypes = {
  note: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
};

const NoteDetails = createFragmentContainer(NoteDetailsComponent, {
  note: graphql`
    fragment NoteDetails_note on Note {
      id
      attribute_abstract
      content
      note_types
      likelihood
    }
  `,
});

export default compose(inject18n, withStyles(styles))(NoteDetails);
