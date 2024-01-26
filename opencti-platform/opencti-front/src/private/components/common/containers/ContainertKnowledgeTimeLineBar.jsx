import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { RelationManyToMany, CalendarMultiselectOutline } from 'mdi-material-ui';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchInput from '../../../../components/SearchInput';
import { useFormatter } from '../../../../components/i18n';
import { MESSAGING$ } from '../../../../relay/environment';
import Filters from '../lists/Filters';
import FilterIconButton from '../../../../components/FilterIconButton';
import { UserContext } from '../../../../utils/hooks/useAuth';

const useStyles = makeStyles(() => ({
  bottomNav: {
    zIndex: 1000,
    display: 'flex',
    overflow: 'hidden',
  },
  divider: {
    height: '51px',
    margin: '0 5px 0 5px',
    paddingTop: 3,
    paddingBottom: 3,
  },
}));

// TODO Fix ContentKnowledge
const ContentKnowledgeTimeLineBar = ({
  handleTimeLineSearch,
  timeLineSearchTerm,
  timeLineDisplayRelationships,
  handleToggleTimeLineDisplayRelationships,
  timeLineFunctionalDate,
  handleToggleTimeLineFunctionalDate,
  timeLineFilters,
  handleAddTimeLineFilter,
  handleRemoveTimeLineFilter,
  handleSwitchFilterLocalMode,
  handleSwitchFilterGlobalMode,
}) => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const [navOpen, setNavOpen] = useState(
    localStorage.getItem('navOpen') === 'true',
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sub = MESSAGING$.toggleNav.subscribe({
      next: () => setNavOpen(localStorage.getItem('navOpen') === 'true'),
    });
    return () => {
      sub.unsubscribe();
    };
  });
  return (
    <UserContext.Consumer>
      {({ bannerSettings }) => (
        <Drawer
          anchor="bottom"
          variant="permanent"
          classes={{ paper: classes.bottomNav }}
          PaperProps={{
            variant: 'elevation',
            elevation: 1,
            style: {
              paddingLeft: navOpen ? 185 : 60,
              bottom: bannerSettings.bannerHeightNumber,
            },
          }}
        >
          <div
            style={{
              height: open ? 108 : 54,
              minHeight: open ? 108 : 54,
              transition: 'height 0.2s linear',
            }}
          >
            <div
              style={{
                display: 'flex',

              }}
            >
              <Tooltip
                title={
                  timeLineDisplayRelationships
                    ? t_i18n('Do not display relationships')
                    : t_i18n('Display relationships')
              }
              >
                <span>
                  <IconButton
                    color={timeLineDisplayRelationships ? 'secondary' : 'primary'}
                    size="large"
                    onClick={() => handleToggleTimeLineDisplayRelationships()}
                  >
                    <RelationManyToMany/>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={
                                        timeLineFunctionalDate
                                          ? t_i18n('Use technical dates')
                                          : t_i18n('Use functional dates')
                                    }
              >
                <span>
                  <IconButton
                    color={timeLineFunctionalDate ? 'secondary' : 'primary'}
                    size="large"
                    onClick={() => handleToggleTimeLineFunctionalDate()}
                  >
                    <CalendarMultiselectOutline/>
                  </IconButton>
                </span>
              </Tooltip>
              <Divider className={classes.divider} orientation="vertical" />
              <div style={{ flexGrow: 0 }}>
                <SearchInput
                  variant="thin"
                  onSubmit={handleTimeLineSearch}
                  keyword={timeLineSearchTerm}
                />
              </div>
              <Divider className={classes.divider} orientation="vertical" />
              <div>
                <Filters
                  availableFilterKeys={[
                    'entity_type',
                    'objectMarking',
                    'objectLabel',
                    'createdBy',
                    'relationship_type',
                  ]}
                  availableEntityTypes={[
                    'Stix-Domain-Object',
                    'Stix-Cyber-Observable',
                  ]}
                  handleAddFilter={handleAddTimeLineFilter}
                />
              </div>
              <div style={{ flexGrow: 1 }}>
                <FilterIconButton
                  filters={timeLineFilters}
                  handleRemoveFilter={handleRemoveTimeLineFilter}
                  handleSwitchLocalMode={handleSwitchFilterLocalMode}
                  handleSwitchGlobalMode={handleSwitchFilterGlobalMode}
                  redirection
                />
              </div>
              <IconButton style={{ height: 'fit-content' }} onClick={() => setOpen(!open)}>
                <KeyboardArrowDownIcon />
              </IconButton>
            </div>
          </div>
        </Drawer>)}
    </UserContext.Consumer>
  );
};

export default ContentKnowledgeTimeLineBar;
