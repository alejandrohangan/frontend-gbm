import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TruncatedTooltipText = ({ text, maxWidth = 200, placement = 'top' }) => (
    <OverlayTrigger
        placement={placement}
        overlay={<Tooltip>{text}</Tooltip>}
    >
        <span
            className="text-truncate d-inline-block"
            style={{ maxWidth, cursor: 'pointer' }}
        >
            {text}
        </span>
    </OverlayTrigger>
);

export default TruncatedTooltipText;