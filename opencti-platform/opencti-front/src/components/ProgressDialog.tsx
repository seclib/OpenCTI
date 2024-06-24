/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import makeStyles from '@mui/styles/makeStyles';
import { useFormatter } from './i18n';

class ProgressDialog {
    public constructor(private currentIncrement: number, private currentMaxIncrement: number = 100) {}

    public getCurrentIncrement(): number {
        return this.currentIncrement;
    }

    public getCurrentMaxIncrement(): number {
        return this.currentMaxIncrement;
    }

    public resetCurrentIncrement(): number {
        this.currentIncrement = 0;
        return this.currentIncrement;
    }

    public resetCurrentMaxIncrement(incrementValue: number): number {
        this.currentMaxIncrement = incrementValue;
        return this.currentMaxIncrement;
    }

    public setCurrentIncrement(incrementValue: number): number {
        this.currentIncrement += incrementValue;
        return this.currentIncrement;
    }

    public setCurrentMaxIncrement(incrementMaxValue: number): number {
        this.currentMaxIncrement = incrementMaxValue;
        return this.currentMaxIncrement;
    }
}

type ProgressDialogProps = {
    openProgressDialog: boolean
    handleClickCloseProgress: () => void
};

type LinearProgressClasses = {
    root: string
};

type LinearProgressProps = {
    classes: LinearProgressClasses
    variant?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
    value: number
};

const LinearProgressWithLabel = (props: LinearProgressProps) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', marginRight: 1 }}>
                <LinearProgress {...props} />
            </div>
            <div style={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </div>
        </div>
    );
};

const useStyles = makeStyles(() => ({
    progress: {},
}));

export const progressDialogStats = new ProgressDialog(0);

const ProgressDialogContainer: React.FC<ProgressDialogProps> = ({
    openProgressDialog,
    handleClickCloseProgress,
}) => {
    const { t_i18n } = useFormatter();
    const classes = useStyles();

    return (
        <Dialog
            open={openProgressDialog}
        >
            <DialogTitle id="alert-dialog-title">
                {'Progress'}
            </DialogTitle>
            <DialogContent>
                <div style={{ minWidth: '500px', width: '100%' }}>
                    <LinearProgressWithLabel
                        classes={{ root: classes.progress }}
                        variant="determinate"
                        value={100 * (progressDialogStats.getCurrentIncrement() / progressDialogStats.getCurrentMaxIncrement())}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickCloseProgress}>
                    {t_i18n('Close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProgressDialogContainer;
