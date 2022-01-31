/* eslint-disable */
import React, { Component, useEffect } from "react";
import * as PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import * as R from "ramda";
import { QueryRenderer } from "../../../relay/environment";
import {
  buildViewParamsFromUrlAndStorage,
  convertFilters,
  saveViewParameters,
} from "../../../utils/ListParameters";
import { truncate } from "../../../utils/String";
import percentage from "../../../utils/percentage";
import ListLines from "../../../components/list_lines/ListLines";
import inject18n from "../../../components/i18n";
import ToolBar from "../data/ToolBar";
import { isUniqFilter } from "../common/lists/Filters";
import Security, { KNOWLEDGE_KNUPDATE } from "../../../utils/Security";
import NewAnalysis from "./modals/NewAnalysis";
import Delete from "./modals/Delete";
import ExportCSV from "./modals/ExportCSV";
import GenerateReport from "./modals/GenerateReport";
import VulnerabilityScan from "./modals/VulnerabilityScan";
import DescriptionIcon from "@material-ui/icons/Description";
import AddIcon from "@material-ui/icons/Add";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ExploreIcon from "@material-ui/icons/Explore";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import CompareIcon from "@material-ui/icons/Compare";
import ScannerIcon from "@material-ui/icons/Scanner";
import PublishIcon from "@material-ui/icons/Publish";
import Popover from '@material-ui/core/Popover';
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import { DescriptionOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { fetchAllScans, deleteScan } from "../../../services/scan.service";
import {
  fetchAllAnalysis,
  getAnalysisSummary,
  exportAnalysisCsv,
  deleteAnalysis,
  createNewScanAnalysis,
  createVulnerabilityAssesmentReport,
} from "../../../services/analysis.service";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Chip from "@material-ui/core/Chip";

const classes = {
  root: {
    flexGrow: 1,
  },
  card: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 6,
    position: "relative",
  },
  cardHeader: {
    marginBottom: "0",
  },
  paper: {
    margin: "10px 0 0 0",
    padding: 0,
    borderRadius: 6,
  },
  item: {
    height: 50,
    minHeight: 50,
    maxHeight: 50,
    paddingRight: 0,
  },
  itemText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingRight: 24,
  },
  itemIconSecondary: {
    marginRight: 0,
  },
  number: {
    marginTop: 10,
    float: "left",
    fontSize: 30,
  },
  title: {
    marginTop: 5,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 500,
  },
  icon: {
    position: "absolute",
    top: 35,
    right: 20,
  },
  graphContainer: {
    width: "100%",
    padding: "20px 20px 0 0",
  },
  labelsCloud: {
    width: "100%",
    height: 300,
  },
  label: {
    width: "100%",
    height: 100,
    padding: 15,
  },
  labelNumber: {
    fontSize: 30,
    fontWeight: 500,
  },
  labelValue: {
    fontSize: 15,
  },
  itemAuthor: {
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    paddingRight: 24,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
  },
  itemType: {
    width: 100,
    minWidth: 100,
    maxWidth: 100,
    paddingRight: 24,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
  },
  itemDate: {
    width: 120,
    minWidth: 120,
    maxWidth: 120,
    paddingRight: 24,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
  },
};

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class Scans extends Component {

  constructor(props) {
    super(props);
    const params = buildViewParamsFromUrlAndStorage(
      props.history,
      props.location,
      `view-reports${props.objectId ? `-${props.objectId}` : ""}`
    );
    this.state = {
      sortBy: R.propOr("published", "sortBy", params),
      orderAsc: R.propOr(false, "orderAsc", params),
      searchTerm: R.propOr("", "searchTerm", params),
      view: R.propOr("lines", "view", params),
      filters: R.propOr({}, "filters", params),
      client_ID: null,
      openExports: false,
      numberOfElements: { number: 0, symbol: "" },
      selectedElements: null,
      selectAll: false,
      loadingScans: true,
      loadingAnalyses: true,
      dialogParams: null,
      vulnerabilityAnchorEl: null,
      sortByAnchorEl: null,
      popoverAnchorEl: null,
      analysisAnchorEl: null,
      renderScans: null,
      sortByLabel: "Scan Date",
      openDialog: false,
      loadDialog: null,
      openedPopoverId: null,
      pendingAnalysis: null
    };
  }

  sortScansByReportDate(unSorted) {
    const scans = unSorted
      .slice()
      .sort((a, b) =>
        new Date(a.report_date) < new Date(b.report_date) ? 1 : -1
      );
    return scans;
  }

  componentDidMount() {
    this.setState({client_ID: localStorage.getItem('client_id')},function() {
      fetchAllScans(this.state.client_ID)
        .then((response) => {
          const scans = response.data;

          this.setState({ scans: scans });
          this.setState({ scansReportDate: this.sortScansByReportDate(scans) });
          this.setState({ renderScans: scans });
          this.setState({ loadingScans: false });
        })
        .catch((error) => {
          console.log(error);
        });

      fetchAllAnalysis(this.state.client_ID)
        .then((response) => {
          let analyses = response.data;
          let scatterPlotData = [];

          analyses.forEach(analysis =>{
            getAnalysisSummary(analysis.id,this.state.client_ID)
              .then((response) => {
                let scatterPlot = [];

                response.data.forEach((item) => {
                  scatterPlot.push({ cwe_name: item.cwe_name, x: item.host_percent, y: item.score, score: item.score, host_count_total: item.host_count });
                });
                scatterPlotData.push(scatterPlot)
                this.setState({scatterPlotData: scatterPlotData});
              })
              .catch((error) => {
                console.log(error);
              })
          })
          this.setState({ analyses: analyses });
          this.setState({ loadingAnalyses: false });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  render() {

    const { t, n, fsd, mtd, theme } = this.props;
    const {
      scans,
      loadingScans,
      renderScans,
      scansReportDate,
      sortByLabel,
      loadingAnalyses,
      analyses,
      scatterPlotData,
      modalStyle,
      openDialog,
      loadDialog,
      dialogParams,
      popoverAnchorEl,
      openedPopoverId,
      openAnalysisMenu,
      pendingAnalysis
    } = this.state;

    const openPopover = Boolean(popoverAnchorEl);

    const handlePopoverOpen = (event, popoverId) => {
      this.setState({ popoverAnchorEl: event.currentTarget, openedPopoverId: popoverId });
    };

    const handlePopoverClose = () => {
      this.setState({ popoverAnchorEl: null, openedPopoverId: null });
    };

    const handleClick = (event) => {
      this.setState({ vulnerabilityAnchorEl: event.currentTarget });
    };

    const handleClose = () => {
      this.setState({ vulnerabilityAnchorEl: false });
    };

    const handleSortByClick = (event) => {
      this.setState({ sortByAnchorEl: event.currentTarget });
    };

    const handleSortByClose = () => {
      this.setState({ sortByAnchorEl: null });
    };

    const handleAnalysisClick = (event, analysis_id) => {
      this.setState({ analysisAnchorEl: event.currentTarget, openAnalysisMenu: analysis_id });
    };

    const handleAnalysisClose = () => {
      this.setState({ analysisByAnchorEl: null,  openAnalysisMenu: null});
    };

    const sortByReportDate = () => {
      this.setState({ sortByLabel: "Report Date" });
      this.setState({ renderScans: scansReportDate });
      this.setState({ sortByAnchorEl: null });
    };

    const sortByUploadDate = () => {
      this.setState({ sortByLabel: "Scan Date" });
      this.setState({ renderScans: scans });
      this.setState({ sortByAnchorEl: null });
    };

    const handleDialogOpen = (dialogParams) => {
      this.setState({ openDialog: true });
      this.setState({ dialogParams: dialogParams });
      this.setState({ vulnerabilityAnchorEl: null });
      this.setState({ analysisAnchorEl: null });
      this.setState({ analysisByAnchorEl: null,  openAnalysisMenu: null});
    };

    const handleDialogClose = () => {
      this.setState({ openDialog: false });
      this.setState({ openAnalysisMenu: null});
    };

    const handleLinkClink = (path, data) => {
      this.props.history.push({
        pathname: path,
        state: data
      });
    }

    const getCurrentScan = (id, scans) => {
      const scan = scans.find((i) => i.id === id);
      if (scan) {
        return scan;
      }
    }

    const onNewAnalysis = (id, client, params) => {
      const scanName = scans.filter((s) => s.id === params.scan_id)[0].scan_name
      this.setState({pendingAnalysis: scanName})
      createNewScanAnalysis(id, client, params)
        .then((response) => {
          handleDialogClose();
          setTimeout(() => {
            refreshAnalysis();
            this.setState({pendingAnalysis: null})
          }, 10000);
        })
        .catch((error) => {
          console.log(error);
        });

    };

    const onGenerateReport = (id, client, params) => {
      createVulnerabilityAssesmentReport(id, client, params)
        .then((response) => {
          this.setState({
            dialogParams: {
              modal: "Generate Report",
              success: true,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const onDeleteAnalysis = (id, client) => {
      deleteAnalysis(id, client)
        .then((response) => {
          handleDialogClose();
          refreshAnalysis();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const onExportAnalysis = (id, client) => {
      this.setState({
        dialogParams: { modal: "Export Data", isLoading: true },
      });
      exportAnalysisCsv(id, client)
        .then((response) => {
          this.setState({
            dialogParams: {
              modal: "Export Data",
              isLoading: false,
              success: true,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const refreshAnalysis = () => {
      this.setState({ loadingScans: true });
      this.setState({ loadingAnalyses: true });
      fetchAllScans(this.state.client_ID)
        .then((response) => {
          const scans = response.data;

          this.setState({ scans: scans });
          this.setState({ scansReportDate: this.sortScansByReportDate(scans) });
          this.setState({ renderScans: scans });
          this.setState({ loadingScans: false });
        })
        .catch((error) => {
          console.log(error);
        });
      fetchAllAnalysis(this.state.client_ID)
        .then((response) => {
          let analyses = response.data;
          let scatterPlotData = [];

          analyses.forEach(analysis =>{
            getAnalysisSummary(analysis.id,this.state.client_ID)
              .then((response) => {

                let scatterPlot = [];
                response.data.forEach((item) => {
                  scatterPlot.push({ cwe_name: item.cwe_name, x: item.host_percent, y: item.score, score: item.score, host_count_total: item.host_count });
                });

                scatterPlotData.push(scatterPlot)

                this.setState({scatterPlotData: scatterPlotData});

              })
              .catch((error) => {
                console.log(error);
              })
          })
          this.setState({ analyses: analyses });
          this.setState({ loadingAnalyses: false });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const rerenderParentCallback =() => {
      refreshAnalysis();
    }
    
    const renderDialogSwitch = () => {
      switch (this.state.dialogParams.modal) {
        case "New Analysis":
          return (
            <NewAnalysis
              id={this.state.dialogParams.id} // Scan ID
              isScan={this.state.dialogParams.isScan}
              client={this.state.dialogParams.client}
              onClose={handleDialogClose}
              action={onNewAnalysis}
            />
          );
        case "Generate Report":
          return (
            <GenerateReport
              id={this.state.dialogParams.id}
              client={this.state.dialogParams.client}
              scanName={this.state.dialogParams.scanName}
              success={this.state.dialogParams.success}
              onClose={handleDialogClose}
              action={onGenerateReport}
            />
          );
        case "Export Data":
          return (
            <ExportCSV
              id={this.state.dialogParams.id}
              client={this.state.dialogParams.client}
              isLoading={this.state.dialogParams.isLoading}
              success={this.state.dialogParams.success}
              onClose={handleDialogClose}
              action={onExportAnalysis}
            />
          );
        case "Delete Data":
          return (
            <Delete
              id={this.state.dialogParams.id}
              client={this.state.dialogParams.client}
              date={this.state.dialogParams.date}
              onClose={handleDialogClose}
              action={onDeleteAnalysis}
            />
          );
        case "Vulnerability Scan":
          return <VulnerabilityScan
            client_ID={this.state.client_ID}
            rerenderParentCallback={rerenderParentCallback}
            onClose={handleDialogClose}
          />;
        default:
          return "foo";
      }
    };

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div
            className="custom-tooltip"
            style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', fontSize: 12, borderRadius: 10, border: 1, padding: 10}}>
            <p className="label" style={{paddingBottom: 5}}>{payload[0].payload.cwe_name}</p>
            <p className="weakness" style={{paddingBottom: 5}}>{`Weakness Score: ${payload[0].payload.score}`}</p>
            <p className="host" style={{paddingBottom: 5}}>{`Hosts with Weakness: ${payload[0].payload.host_count_total} (${payload[0].payload.x}%)`}</p>
          </div>
        );
      }
      return null;
    };

    return (
      <div>
        <Grid container={true} spacing={3}>
          <Grid item={true} xs={4}>
            <Typography variant="h4" gutterBottom={true}>
              {t("How Your Vulnerabilities are Prioritized")}
            </Typography>
            <Paper
              classes={{ root: classes.paper }}
              elevation={2}
              style={{ height: 350, marginBottom: 20 }}
            >
              <CardContent>
                <p>
                  Your software and hardware keep your enterprise running.
                  Software and hardware have weaknesses, and those weaknesses
                  have vulnerabilities. The underlying weaknesses in your system
                  are the target of the adversary attacks.
                </p>
                <p>
                  What is the likelihood that a weakness will be exploited? What
                  are the consequences if it is exploited? These two factors are
                  considered when your vulnerabilities are examined.
                  Vulnerabilities with a lower probability of being exploited
                  are discounted. Weaknesses that have severe negative business
                  consequences are escalated.
                </p>
                <p>
                  For further technical information visit{" "}
                  <a
                    href="https://cwe.mitre.org/cwraf/introduction.html"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    cwe.mitre.org
                  </a>
                </p>
              </CardContent>
            </Paper>
          </Grid>
          <Grid item={true} xs={8}>
            <Typography variant="h4" gutterBottom={true}>
              {t("Vulnerability Scans")}
            </Typography>
            <Paper
              classes={{ root: classes.paper }}
              elevation={2}
              style={{ height: 350 }}
            >
              <CardContent style={{ height: 290, overflow: "hidden" }}>
                <CardHeader
                  style={{ padding: 0 }}
                  action={
                    <div>
                      <Button
                        color="primary"
                        style={{ marginTop: 0, marginBottom: 0 }}
                        className={classes.button}
                        endIcon={<ArrowDropDownIcon />}
                        onClick={handleSortByClick}
                      >
                        Sort By: {sortByLabel}
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={this.state.sortByAnchorEl}
                        keepMounted
                        open={this.state.sortByAnchorEl}
                        onClose={() => this.setState({ sortByAnchorEl: null })}
                      >
                        <MenuItem onClick={() => sortByReportDate()}>
                          <ListItemIcon>
                            <ScannerIcon fontSize="small" />
                          </ListItemIcon>
                          Scan Date
                        </MenuItem>
                        <MenuItem onClick={() => sortByUploadDate()}>
                          <ListItemIcon>
                            <PublishIcon fontSize="small" />
                          </ListItemIcon>
                          Upload Date
                        </MenuItem>
                      </Menu>
                    </div>
                  }
                />
                <List style={{ maxHeight: "100%", overflow: "auto" }}>
                  {!loadingScans ? (
                    renderScans.map((scan, i) => {
                      return (
                        <ListItem
                          key={scan.id}
                          onMouseEnter={(e) => handlePopoverOpen(e, scan.id)}
                          onMouseLeave={(e) => handlePopoverClose()}
                        >
                          <ListItemText primary={scan.scan_name} />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={handleClick}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id={"vulnerability-simple-menu-" + scan.id}
                              anchorEl={this.state.vulnerabilityAnchorEl}
                              open={this.state.vulnerabilityAnchorEl}
                              onClose={handleClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleDialogOpen({
                                    modal: "New Analysis",
                                    id: scan.id,
                                    isScan: true,
                                    client: this.state.client_ID,
                                  })
                                }
                              >
                                <ListItemIcon>
                                  <AddIcon fontSize="small" />
                                </ListItemIcon>
                                New Analysis
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleDialogOpen({ modal: "Rename" })
                                }
                              >
                                <ListItemIcon>
                                  <EditOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                Rename
                              </MenuItem>
                              <MenuItem>
                                <ListItemIcon>
                                  <DeleteIcon fontSize="small" />
                                </ListItemIcon>
                                Delete
                              </MenuItem>
                            </Menu>
                          </ListItemSecondaryAction>
                          <Popover
                            id="mouse-over-popover"
                            className={classes.popover}
                            classes={{
                              paper: classes.paper,
                            }}
                            style={{ pointerEvents: 'none'}}
                            open={openedPopoverId === scan.id}
                            anchorEl={popoverAnchorEl}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                          >
                            <List>
                              <ListItem>Report Name: {scan.report_name} </ListItem>
                              <ListItem>Policy Name: {scan.policy_name} </ListItem>
                              <ListItem>Scan Date: {scan.report_date}</ListItem>
                              <ListItem>Uploaded: {scan.upload_date}</ListItem>
                              <ListItem>Total Vulnerabilities: {scan.total_cve}</ListItem>
                              <ListItem>Unique Vulnerabilities: {scan.unique_cve}</ListItem>
                              <ListItem>Total Records: {scan.record_count_total}</ListItem>
                              <ListItem>...with vulnerabilities:
                                {scan.vulnerability_count}
                                {scan.record_count_total > 0 &&
                                  ` (${percentage(
                                    scan.vulnerability_count,
                                    scan.record_count_total
                                  )}%)`}
                              </ListItem>
                              <ListItem>Total Hosts: {scan.host_count_total}</ListItem>
                              <ListItem>...with vulnerabilities:
                                {scan.host_count}
                                {scan.host_count_total > 0 &&
                                  ` (${percentage(scan.host_count, scan.host_count_total)}%)`}
                              </ListItem>
                              <ListItem>Cyio Analysis {scan.analysis_count}</ListItem>
                            </List>
                          </Popover>
                        </ListItem>

                      );
                    })
                  ) : (
                    <ListItem className="card-body bg-secondary">
                      No Scans
                    </ListItem>
                  )}
                </List>
              </CardContent>
              <CardActions style={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  onClick={() =>
                    handleDialogOpen({ modal: "Vulnerability Scan" })
                  }
                >
                  Upload a Vulnerability Scan
                </Button>
              </CardActions>
            </Paper>
          </Grid>
        </Grid>
        {
          pendingAnalysis && (
            <Chip
              size="small"
              style={{height: '17px', fontSize: '0.9em', marginBottom: '10px', textAlign: 'center'}}
              label={`Pending Analysis: ${pendingAnalysis}`}
            />
          )
        }
        <Typography variant="h4" gutterBottom={true}>
          Analyses
          { loadingAnalyses ? <LinearProgress /> : null }
        </Typography>
        <Grid container={true} spacing={3}>
          {!loadingAnalyses ? (
            this.state.analyses.map((analysis, i) => {
              return (
                <Grid item={true} xs={4}>
                  <Paper
                    classes={{ root: classes.paper }}
                    elevation={2}
                    style={{ marginBottom: 20 }}
                  >
                    <CardHeader
                      style={{ padding: 16 }}
                      action={
                        <div>
                          <IconButton
                            aria-label="settings"
                            onClick={(e) => handleAnalysisClick(e, analysis.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id="simple-menu"
                            anchorEl={this.state.analysisAnchorEl}
                            open={openAnalysisMenu === analysis.id}
                            onClose={() =>
                              this.setState({ analysisAnchorEl: null, openAnalysisMenu: null })
                            }
                          >
                            <MenuItem
                              onClick={() =>
                                handleLinkClink('/dashboard/vsac/scans/exploreresults',
                                  { analysis: analysis,
                                    client:
                                      this.state.client_ID,
                                    scan: getCurrentScan(analysis.scan.id, scans)
                                  })}
                            >
                              <ListItemIcon>
                                <ExploreIcon fontSize="small" />
                              </ListItemIcon>
                              Explore Results
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleLinkClink('/dashboard/vsac/scans/viewcharts',
                                  {
                                    analysis_id: analysis.id,
                                    analyses: this.state.analyses,
                                  })
                              }
                            >
                              <ListItemIcon>
                                <ShowChartIcon fontSize="small" />
                              </ListItemIcon>
                              View Charts
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleLinkClink('/dashboard/vsac/scans/compare',
                                  { analyses: this.state.analyses,
                                    scatterPlotData: this.state.scatterPlotData
                                  })}
                            >
                              <ListItemIcon>
                                <CompareIcon fontSize="small" />
                              </ListItemIcon>
                              Compare
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDialogOpen({
                                  modal: "Generate Report",
                                  id: analysis.id,
                                  client:
                                    this.state.client_ID,
                                  scanName: analysis.scan.scan_name,
                                  success: false,
                                })
                              }
                            >
                              <ListItemIcon>
                                <DescriptionIcon fontSize="small" />
                              </ListItemIcon>
                              Generate Report
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDialogOpen({
                                  modal: "Export Data",
                                  id: analysis.id,
                                  client:
                                    this.state.client_ID,
                                  isLoading: false,
                                  success: false,
                                })
                              }
                            >
                              <ListItemIcon>
                                <ImportExportIcon fontSize="small" />
                              </ListItemIcon>
                              Export Data (CVS)
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDialogOpen({
                                  modal: "New Analysis",
                                  id: analysis.id,
                                  isScan: false,
                                  client:
                                    this.state.client_ID,
                                })
                              }
                            >
                              <ListItemIcon>
                                <AddIcon fontSize="small" />
                              </ListItemIcon>
                              New Analysis
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDialogOpen({
                                  modal: "Delete Data",
                                  id: analysis.id,
                                  client:
                                    this.state.client_ID,
                                  date: analysis.completed_date,
                                })
                              }
                            >
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                              </ListItemIcon>
                              Delete Analysis
                            </MenuItem>
                          </Menu>
                        </div>
                      }
                      title={truncate(t(analysis.scan.scan_name),30)}
                      subheader={moment(analysis.completed_date).fromNow()}
                    />
                    <CardContent>
                      {(scatterPlotData && scatterPlotData[i]) && (
                        <ResponsiveContainer width="100%" aspect={1}>
                          <ScatterChart
                            width={200}
                            height={200}
                            margin={{
                              top: 0,
                              right: 0,
                              bottom: 20,
                              left: 0,
                            }}
                          >
                            <XAxis
                              type="number"
                              dataKey="x"
                              label= {{
                                value: "% of Hosts with Weakness",
                                fill: 'white',
                              }}
                              domain={[-200, 200]}
                              tick={false}
                            />
                            <YAxis
                              type="number"
                              dataKey="y"
                              label={{
                                value: 'Weakness Score',
                                angle: -90,
                                fill: 'white',
                              }}
                              domain={[-200, 200]}
                              tick={false}
                            />
                            <ZAxis range={[250]} />
                            <ReferenceLine x={0} stroke="white" />
                            <ReferenceLine y={0} stroke="white" />
                            <Tooltip
                              content={<CustomTooltip />}
                              cursor={false}
                            />
                            { scatterPlotData && (
                              <Scatter
                                name={analysis.scan.scan_name}
                                data={this.state.scatterPlotData[i]}
                                fill="#49B8FC"
                              />
                            )}
                          </ScatterChart>
                        </ResponsiveContainer>
                      )}
                      {analysis.completed_date && (
                        <Chip
                          size="small"
                          style={{ margin: 3 }}
                          label={moment(analysis.completed_date).fromNow()}
                        />
                      )}
                      {analysis.weakness_range && (
                        <Chip
                          size="small"
                          style={{ margin: 3 }}
                          label={`Top  ${analysis.weakness_range}`}
                        />
                      )}
                      {analysis.vulnerability_range && (
                        <Chip
                          size="small"
                          style={{ margin: 3 }}
                          label={`Previous ${analysis.vulnerability_range} Years`}
                        />
                      )}
                      {analysis.vignette_name && (
                        <Chip
                          size="small"
                          style={{ margin: 3 }}
                          label={analysis.vignette_name}
                        />
                      )}
                    </CardContent>
                    <CardActions style={{ justifyContent: "right" }}>
                      <Button
                        disabled={loadingAnalyses}
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        onClick={() =>
                          handleLinkClink('/dashboard/vsac/scans/exploreresults',
                            { analysis: analysis,
                              client: this.state.client_ID,
                              scan: getCurrentScan(analysis.scan.id, scans)
                            })}
                      >
                        Explore Results
                      </Button>
                    </CardActions>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid item={true} xs={12}>
              <Paper
                classes={{ root: classes.paper }}
                elevation={2}
                style={{ height: 350 }}
              >
                No analyses
              </Paper>
            </Grid>
          )}
          <Dialog
            open={openDialog}
            onClose={() => handleDialogClose()}
            maxWidth="md"
          >
            <div>{this.state.dialogParams && renderDialogSwitch()}</div>
          </Dialog>
        </Grid>
      </div>
    );
  }
}

Scans.propTypes = {
  objectId: PropTypes.string,
  authorId: PropTypes.string,
  t: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  displayCreate: PropTypes.bool,
  onChangeOpenExports: PropTypes.func,
};

export default R.compose(inject18n, withRouter)(Scans);
