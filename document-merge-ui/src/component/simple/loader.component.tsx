import '@resources/sass/component/loader.component.sass';
import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import classNames from 'classnames';

interface LoaderProps {
    isFloat?: boolean;
    isShowHint?: boolean;
    className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ isFloat, isShowHint, className }) => {
    const loaderRef = React.useRef<HTMLDivElement>();

    React.useEffect(() => {
        const element = loaderRef.current;

        if (!isFloat || !element) {
            return;
        }
        element.parentElement.style.position = 'relative';
    }, []);

    const classes = classNames('loader', className, { loader_float: isFloat });

    return (
        <div className={classes} ref={loaderRef}>
            <div className='loader__content'>
                <CircularProgress color='inherit' />
                {isShowHint && <Typography className='loader__hint'>Loading...</Typography>}
            </div>
        </div>
    );
};
